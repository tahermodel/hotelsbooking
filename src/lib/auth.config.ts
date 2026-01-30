
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/account") ||
                nextUrl.pathname.startsWith("/booking") ||
                nextUrl.pathname.startsWith("/partner/dashboard")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }
            return true
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role || "customer"
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
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    session: { strategy: "jwt" },
} satisfies NextAuthConfig
