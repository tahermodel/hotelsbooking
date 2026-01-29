import NextAuth, { CredentialsSignin } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/auth-client"

class UserNotFound extends CredentialsSignin {
    code = "user_not_found"
}

class InvalidPassword extends CredentialsSignin {
    code = "invalid_password"
}

class EmailNotVerified extends CredentialsSignin {
    code = "email_not_verified"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const normalizedEmail = (credentials.email as string).toLowerCase().trim()
                const supabase = await createClient()

                // 1. Attempt standard sign-in first (Safe & Secure)
                let { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password: credentials.password as string,
                })

                // 2. Handle the specific "Email not confirmed" edge case
                if (error && error.message.toLowerCase().includes("email not confirmed")) {
                    console.log("[AUTH] Email unconfirmed in Auth. Checking profile sync...")

                    const { createAdminClient } = await import("@/lib/supabase/admin")
                    const adminClient = await createAdminClient()

                    // Check if our DB says they are verified
                    const { data: profile } = await adminClient
                        .from("profiles")
                        .select("id, is_verified")
                        .ilike("email", normalizedEmail)
                        .single()

                    if (profile?.is_verified) {
                        console.log("[AUTH] Profile is verified. Force syncing Supabase Auth...")
                        await adminClient.auth.admin.updateUserById(profile.id, { email_confirm: true })

                        // Retry sign in after sync
                        const retry = await supabase.auth.signInWithPassword({
                            email: normalizedEmail,
                            password: credentials.password as string,
                        })
                        user = retry.data.user
                        error = retry.error
                    } else {
                        throw new EmailNotVerified()
                    }
                }

                // 3. Final Check
                if (error || !user) {
                    // Use a generic error for both wrong password and missing user
                    // to prevent email enumeration attacks.
                    throw new InvalidPassword()
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || "",
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (user.email && user.id) {
                const supabase = await createClient()

                const { data: existingProfile } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("id", user.id)
                    .single()

                if (!existingProfile) {
                    const { error } = await supabase
                        .from("profiles")
                        .insert({
                            id: user.id,
                            email: user.email,
                            full_name: user.name || profile?.name || "",
                            role: "customer",
                            is_verified: account?.provider === "google",
                        })

                    if (error) {
                        console.error("Failed to create profile:", error)
                        return false
                    }
                }
            }
            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
})
