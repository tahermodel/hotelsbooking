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

function generateVerificationCode(): string {
    // Generate a 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Simple in-memory rate limiting (for production, use Redis)
const emailSendAttempts = new Map<string, number[]>()

function checkEmailRateLimit(email: string): boolean {
    const now = Date.now()
    const limit = 5 * 60 * 1000 // 5 minute window

    if (!emailSendAttempts.has(email)) {
        emailSendAttempts.set(email, [now])
        return true
    }

    const attempts = emailSendAttempts.get(email)!
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < limit)

    if (recentAttempts.length >= 3) {
        // Max 3 emails per 5 minutes per email address
        return false
    }

    recentAttempts.push(now)
    emailSendAttempts.set(email, recentAttempts)
    return true
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

    // Check rate limit
    if (!checkEmailRateLimit(email)) {
        return { error: "Too many registration attempts. Please try again in 5 minutes." }
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

    // Generate verification code (6 digits)
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store verification code
    const { error: tokenError } = await supabase
        .from("verification_tokens")
        .insert({
            user_id: authData.user.id,
            email,
            token: code,
            expires_at: expiresAt.toISOString(),
        })

    if (tokenError) {
        console.error("Failed to store verification code:", tokenError)
        return { error: "Failed to create verification code. Please try again." }
    }

    // Send verification email via Nodemailer with code
    try {
        const emailResult = await sendEmail({
            to: email,
            subject: "Your StayEase verification code",
            text: `Welcome to StayEase! Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0d9488;">Welcome to StayEase!</h2>
                    <p>Hi ${fullName},</p>
                    <p>Thank you for signing up. Please verify your email address using the code below.</p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
                        <p style="font-size: 12px; margin: 0; color: #666;">Your verification code</p>
                        <p style="font-size: 36px; font-weight: bold; margin: 10px 0; letter-spacing: 2px; color: #0d9488;">${code}</p>
                    </div>
                    <p style="color: #666; font-size: 14px; margin: 20px 0;">
                        This code will expire in 10 minutes.
                    </p>
                    <p style="margin-top: 30px; color: #999; font-size: 12px;">
                        If you didn't sign up for this account, you can ignore this email.
                    </p>
                </div>
            `,
        })

        if (!emailResult.success) {
            console.error("Failed to send verification email:", emailResult.error)
            // Return partial success - account created but email not sent
            return {
                success: true,
                emailError: true,
                warning: "Account created but verification email could not be sent. You can request a new verification email after logging in."
            }
        }
    } catch (emailError) {
        console.error("Email sending exception:", emailError)
        return {
            success: true,
            emailError: true,
            warning: "Account created but we encountered an issue sending the verification email. Please try again later."
        }
    }

    return { success: true }
}

export async function resendVerificationEmail(email: string) {
    // Check rate limit
    if (!checkEmailRateLimit(email)) {
        return { error: "Too many requests. Please try again in 5 minutes." }
    }

    const supabase = await createClient()

    // 1. Check if user exists and is not verified
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, is_verified")
        .eq("email", email)
        .single()

    if (!profile) {
        return { error: "Account not found. Please register." }
    }

    if (profile.is_verified) {
        return { error: "Email is already verified. Please sign in." }
    }

    // 2. Generate new verification code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // 3. Cleanup any existing/expired tokens for this user
    await supabase
        .from("verification_tokens")
        .delete()
        .eq("user_id", profile.id)

    // 4. Store new verification code
    const { error: tokenError } = await supabase
        .from("verification_tokens")
        .insert({
            user_id: profile.id,
            email,
            token: code,
            expires_at: expiresAt.toISOString(),
        })

    if (tokenError) {
        console.error("Failed to store verification code:", tokenError)
        return { error: "Failed to generate verification code. Please try again." }
    }

    const fullName = profile.full_name || "User"

    try {
        const emailResult = await sendEmail({
            to: email,
            subject: "Your StayEase verification code",
            text: `Hi ${fullName},\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #0d9488;">Verify your email</h2>
                    <p>Hi ${fullName},</p>
                    <p>Please verify your email address using the code below.</p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
                        <p style="font-size: 12px; margin: 0; color: #666;">Your verification code</p>
                        <p style="font-size: 36px; font-weight: bold; margin: 10px 0; letter-spacing: 2px; color: #0d9488;">${code}</p>
                    </div>
                    <p style="color: #666; font-size: 14px; margin: 20px 0;">
                        This code will expire in 10 minutes.
                    </p>
                </div>
            `,
        })

        if (!emailResult.success) {
            return { error: "Failed to send verification email. Please try again." }
        }

        return { success: true }
    } catch (error) {
        console.error("Email resend error:", error)
        return { error: "An error occurred while sending the email. Please try again." }
    }
}

export async function verifyCode(email: string, code: string) {
    const supabase = await createClient()

    // Find and validate the verification code
    const { data: tokens, error: queryError } = await supabase
        .from("verification_tokens")
        .select("*")
        .eq("email", email)
        .eq("token", code)
        .gt("expires_at", new Date().toISOString())
        .single()

    if (queryError || !tokens) {
        return { error: "Invalid or expired verification code" }
    }

    // Mark user as verified
    const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", tokens.user_id)

    if (updateError) {
        console.error("Failed to mark user as verified:", updateError)
        return { error: "Failed to verify email. Please try again." }
    }

    // Delete the used verification code
    const { error: deleteError } = await supabase
        .from("verification_tokens")
        .delete()
        .eq("id", tokens.id)

    if (deleteError) {
        console.error("Failed to delete verification code:", deleteError)
        // Continue anyway - the code is expired after use
    }

    return { success: true }
}

