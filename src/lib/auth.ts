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
                console.log("[AUTH] Authorize started for:", credentials?.email)
                if (!credentials?.email || !credentials?.password) {
                    console.log("[AUTH] Missing credentials")
                    return null
                }

                const normalizedEmail = (credentials.email as string).toLowerCase().trim()
                const supabase = await createClient()

                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("id, is_verified, full_name")
                    .ilike("email", normalizedEmail)
                    .single()

                if (profileError || !profile) {
                    console.log("[AUTH] Profile not found or error:", profileError)
                    throw new UserNotFound()
                }

                console.log("[AUTH] Profile found:", { id: profile.id, is_verified: profile.is_verified })

                let { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password: credentials.password as string,
                })

                if (error) {
                    console.log("[AUTH] Initial signIn failed:", error.message)
                    if (error.message.toLowerCase().includes("email not confirmed")) {
                        if (profile.is_verified) {
                            console.log("[AUTH] Profile is verified but Auth is not. Force confirming...")
                            try {
                                const { createAdminClient } = await import("@/lib/supabase/admin")
                                const adminClient = await createAdminClient()
                                const { error: confirmError } = await adminClient.auth.admin.updateUserById(profile.id, { email_confirm: true })

                                if (confirmError) {
                                    console.error("[AUTH] Force confirm failed:", confirmError)
                                } else {
                                    console.log("[AUTH] Force confirm success. Retrying signIn...")
                                    const retry = await supabase.auth.signInWithPassword({
                                        email: normalizedEmail,
                                        password: credentials.password as string,
                                    })
                                    user = retry.data.user
                                    error = retry.error
                                    if (error) console.log("[AUTH] Retry signIn failed:", error.message)
                                }
                            } catch (confirmEx) {
                                console.error("[AUTH] Exception during force confirm:", confirmEx)
                            }
                        } else {
                            console.log("[AUTH] Email not confirmed and profile not verified.")
                            throw new EmailNotVerified()
                        }
                    }
                }

                if (error || !user) {
                    console.error("[AUTH] Final login failure for", credentials.email, ":", error?.message || "No user returned")
                    throw new InvalidPassword()
                }

                console.log("[AUTH] Login successful for:", user.email)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || profile.full_name || "",
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
