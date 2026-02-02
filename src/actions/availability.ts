"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { addMinutes } from "date-fns"

export async function lockRoom(roomId: string, dates: string[]) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const lockExpiresAt = addMinutes(new Date(), 10)
    const dateObjects = dates.map(d => new Date(d))

    return await prisma.$transaction(async (tx) => {
        // 1. Check Room availability range
        const room = await tx.roomType.findUnique({
            where: { id: roomId }
        })
        if (!room) throw new Error("Room not found")

        for (const date of dateObjects) {
            if (room.available_from && date < room.available_from) throw new Error("Some dates are outside room range")
            if (room.available_until && date > room.available_until) throw new Error("Some dates are outside room range")
        }

        // 2. Check overlapping bookings
        const checkIn = new Date(Math.min(...dateObjects.map(d => d.getTime())))
        const checkOut = new Date(Math.max(...dateObjects.map(d => d.getTime())) + 86400000)

        const overlappingBooking = await tx.booking.findFirst({
            where: {
                room_id: roomId,
                status: 'confirmed',
                AND: [
                    { check_in_date: { lt: checkOut } },
                    { check_out_date: { gt: checkIn } }
                ]
            }
        })
        if (overlappingBooking) throw new Error("Dates are already booked")

        // 3. Check existing locks/blocks
        const existingBlocks = await tx.roomAvailability.findMany({
            where: {
                room_id: roomId,
                date: { in: dateObjects },
                OR: [
                    { is_available: false },
                    {
                        locked_until: { gt: new Date() },
                        locked_by: { not: session.user.id }
                    }
                ]
            }
        })
        if (existingBlocks.length > 0) throw new Error("Some dates are locked or blocked")

        // 4. Create locks
        for (const date of dateObjects) {
            await tx.roomAvailability.upsert({
                where: {
                    room_id_date: {
                        room_id: roomId,
                        date: date
                    }
                },
                update: {
                    locked_until: lockExpiresAt,
                    locked_by: session.user.id
                },
                create: {
                    room_id: roomId,
                    date: date,
                    locked_until: lockExpiresAt,
                    locked_by: session.user.id,
                    is_available: true
                }
            })
        }

        return true
    })
}

export async function releaseRoomLock(roomId: string, dates: string[]) {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.roomAvailability.deleteMany({
        where: {
            room_id: roomId,
            locked_by: session.user.id,
            date: { in: dates.map(d => new Date(d)) },
            is_available: true // Don't delete manual blocks
        }
    })
}
