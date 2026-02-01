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
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    <h1 className="text-4xl font-black tracking-tight">Confirm Your Booking</h1>
                    <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 text-sm text-accent-foreground flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-2">
                        <span className="text-xl">⏱️</span>
                        <span className="font-medium">We&apos;ve locked this room for you. Complete your reservation in the next 10 minutes.</span>
                    </div>
                    <BookingForm hotel={hotel} roomType={roomTypeData} searchParams={{ roomType, checkIn, checkOut }} />
                </div>
            </main>
        </div>
    )
}
