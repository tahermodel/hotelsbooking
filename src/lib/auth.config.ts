
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            if (trigger === "update" && session?.user) {
                token.role = session.user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as any
            }
            return session
        },
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "customer",
                    is_verified: true, // Google accounts are implicitly verified
                }
            }
        }),
    ],
    session: { strategy: "jwt" },
} satisfies NextAuthConfig
