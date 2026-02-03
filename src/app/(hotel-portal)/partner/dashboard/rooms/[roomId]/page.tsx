import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { RoomEditor } from "@/components/hotels/room-editor"

export const dynamic = 'force-dynamic'

export default async function EditRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Await params
    const { roomId } = await params

    const room = await prisma.roomType.findUnique({
        where: { id: roomId },
        include: { hotel: true, availability: true }
    })

    if (!room) notFound()
    if (room.hotel.owner_id !== session.user.id) redirect("/partner/dashboard")

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto pt-24 animate-fade-in flex flex-col">
                <RoomEditor room={room} hotelId={room.hotel_id} />
            </main>
        </div>
    )
}
