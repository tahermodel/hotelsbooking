import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.redirect(
            new URL("/login?message=Error: Invalid verification link", request.url)
        )
    }

    const supabase = await createClient()

    try {
        // Find the verification token
        const { data: verificationData, error: verificationError } = await supabase
            .from("verification_tokens")
            .select("*")
            .eq("token", token)
            .single()

        if (verificationError || !verificationData) {
            return NextResponse.redirect(
                new URL("/login?message=Error: Invalid or expired verification link", request.url)
            )
        }

        // Check if token has expired
        if (new Date(verificationData.expires_at) < new Date()) {
            return NextResponse.redirect(
                new URL("/login?message=Error: Verification link has expired. Please register again.", request.url)
            )
        }

        // Update profile to mark as verified
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ is_verified: true })
            .eq("id", verificationData.user_id)

        if (updateError) {
            return NextResponse.redirect(
                new URL("/login?message=Error: Could not verify email. Please try again.", request.url)
            )
        }

        // Delete the used token
        await supabase
            .from("verification_tokens")
            .delete()
            .eq("id", verificationData.id)

        return NextResponse.redirect(
            new URL("/login?message=Email verified successfully! You can now log in.", request.url)
        )
    } catch (error) {
        console.error("Verification error:", error)
        return NextResponse.redirect(
            new URL("/login?message=Error: Something went wrong. Please try again.", request.url)
        )
    }
}

