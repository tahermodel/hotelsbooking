"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { addMinutes } from "date-fns"

export async function lockRoom(roomId: string, dates: string[]) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const lockExpiresAt = addMinutes(new Date(), 10)

    // Using a transaction to simulate the RPC behavior
    return await prisma.$transaction(async (tx) => {
        // 1. Check if all dates are available and not locked by others
        const availability = await tx.roomAvailability.findMany({
            where: {
                room_id: roomId,
                date: { in: dates.map(d => new Date(d)) },
                OR: [
                    { is_available: false },
                    {
                        locked_until: { gt: new Date() },
                        locked_by: { not: session.user.id }
                    }
                ]
            }
        })

        if (availability.length > 0) {
            throw new Error("Some dates are no longer available")
        }

        // 2. Lock the dates
        await tx.roomAvailability.updateMany({
            where: {
                room_id: roomId,
                date: { in: dates.map(d => new Date(d)) }
            },
            data: {
                locked_until: lockExpiresAt,
                locked_by: session.user.id
            }
        })

        return true
    })
}

export async function releaseRoomLock(roomId: string, dates: string[]) {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.roomAvailability.updateMany({
        where: {
            room_id: roomId,
            locked_by: session.user.id,
            date: { in: dates.map(d => new Date(d)) }
        },
        data: {
            locked_until: null,
            locked_by: null
        }
    })
}
