"use server"

import { signOut as nextAuthSignOut } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/mail"
import crypto from "crypto"

export async function handleSignOut() {
    await nextAuthSignOut()
}

function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex")
}

export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    // Validate inputs
    if (!email || !password || !fullName) {
        return { error: "Missing required fields" }
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" }
    }

    const supabase = await createClient()

    // Sign up user in Supabase Auth (without email confirmation)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (authError) {
        return { error: authError.message }
    }

    if (!authData.user?.id) {
        return { error: "Failed to create user account" }
    }

    // Create profile record
    const { error: profileError } = await supabase
        .from("profiles")
        .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role: "customer",
            is_verified: false,
        })

    if (profileError) {
        // Clean up: delete the auth user if profile creation fails
        try {
            await supabase.auth.admin.deleteUser(authData.user.id)
        } catch (err) {
            console.error("Failed to clean up user:", err)
        }
        return { error: "Failed to create user profile. Please try again." }
    }

    // Generate verification token
    const token = generateVerificationToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store verification token
    const { error: tokenError } = await supabase
        .from("verification_tokens")
        .insert({
            user_id: authData.user.id,
            email,
            token,
            expires_at: expiresAt.toISOString(),
        })

    if (tokenError) {
        console.error("Failed to store verification token:", tokenError)
        return { error: "Failed to create verification token. Please try again." }
    }

    // Send verification email via Nodemailer
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`
    const emailResult = await sendEmail({
        to: email,
        subject: "Verify your StayEase account",
        text: `Welcome to StayEase! Please verify your email by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 24 hours.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0d9488;">Welcome to StayEase!</h2>
                <p>Hi ${fullName},</p>
                <p>Thank you for signing up. Please verify your email address to complete your account setup.</p>
                <p style="margin: 30px 0;">
                    <a href="${verificationLink}" style="background-color: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                        Verify Email
                    </a>
                </p>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationLink}</p>
                <p style="margin-top: 30px; color: #999; font-size: 12px;">
                    This link will expire in 24 hours. If you didn't sign up for this account, you can ignore this email.
                </p>
            </div>
        `,
    })

    if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error)
        // Note: We don't fail registration if email fails, but log it for debugging
        return {
            success: true,
            warning: "Account created but verification email could not be sent. Please try resending verification email."
        }
    }

    return { success: true }
}


