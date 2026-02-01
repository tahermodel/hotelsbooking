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

    const existing = await prisma.review.findUnique({
        where: { booking_id: data.bookingId }
    })

    if (existing) throw new Error("You have already reviewed this stay")

    await prisma.review.create({
        data: {
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
