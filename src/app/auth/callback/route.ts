import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/login?message=Email verified successfully. Please log in."

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Update profile to mark as verified
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase
                    .from("profiles")
                    .update({ is_verified: true })
                    .eq("id", user.id)
            }
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // Return to an error page with some debug info
    return NextResponse.redirect(
        new URL("/login?message=Error: Unable to verify email. Please try again.", request.url)
    )
}
