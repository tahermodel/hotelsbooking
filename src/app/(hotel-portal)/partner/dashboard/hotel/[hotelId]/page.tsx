import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { HotelEditor } from "@/components/hotels/hotel-editor"

export const dynamic = 'force-dynamic'

export default async function PartnerHotelEditPage({ params }: { params: Promise<{ hotelId: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Await params before using properties
    const { hotelId } = await params

    const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId }
    })

    if (!hotel) notFound()
    if (hotel.owner_id !== session.user.id) redirect("/partner/dashboard")

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto pt-24 animate-fade-in">
                <HotelEditor hotel={hotel} />
            </main>
        </div>
    )
}
