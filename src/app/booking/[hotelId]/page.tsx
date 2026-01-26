import { Header } from "@/components/layout/header"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking/booking-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function BookingPage({
    params,
    searchParams
}: {
    params: { hotelId: string },
    searchParams: { roomType: string, checkIn?: string, checkOut?: string }
}) {
    const session = await auth()
    if (!session) redirect(`/login?callbackUrl=/booking/${params.hotelId}?roomType=${searchParams.roomType}`)

    const supabase = await createClient()
    const { data: hotel } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', params.hotelId)
        .single()

    const { data: roomType } = await supabase
        .from('room_types')
        .select('*')
        .eq('id', searchParams.roomType)
        .single()

    if (!hotel || !roomType) return <div>Invalid booking details</div>

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">Confirm Your Booking</h1>
                <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/20 text-sm text-primary flex items-center gap-2">
                    <span>We've locked this room for you. Complete your reservation in the next 10 minutes.</span>
                </div>
                <BookingForm hotel={hotel} roomType={roomType} searchParams={searchParams} />
            </main>
        </div>
    )
}
