import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

export const { auth } = NextAuth(authConfig)

export const config = {
    matcher: [
        "/account/:path*",
        "/booking/:path*",
        "/partner/dashboard/:path*",
    ],
}

export default auth((req) => {
    if (!req.auth) {
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        url.searchParams.set("callbackUrl", req.nextUrl.pathname)
        return NextResponse.redirect(url)
    }
})
