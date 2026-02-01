import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

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
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Rooms</h1>
                        {hotelId && <p className="text-muted-foreground">Managing rooms for selected hotel</p>}
                    </div>
                    {hotelId && (
                        <Link href={`/partner/dashboard/rooms/new?hotelId=${hotelId}`}>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Room
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="grid gap-6">
                    {rooms?.map(room => (
                        <div key={room.id} className="p-6 border rounded-xl flex justify-between items-center bg-card card-section-hover transition-all">
                            <div>
                                <h3 className="font-bold text-lg">{room.name}</h3>
                                <p className="text-sm text-muted-foreground">{room.hotel.name}</p>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-sm font-medium">${room.base_price} / night</span>
                                    <span className="text-sm text-muted-foreground">{room.max_guests} guests</span>
                                </div>
                            </div>
                            <Link href={`/partner/dashboard/rooms/${room.id}`}>
                                <Button variant="outline">Edit Details</Button>
                            </Link>
                        </div>
                    ))}
                    {rooms.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl">
                            <p className="text-muted-foreground">No rooms found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
