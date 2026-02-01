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
    hotel_id: z.string() // Ensure room is linked to a hotel
})

export async function createRoom(data: z.infer<typeof roomSchema>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // Verify hotel ownership
    const hotel = await prisma.hotel.findUnique({
        where: { id: data.hotel_id }
    })

    if (!hotel || hotel.owner_id !== session.user.id) throw new Error("Unauthorized access to hotel")

    const room = await prisma.roomType.create({
        data: {
            ...data,
            amenities: { set: data.amenities },
            images: { set: data.images },
            main_image: data.main_image
        }
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

    await prisma.roomType.update({
        where: { id: roomId },
        data: {
            ...data,
            amenities: { set: data.amenities },
            images: { set: data.images },
            main_image: (data as any).main_image
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
