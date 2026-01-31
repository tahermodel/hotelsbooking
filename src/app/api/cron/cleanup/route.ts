import { NextResponse } from "next/server"
import { cleanupUnverifiedAccounts, cleanupExpiredTokens } from "@/lib/db-maintenance"

// This route can be called by a cron job (e.g., Vercel Cron, GitHub Actions, etc.)
// You should protect this route with an API key in production
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const unverifiedDeleted = await cleanupUnverifiedAccounts()
        const tokensDeleted = await cleanupExpiredTokens()

        return NextResponse.json({
            success: true,
            unverifiedDeleted,
            tokensDeleted,
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
