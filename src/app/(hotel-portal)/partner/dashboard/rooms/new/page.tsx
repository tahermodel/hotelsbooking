import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RoomEditor } from "@/components/hotels/room-editor"

export const dynamic = 'force-dynamic'

export default async function NewRoomPage({ searchParams }: { searchParams: Promise<{ hotelId?: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Await searchParams
    const { hotelId } = await searchParams

    if (!hotelId) {
        return (
            <div className="flex min-h-screen flex-col bg-background">
                <Header />
                <main className="flex-1 container py-12 pt-24 text-center">
                    <h1 className="text-2xl font-bold">Error</h1>
                    <p className="text-muted-foreground">Hotel ID is required to create a room.</p>
                </main>
            </div>
        )
    }

    // Verify ownership of the hotel
    const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId, owner_id: session.user.id }
    })

    if (!hotel) redirect("/partner/dashboard")

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-12 max-w-6xl pt-24 animate-fade-in">
                <RoomEditor hotelId={hotelId} />
            </main>
        </div>
    )
}
