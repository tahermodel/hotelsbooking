"use server"

import { signOut as nextAuthSignOut, signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/mail"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export async function handleSignOut() {
    await nextAuthSignOut()
}

export async function generateVerificationCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString()
}


import { EmailTemplates } from "@/lib/email-templates"

export async function sendVerificationEmail(email: string, name: string, code: string) {
    return await sendEmail({
        to: email,
        subject: "Verify your StayEase Account",
        text: `Welcome to StayEase! Your verification code is: ${code}`,
        html: EmailTemplates.verification(name, code)
    })
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
                return {
                    error: "This email exists, please sign in to it to verify your account."
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
        const code = await generateVerificationCode()
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
            const emailResult = await sendVerificationEmail(email, fullName, code)

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
        const normalizedEmail = email.toLowerCase().trim()

        // 1. Try to find user
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        })

        // 2. Try to find existing token (to preserve data for pending updates)
        const existingToken = await prisma.verificationToken.findFirst({
            where: { identifier: normalizedEmail }
        })

        // Logic:
        // - If user exists and verified: Error (already verified) UNLESS there is a pending token (e.g. password change)
        // - If user exists and unverified: OK (Resend registration code)
        // - If user does NOT exist but token exists: OK (Pending email change)
        // - If neither: Error

        if (user?.is_verified && !existingToken) {
            return { error: "Email is already verified. Please sign in." }
        }

        if (!user && !existingToken) {
            return { error: "Account not found. Please register." }
        }

        // Generate new code
        const code = await generateVerificationCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Capture data from existing token to preserve pending updates
        const preservedData = existingToken?.data

        // Delete existing tokens
        await prisma.verificationToken.deleteMany({
            where: { identifier: normalizedEmail }
        })

        // Create new token
        await prisma.verificationToken.create({
            data: {
                identifier: normalizedEmail,
                token: code,
                expires: expiresAt,
                data: preservedData
            }
        })

        const name = user?.name || "User"

        // Send Email
        const emailResult = await sendVerificationEmail(normalizedEmail, name, code)

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
    const normalizedEmail = email.toLowerCase().trim()

    try {
        const tokenRecord = await prisma.verificationToken.findFirst({
            where: {
                identifier: normalizedEmail,
                token: code,
                expires: {
                    gt: new Date()
                }
            }
        })

        if (!tokenRecord) {
            return { error: "Invalid or expired verification code" }
        }

        // Check for pending updates (email/password change)
        if (tokenRecord.data) {
            try {
                const pendingUpdates = JSON.parse(tokenRecord.data)

                if (pendingUpdates.userId) {
                    const updateData: any = {
                        is_verified: true,
                        emailVerified: new Date(),
                    }

                    if (pendingUpdates.email) updateData.email = pendingUpdates.email
                    if (pendingUpdates.password) updateData.password = pendingUpdates.password

                    // Update the user
                    await prisma.user.update({
                        where: { id: pendingUpdates.userId },
                        data: updateData
                    })

                    // Send Security Alert
                    await sendSecurityAlertInternal(
                        normalizedEmail, // The new email (or current if only password changed)
                        !!pendingUpdates.email,
                        !!pendingUpdates.password
                    )
                }
            } catch (e) {
                console.error("Error applying pending updates:", e)
                return { error: "Failed to apply account updates." }
            }
        } else {
            // Standard verification (Registration)
            await prisma.user.update({
                where: { email: normalizedEmail },
                data: {
                    is_verified: true,
                    emailVerified: new Date(),
                }
            })
        }

        // Delete the used token(s)
        await prisma.verificationToken.deleteMany({
            where: { identifier: normalizedEmail }
        })

        return { success: true }
    } catch (error) {
        console.error("Verification error:", error)
        return { error: "Failed to verify email. Please try again." }
    }
}

async function sendSecurityAlertInternal(email: string, emailChanged: boolean, passwordChanged: boolean) {
    let message = "Your account information was recently updated."
    if (emailChanged && passwordChanged) {
        message = "Your email and password were recently changed."
    } else if (emailChanged) {
        message = "Your email address was recently changed."
    } else if (passwordChanged) {
        message = "Your account password was recently changed."
    }

    await sendEmail({
        to: email,
        subject: "Security Alert: Account Updated",
        text: `${message} If this wasn't you, please contact support immediately.`,
        html: EmailTemplates.securityAlert(message)
    })
}


export async function loginAction(formData: FormData) {
    const email = (formData.get("email") as string)?.toLowerCase().trim()
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Missing required fields" }
    }

    try {
        // 1. Manual User Check to bypass NextAuth masking
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { error: "user_not_found" }
        }

        if (user.password === null) {
            return { error: "login_with_google_required" }
        }

        if (!user.is_verified) {
            return { error: "email_not_verified" }
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return { error: "invalid_password" }
        }

        // 2. If all checks pass, actually log them in via NextAuth
        // Since we are in a Server Action, we can simply call signIn with redirect: false 
        // effectively to set the cookie. 
        // However, NextAuth v5 signIn on server usually throws a redirect unless redirect: false is passed.

        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            return { success: true }
        } catch (signInError: any) {
            if (signInError.type === 'CredentialsSignin') {
                // Should not happen as we validated
                return { error: "invalid_password" }
            }
            throw signInError // Rethrow other errors (like CallbackRouteError if any)
        }

    } catch (error: any) {
        if (error.message?.includes("Redirect") || error.digest?.includes("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Login action error:", error)
        return { error: "default" }
    }
}

