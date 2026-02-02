import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RoomEditor } from "@/components/hotels/room-editor"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function NewRoomPage({ searchParams }: { searchParams: Promise<{ hotelId?: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Await searchParams
    const { hotelId } = await searchParams

    if (!hotelId) {
        return (
            <div className="flex min-h-screen flex-col bg-background-alt">
                <Header />
                <main className="flex-1 container py-12 pt-24 text-center max-w-4xl mx-auto">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/partner/dashboard">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full h-12 w-12 hover:bg-black/10 border border-black/5 transition-all active:scale-90 bg-white/50 backdrop-blur-sm shadow-sm text-black"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Error</h1>
                        <p className="text-muted-foreground">Hotel ID is required to create a room.</p>
                    </div>
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
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto pt-24 animate-fade-in">
                <RoomEditor hotelId={hotelId} />
            </main>
        </div>
    )
}
