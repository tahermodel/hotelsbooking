"use server"

import { signOut as nextAuthSignOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/mail"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function handleSignOut() {
    await nextAuthSignOut()
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
    const email = (formData.get("email") as string).toLowerCase().trim()
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

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            if (!existingUser.is_verified) {
                // Determine if we should allow re-registration or just say "check email"
                // For security, usually "User already exists" is better, but UX wise:
                return {
                    error: "This email is already registered but not verified. Please check your inbox or sign in to resend the code."
                }
            }
            return { error: "This email is already registered. Please sign in instead." }
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 3. Create user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: fullName,
                role: "customer", // Default role
                is_verified: false,
            }
        })

        // 4. Generate verification code
        const code = generateVerificationCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

        // 5. Store verification code
        // We use the 'identifier' + 'token' composite key from NextAuth schema or similar
        // My schema has VerificationToken: identifier, token, expires.
        // Identifier can be the email (standard NextAuth practice).
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: code,
                expires: expiresAt
            }
        })

        // 6. Send verification email
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
        return { error: operationError.message || "Failed to complete registration. Please try again." }
    }
}

export async function resendVerificationEmail(email: string) {
    // Check rate limit
    if (!checkEmailRateLimit(email)) {
        return { error: "Too many requests. Please try again in 5 minutes." }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            return { error: "Account not found. Please register." }
        }

        if (user.is_verified) {
            return { error: "Email is already verified. Please sign in." }
        }

        // Generate new code
        const code = generateVerificationCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Delete existing tokens
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        })

        // Create new token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: code,
                expires: expiresAt
            }
        })

        const fullName = user.name || "User"

        // Send Email
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
    try {
        // Find verification token
        // Use findFirst because composite key in where might be tricky if we don't have both parts exactly as expected by Prisma Client unique constraints (but we do).
        // Actually, composite unique is findUnique({ where: { identifier_token: { identifier: email, token: code } } })

        const tokenRecord = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: code,
                expires: {
                    gt: new Date()
                }
            }
        })

        if (!tokenRecord) {
            return { error: "Invalid or expired verification code" }
        }

        // Mark user as verified
        const user = await prisma.user.update({
            where: { email },
            data: {
                is_verified: true,
                emailVerified: new Date(),
            }
        })

        // Delete the used token(s)
        await prisma.verificationToken.deleteMany({
            where: { identifier: email }
        })

        return { success: true }
    } catch (error) {
        console.error("Verification error:", error)
        return { error: "Failed to verify email. Please try again." }
    }
}

