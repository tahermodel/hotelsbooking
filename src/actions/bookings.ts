import { createClient } from "@/lib/supabase/server"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const bookingSchema = z.object({
    hotelId: z.string().uuid(),
    roomId: z.string().uuid(),
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
    const supabase = await createClient()

    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            booking_reference: `BK-${Math.random().toString(36).toUpperCase().substring(2, 10)}`,
            user_id: session.user.id,
            hotel_id: validated.hotelId,
            room_id: validated.roomId,
            check_in_date: validated.checkInDate,
            check_out_date: validated.checkOutDate,
            guests_count: validated.guestsCount,
            total_amount: validated.totalAmount,
            guest_name: validated.guestName,
            guest_email: validated.guestEmail,
            guest_phone: validated.guestPhone,
            status: 'confirmed'
        })
        .select()
        .single()

    if (bookingError) throw new Error(bookingError.message)

    await supabase.from('payments').insert({
        booking_id: booking.id,
        stripe_payment_intent_id: validated.paymentIntentId,
        amount: validated.totalAmount,
        status: 'authorized'
    })

    const dates = []
    let current = new Date(validated.checkInDate)
    const end = new Date(validated.checkOutDate)
    while (current < end) {
        dates.push(current.toISOString().split('T')[0])
        current.setDate(current.getDate() + 1)
    }

    await supabase
        .from('room_availability')
        .update({ is_available: false, locked_until: null, locked_by: null })
        .match({ room_id: validated.roomId })
        .in('date', dates)

    redirect(`/booking/confirmation?id=${booking.id}`)
}

export async function cancelBooking(bookingId: string, reason: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const supabase = await createClient()

    const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('user_id', session.user.id) // Ensure user owns the booking
        .single()

    if (fetchError || !booking) throw new Error("Booking not found or access denied")

    const checkIn = new Date(booking.check_in_date)
    const today = new Date()
    const diffDays = Math.ceil((checkIn.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    let refundAmount = 0
    if (diffDays > 7) refundAmount = booking.total_amount
    else if (diffDays > 3) refundAmount = booking.total_amount * 0.75
    else if (diffDays > 1) refundAmount = booking.total_amount * 0.5

    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)

    await supabase.from('cancellations').insert({
        booking_id: bookingId,
        cancelled_by: session.user.id,
        reason: 'customer_request',
        reason_details: reason,
        refund_amount: refundAmount,
        penalty_amount: booking.total_amount - refundAmount
    })

    const dates = []
    let current = new Date(booking.check_in_date)
    while (current < new Date(booking.check_out_date)) {
        dates.push(current.toISOString().split('T')[0])
        current.setDate(current.getDate() + 1)
    }

    await supabase
        .from('room_availability')
        .update({ is_available: true })
        .match({ room_id: booking.room_id })
        .in('date', dates)

    return { success: true, refundAmount }
}
