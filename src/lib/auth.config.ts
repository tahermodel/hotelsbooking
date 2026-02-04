
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
            const userRole = (auth?.user as any)?.role

            const isPartnerDashboard = nextUrl.pathname.startsWith("/partner/dashboard")
            const isAdminDashboard = nextUrl.pathname.startsWith("/admin")
            const isAccountPage = nextUrl.pathname.startsWith("/account") || nextUrl.pathname.startsWith("/booking")

            if (isAdminDashboard) {
                return isLoggedIn && userRole === "platform_admin"
            }

            if (isPartnerDashboard) {
                return isLoggedIn && (userRole === "hotel_admin" || userRole === "platform_admin")
            }

            if (isAccountPage) {
                return isLoggedIn
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
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    role: "customer",
                    is_verified: true,
                    emailVerified: new Date(),
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
} satisfies NextAuthConfig
