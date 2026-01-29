"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"
import { sendEmail } from "@/lib/mail"

const bookingSchema = z.object({
    hotelId: z.string(),
    roomId: z.string(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guestsCount: z.number().int().positive(),
    totalAmount: z.number().positive(),
    guestName: z.string().min(1),
    guestEmail: z.string().email(),
    guestPhone: z.string().optional(),
    paymentIntentId: z.string().min(1)
}).refine(data => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"]
})

export async function createBooking(data: z.infer<typeof bookingSchema>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const validated = bookingSchema.parse(data)

    const booking = await prisma.booking.create({
        data: {
            booking_reference: `BK-${Math.random().toString(36).toUpperCase().substring(2, 10)}`,
            user_id: session.user.id,
            hotel_id: validated.hotelId,
            room_id: validated.roomId,
            check_in_date: new Date(validated.checkInDate),
            check_out_date: new Date(validated.checkOutDate),
            guests_count: validated.guestsCount,
            total_amount: validated.totalAmount,
            guest_name: validated.guestName,
            guest_email: validated.guestEmail,
            status: 'confirmed'
        }
    })

    // Note: If you have a separate payments table in Prisma, migrate it too. 
    // Adding placeholder if needed, but I'll stick to the Booking for now as per schema.

    // Send confirmation email
    await sendEmail({
        to: validated.guestEmail,
        subject: "Booking Confirmed - StayEase",
        text: `Your booking at StayEase is confirmed. Reference: ${booking.booking_reference}. Check-in: ${validated.checkInDate}.`,
        html: `<h1>Booking Confirmation</h1><p>Your booking is confirmed.</p><p>Ref: <b>${booking.booking_reference}</b></p><p>Check-in: ${validated.checkInDate}</p>`
    })

    redirect(`/booking/confirmation?id=${booking.id}`)
}

export async function cancelBooking(bookingId: string, reason: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            user_id: session.user.id
        }
    })

    if (!booking) throw new Error("Booking not found or access denied")

    const checkIn = new Date(booking.check_in_date)
    const today = new Date()
    const diffDays = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    let refundAmount = 0
    if (diffDays > 7) refundAmount = booking.total_amount
    else if (diffDays > 3) refundAmount = booking.total_amount * 0.75
    else if (diffDays > 1) refundAmount = booking.total_amount * 0.5

    await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' }
    })

    // Send cancellation email
    await sendEmail({
        to: booking.guest_email,
        subject: "Booking Cancelled - StayEase",
        text: `Your booking (Ref: ${booking.booking_reference}) has been cancelled. Refund amount: $${refundAmount}.`,
        html: `<h1>Booking Cancelled</h1><p>Ref: <b>${booking.booking_reference}</b> has been cancelled.</p><p>Refund Amount: $${refundAmount}</p>`
    })

    return { success: true, refundAmount }
}

