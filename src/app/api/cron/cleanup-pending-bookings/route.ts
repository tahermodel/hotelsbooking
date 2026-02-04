
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

        // 1. Clean up stale LOCKS
        const deletedLocks = await prisma.roomAvailability.deleteMany({
            where: {
                locked_until: { lt: new Date() },
                is_available: true
            }
        })

        // 2. Clean up stale PENDING bookings (abandoned checkout)
        const deletedBookings = await prisma.booking.deleteMany({
            where: {
                status: 'pending',
                created_at: { lt: tenMinutesAgo }
            }
        })

        return NextResponse.json({
            success: true,
            deletedLocks: deletedLocks.count,
            deletedBookings: deletedBookings.count
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
