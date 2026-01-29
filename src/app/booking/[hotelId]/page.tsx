import { Header } from "@/components/layout/header"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BookingForm } from "@/components/booking/booking-form"

export const dynamic = 'force-dynamic'

export default async function BookingPage({
    params,
    searchParams
}: {
    params: Promise<{ hotelId: string }>,
    searchParams: Promise<{ roomType: string, checkIn?: string, checkOut?: string }>
}) {
    const { hotelId } = await params
    const { roomType, checkIn, checkOut } = await searchParams
    const session = await auth()
    if (!session?.user?.id) redirect(`/login?callbackUrl=/booking/${hotelId}?roomType=${roomType}`)

    const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId }
    })

    const roomTypeData = await prisma.roomType.findUnique({
        where: { id: roomType }
    })

    if (!hotel || !roomTypeData) return <div>Invalid booking details</div>

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">Confirm Your Booking</h1>
                <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/20 text-sm text-primary flex items-center gap-2">
                    <span>We&apos;ve locked this room for you. Complete your reservation in the next 10 minutes.</span>
                </div>
                <BookingForm hotel={hotel} roomType={roomTypeData} searchParams={{ roomType, checkIn, checkOut }} />
            </main>
        </div>
    )
}
