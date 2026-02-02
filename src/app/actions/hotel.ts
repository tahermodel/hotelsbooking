'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const hotelSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    address: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    star_rating: z.coerce.number().min(1).max(5),
    amenities: z.array(z.string()),
    images: z.array(z.string()),
    main_image: z.string().optional().nullable(),
    contact_email: z.string().email(),
    contact_phone: z.string().optional(),
})

export async function updateHotel(hotelId: string, data: z.infer<typeof hotelSchema>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    if (!hotel || hotel.owner_id !== session.user.id) throw new Error("Unauthorized")

    const { amenities, images, ...rest } = data

    await prisma.hotel.update({
        where: { id: hotelId },
        data: {
            ...rest,
            amenities: { set: amenities },
            images: { set: images },
            main_image: data.main_image
        }
    })

    revalidatePath(`/partner/dashboard`)
    revalidatePath(`/partner/dashboard/hotel/${hotelId}`)
    revalidatePath(`/hotels/${hotel.slug}`)
    return { success: true }
}

export async function toggleHotelStatus(hotelId: string, isActive: boolean) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    if (!hotel || hotel.owner_id !== session.user.id) throw new Error("Unauthorized")

    await prisma.hotel.update({
        where: { id: hotelId },
        data: { is_active: isActive }
    })

    revalidatePath(`/partner/dashboard`)
    revalidatePath(`/partner/dashboard/hotel/${hotelId}`)
    revalidatePath(`/hotels/${hotel.slug}`)
    return { success: true }
}
