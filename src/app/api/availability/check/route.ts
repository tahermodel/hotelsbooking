import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const hotelId = searchParams.get("hotelId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!hotelId || !startDate || !endDate) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const availability = await prisma.roomAvailability.findMany({
        where: {
            room: {
                hotel_id: hotelId
            },
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            },
            is_available: true,
            OR: [
                { locked_until: null },
                { locked_until: { lte: new Date() } }
            ]
        },
        include: {
            room: true
        }
    })

    return NextResponse.json(availability)
}

