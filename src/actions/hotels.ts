"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function getHotels(searchTerm?: string) {
    return await prisma.hotel.findMany({
        where: {
            is_active: true,
            OR: searchTerm ? [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { city: { contains: searchTerm, mode: 'insensitive' } },
                { country: { contains: searchTerm, mode: 'insensitive' } },
                { address: { contains: searchTerm, mode: 'insensitive' } },
            ] : undefined
        }
    })
}

export async function getHotelBySlug(slug: string) {
    return await prisma.hotel.findUnique({
        where: { slug: slug },
        include: { rooms: true }
    })
}

export async function createHotel(data: any) {
    const session = await auth()
    if (!session?.user?.id || (session.user.role !== 'platform_admin' && session.user.role !== 'hotel_admin')) {
        throw new Error("Unauthorized: Only admins can create hotels")
    }

    return await prisma.hotel.create({
        data: {
            ...data,
            owner_id: session.user.id
        }
    })
}

