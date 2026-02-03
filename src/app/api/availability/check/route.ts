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

    const checkIn = new Date(startDate)
    const checkOut = new Date(endDate)

    const rooms = await prisma.roomType.findMany({
        where: {
            hotel_id: hotelId,
            AND: [
                {
                    OR: [
                        { available_from: null },
                        { available_from: { lte: checkIn } }
                    ]
                },
                {
                    OR: [
                        { available_until: null },
                        {
                            available_until: {
                                gte: new Date(new Date(checkOut).getTime() - 86400000)
                            }
                        }
                    ]
                },
                {
                    bookings: {
                        none: {
                            status: 'confirmed',
                            AND: [
                                { check_in_date: { lt: checkOut } },
                                { check_out_date: { gt: checkIn } }
                            ]
                        }
                    }
                },
                {
                    availability: {
                        none: {
                            is_available: false,
                            AND: [
                                { date: { gte: checkIn } },
                                { date: { lt: checkOut } }
                            ]
                        }
                    }
                }
            ]
        }
    })

    return NextResponse.json(rooms)
}

