import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PartnerRoomsPage({ searchParams }: { searchParams: Promise<{ hotel?: string }> }) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { hotel: hotelId } = await searchParams

    const rooms = await prisma.roomType.findMany({
        where: {
            hotel: {
                owner_id: session.user.id,
                ...(hotelId ? { id: hotelId } : {})
            }
        },
        include: {
            hotel: {
                select: { name: true, id: true }
            }
        }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12 pt-24 max-w-4xl mx-auto">
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/partner/dashboard">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-12 w-12 hover:bg-black/10 border border-black/5 transition-all active:scale-90 bg-white/50 backdrop-blur-sm shadow-sm text-black"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Manage Rooms</h1>
                        {hotelId && <p className="text-muted-foreground/80 font-medium">Managing rooms for selected hotel</p>}
                    </div>
                    {hotelId && (
                        <Link href={`/partner/dashboard/rooms/new?hotelId=${hotelId}`} className="ml-auto">
                            <Button className="gap-2 rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                                <Plus className="w-4 h-4" />
                                Add Room
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="grid gap-6">
                    {rooms?.map(room => (
                        <div key={room.id} className="p-6 border border-black/5 rounded-2xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-all group">
                            <div>
                                <h3 className="font-bold text-xl text-black/80">{room.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{room.hotel.name}</p>
                                <div className="flex gap-4 mt-3">
                                    <span className="text-sm font-bold bg-primary/5 text-primary px-3 py-1 rounded-full border border-primary/10">${room.base_price} / night</span>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                                        {room.max_guests} Guests Max
                                    </span>
                                </div>
                            </div>
                            <Link href={`/partner/dashboard/rooms/${room.id}`}>
                                <Button variant="outline" className="rounded-full px-6 group-hover:bg-primary group-hover:text-white transition-colors border-black/10">Edit Details</Button>
                            </Link>
                        </div>
                    ))}
                    {rooms.length === 0 && (
                        <div className="text-center py-20 bg-white/50 border-2 border-dashed border-black/10 rounded-2xl">
                            <p className="text-muted-foreground font-medium text-lg">No rooms found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
