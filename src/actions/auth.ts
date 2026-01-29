"use server"

import { signOut as nextAuthSignOut } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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
    const recentAttempts = attempts.filter(time => now - time < limit)

    if (recentAttempts.length >= 5) {
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

    if (!email || !password || !fullName) {
        return { error: "Missing required fields" }
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" }
    }

    if (!checkEmailRateLimit(email)) {
        return { error: "Too many attempts. Please wait 5 minutes." }
    }

    const supabase = await createClient()
    const adminClient = await createAdminClient()

    // Check if email already exists (use admin to bypass RLS)
    const { data: existingProfile } = await adminClient
        .from("profiles")
        .select("id, is_verified")
        .eq("email", email)
        .single()

    if (existingProfile) {
        if (!existingProfile.is_verified) {
            return {
                error: "This email is already registered but not verified. Please check your inbox or sign in to resend the code."
            }
        }
        return { error: "This email is already registered. Please sign in instead." }
    }

    // 1. Sign up user in Supabase Auth
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
        if (authError.message.toLowerCase().includes("rate limit")) {
            return { error: "Security limit reached. Please try again in an hour." }
        }
        return { error: authError.message }
    }

    if (!authData.user?.id) {
        return { error: "Failed to initialize user account" }
    }

    const userId = authData.user.id

    try {
        // 2. Create profile record (using admin client to bypass RLS)
        const { error: profileError } = await adminClient
            .from("profiles")
            .insert({
                id: userId,
                email,
                full_name: fullName,
                role: "customer",
                is_verified: false,
            })

        if (profileError) {
            console.error("Profile creation error:", profileError)
            throw new Error("Could not create user profile.")
        }

        // 3. Generate and store verification code
        const code = generateVerificationCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        const { error: tokenError } = await adminClient
            .from("verification_tokens")
            .insert({
                user_id: userId,
                email,
                token: code,
                expires_at: expiresAt.toISOString(),
            })

        if (tokenError) {
            console.error("Token creation error:", tokenError)
            throw new Error("Could not generate verification code.")
        }

        // 4. Send verification email
        try {
            const emailResult = await sendEmail({
                to: email,
                subject: "Verify your StayEase Account",
                text: `Welcome to StayEase! Your verification code is: ${code}`,
                html: `
                    <div style="background-color: #fdfaf5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; color: #1e293b; line-height: 1.6;">
                        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #f1e5d1;">
                            <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 40px 20px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">StayEase</h1>
                            </div>
                            <div style="padding: 40px; text-align: center;">
                                <h2 style="color: #0d9488; margin-bottom: 8px; font-size: 24px; font-weight: 700;">Verify your email</h2>
                                <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Hi ${fullName}, welcome to StayEase. Use the code below to complete your registration.</p>
                                
                                <div style="background: #fdfaf5; border: 2px dashed #f1e5d1; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                                    <div style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Your Verification Code</div>
                                    <div style="font-size: 42px; font-weight: 800; color: #1e293b; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">${code}</div>
                                </div>
                                
                                <p style="color: #94a3b8; font-size: 13px;">This code will expire in <span style="color: #0d9488; font-weight: 600;">10 minutes</span>. If you didn't request this, you can safely ignore this email.</p>
                            </div>
                            <div style="background-color: #fefce8; padding: 20px; text-align: center; border-top: 1px solid #fef3c7;">
                                <p style="color: #b45309; font-size: 12px; margin: 0;">&copy; 2026 StayEase Luxury Hotels. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                `,
            })

            if (!emailResult.success) {
                return {
                    success: true,
                    emailError: true,
                    warning: "Account created but we had trouble sending the email. You can resend it from the verification page."
                }
            }
        } catch (emailErr) {
            console.error("Email sending exception:", emailErr)
            return {
                success: true,
                emailError: true,
                warning: "Account created but email sending failed. Please try resending the code."
            }
        }

        return { success: true }

    } catch (operationError: any) {
        console.error("Registration failed:", operationError.message)
        // Cleanup: delete the auth user since profile or token creation failed
        try {
            const adminClient = await createAdminClient()
            await adminClient.auth.admin.deleteUser(userId)
            console.log("Cleanup: Successfully deleted zombie user", email)
        } catch (cleanupErr) {
            console.error("Cleanup failed. User might be stuck in Auth system:", cleanupErr)
        }
        return { error: operationError.message || "Failed to complete registration. Please try again." }
    }
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
            subject: "New Verification Code - StayEase",
            text: `Hi ${fullName}, your new verification code is: ${code}`,
            html: `
                <div style="background-color: #fdfaf5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; color: #1e293b; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #f1e5d1;">
                        <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">StayEase</h1>
                        </div>
                        <div style="padding: 40px; text-align: center;">
                            <h2 style="color: #0d9488; margin-bottom: 8px; font-size: 24px; font-weight: 700;">New Code Request</h2>
                            <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">Hi ${fullName}, here is your new verification code as requested.</p>
                            
                            <div style="background: #fdfaf5; border: 2px dashed #f1e5d1; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                                <div style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">New Verification Code</div>
                                <div style="font-size: 42px; font-weight: 800; color: #1e293b; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">${code}</div>
                            </div>
                            
                            <p style="color: #94a3b8; font-size: 13px;">This code will expire in <span style="color: #0d9488; font-weight: 600;">10 minutes</span>.</p>
                        </div>
                         <div style="background-color: #fefce8; padding: 20px; text-align: center; border-top: 1px solid #fef3c7;">
                            <p style="color: #b45309; font-size: 12px; margin: 0;">&copy; 2026 StayEase Luxury Hotels. All rights reserved.</p>
                        </div>
                    </div>
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

    const adminClient = await createAdminClient()

    // Mark user as verified in profiles table
    const { error: updateError } = await adminClient
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", tokens.user_id)

    if (updateError) {
        console.error("Failed to mark user as verified in profiles:", updateError)
        return { error: "Failed to verify email. Please try again." }
    }

    // Also mark as verified in Supabase Auth
    try {
        const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(
            tokens.user_id,
            { email_confirm: true }
        )
        if (authUpdateError) {
            console.error("Failed to confirm email in Supabase Auth:", authUpdateError)
            // We don't necessarily want to fail here if the profile update succeeded,
            // but it will cause login issues.
        }
    } catch (err) {
        console.error("Error updating auth user:", err)
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

