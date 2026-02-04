"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { generateVerificationCode, sendVerificationEmail, handleSignOut } from "./auth"
import { sendEmail } from "@/lib/mail"

export async function updateUserAccount(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    const name = formData.get("name") as string
    const email = (formData.get("email") as string)?.toLowerCase().trim()
    const phone = formData.get("phone") as string
    const newPassword = formData.get("password") as string

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) return { error: "User not found" }

    const isEmailChanged = !!(email && email !== user.email)
    const isPasswordChanged = !!newPassword

    // 1. Update simple fields immediately
    if (name !== user.name || phone !== user.phone) {
        await prisma.user.update({
            where: { id: user.id },
            data: { name, phone }
        })
    }

    // 2. Handle critical updates (defer until verification)
    if (isEmailChanged || isPasswordChanged) {
        if (isEmailChanged) {
            const existing = await prisma.user.findUnique({ where: { email } })
            if (existing) return { error: "Email already in use" }
        }

        const pendingUpdates: any = { userId: user.id }
        if (isEmailChanged) pendingUpdates.email = email
        if (isPasswordChanged) pendingUpdates.password = await bcrypt.hash(newPassword, 10)

        // Generate verification flow
        const code = await generateVerificationCode()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        // If email changed, we verify the NEW email. If only password changed, we verify current email.
        const targetEmail = isEmailChanged ? email : user.email

        await prisma.verificationToken.deleteMany({ where: { identifier: targetEmail } })

        // Store pending updates in the 'data' field
        await prisma.verificationToken.create({
            data: {
                identifier: targetEmail,
                token: code,
                expires: expiresAt,
                data: JSON.stringify(pendingUpdates)
            }
        })

        await sendVerificationEmail(targetEmail, name || user.name || "User", code)

        // Return redirect to verify page
        const redirectUrl = `/auth/verify-email?email=${encodeURIComponent(targetEmail)}`
        return { success: true, redirectUrl }
    }

    revalidatePath("/account")
    return { success: true }
}

export async function sendSecurityAlert(email: string, changes: { email?: string, password?: string }) {
    let message = "Your account information was recently updated."
    const emailChanged = !!changes.email
    const passwordChanged = !!changes.password

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
        html: `
            <div style="background-color: #fff9f0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; color: #1e293b; line-height: 1.6;">
                <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #fceec7;">
                    <div style="background: #ff9f1c; padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Security Alert</h1>
                    </div>
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #1e293b; margin-bottom: 16px; font-size: 20px; font-weight: 700;">Important Account Update</h2>
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">Hi,</p>
                        <p style="color: #64748b; font-size: 16px; margin-bottom: 32px;">${message}</p>
                        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">If you did not make this change, please contact our security team immediately to secure your account.</p>
                    </div>
                </div>
            </div>
        `
    })
}

export async function deleteAccountAction() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Not authenticated" }

    await prisma.user.delete({
        where: { id: session.user.id }
    })

    await handleSignOut()
    return { success: true }
}
