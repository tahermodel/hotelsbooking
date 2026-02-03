'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const roomSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    max_guests: z.coerce.number().min(1),
    bed_configuration: z.string().optional(),
    size_sqm: z.coerce.number().optional(),
    amenities: z.array(z.string()),
    images: z.array(z.string()),
    main_image: z.string().optional().nullable(),
    base_price: z.coerce.number().min(0),
    hotel_id: z.string(),
    available_from: z.string().optional().nullable(),
    available_until: z.string().optional().nullable(),
    blocked_dates: z.array(z.string()).optional().default([]),
})

export async function createRoom(data: z.infer<typeof roomSchema>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Verify hotel ownership
    const hotel = await prisma.hotel.findUnique({
        where: { id: data.hotel_id }
    })

    if (!hotel || hotel.owner_id !== session.user.id) throw new Error("Unauthorized access to hotel")

    const { available_from, available_until, amenities, images, blocked_dates, ...rest } = data

    const room = await prisma.$transaction(async (tx) => {
        const r = await tx.roomType.create({
            data: {
                ...rest,
                amenities,
                images,
                available_from: available_from ? new Date(available_from) : null,
                available_until: available_until ? new Date(available_until) : null,
            }
        })

        if (blocked_dates && blocked_dates.length > 0) {
            await tx.roomAvailability.createMany({
                data: blocked_dates.map(date => ({
                    room_id: r.id,
                    date: new Date(date),
                    is_available: false
                }))
            })
        }
        return r
    })

    revalidatePath(`/partner/dashboard/rooms`)
    revalidatePath(`/hotels/${hotel.slug}`)
    return { success: true, roomId: room.id }
}

export async function updateRoom(roomId: string, data: Omit<z.infer<typeof roomSchema>, 'hotel_id'>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Verify ownership via existing room
    const existingRoom = await prisma.roomType.findUnique({
        where: { id: roomId },
        include: { hotel: true }
    })

    if (!existingRoom || existingRoom.hotel.owner_id !== session.user.id) throw new Error("Unauthorized")

    const { available_from, available_until, amenities, images, blocked_dates, ...rest } = data

    await prisma.$transaction(async (tx) => {
        await tx.roomType.update({
            where: { id: roomId },
            data: {
                ...rest,
                amenities,
                images,
                available_from: available_from ? new Date(available_from) : null,
                available_until: available_until ? new Date(available_until) : null,
            }
        })

        // Update manual blocks
        // 1. Delete existing manual blocks
        await tx.roomAvailability.deleteMany({
            where: {
                room_id: roomId,
                is_available: false
            }
        })

        // 2. Create new manual blocks
        if (blocked_dates && blocked_dates.length > 0) {
            await tx.roomAvailability.createMany({
                data: blocked_dates.map(date => ({
                    room_id: roomId,
                    date: new Date(date),
                    is_available: false
                }))
            })
        }
    })

    revalidatePath(`/partner/dashboard/rooms`)
    revalidatePath(`/hotels/${existingRoom.hotel.slug}`)
    return { success: true }
}

export async function deleteRoom(roomId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const room = await prisma.roomType.findUnique({
        where: { id: roomId },
        include: { hotel: true }
    })

    if (!room || room.hotel.owner_id !== session.user.id) throw new Error("Unauthorized")

    await prisma.roomType.delete({ where: { id: roomId } })

    revalidatePath(`/partner/dashboard/rooms`)
    return { success: true }
}
