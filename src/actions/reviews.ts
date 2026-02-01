"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function submitReview(data: {
    bookingId: string
    hotelId: string
    rating: number
    title: string
    content: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.review.upsert({
        where: { booking_id: data.bookingId },
        update: {
            rating: data.rating,
            title: data.title,
            content: data.content,
        },
        create: {
            booking_id: data.bookingId,
            hotel_id: data.hotelId,
            rating: data.rating,
            title: data.title,
            content: data.content,
            user_id: session.user.id
        }
    })

    return { success: true }
}

export async function getHotelReviews(hotelId: string) {
    return await prisma.review.findMany({
        where: { hotel_id: hotelId },
        include: {
            user: {
                select: {
                    name: true,
                    image: true
                }
            }
        },
        orderBy: { created_at: 'desc' }
    })
}
