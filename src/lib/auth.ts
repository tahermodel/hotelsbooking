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

                const supabase = await createClient()

                // 1. Check if user exists in profiles table
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("email", credentials.email)
                    .single()

                if (!profile) {
                    throw new UserNotFound()
                }

                // 2. Try to sign in
                const { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email as string,
                    password: credentials.password as string,
                })

                if (error || !user) {
                    throw new InvalidPassword()
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata.full_name,
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Create or update profile on sign in (especially for Google OAuth)
            if (user.email && user.id) {
                const supabase = await createClient()

                // Check if profile already exists
                const { data: existingProfile } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("id", user.id)
                    .single()

                // If profile doesn't exist, create one
                if (!existingProfile) {
                    const { error } = await supabase
                        .from("profiles")
                        .insert({
                            id: user.id,
                            email: user.email,
                            full_name: user.name || profile?.name || "",
                            role: "customer",
                            is_verified: account?.provider === "google", // Google users are verified
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
