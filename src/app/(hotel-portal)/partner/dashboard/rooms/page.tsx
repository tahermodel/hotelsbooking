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
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12 pt-32 max-w-4xl mx-auto">
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/partner/dashboard">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-12 w-12 hover:bg-white/10 border border-white/10 transition-all active:scale-90 bg-white/5 backdrop-blur-md shadow-lg text-white"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white">Manage Rooms</h1>
                        {hotelId && <p className="text-white/40 font-medium">Managing luxury accommodations</p>}
                    </div>
                    {hotelId && (
                        <Link href={`/partner/dashboard/rooms/new?hotelId=${hotelId}`} className="ml-auto">
                            <Button className="gap-2 bg-white text-black hover:bg-white/90 font-bold rounded-full px-8 shadow-xl">
                                <Plus className="w-4 h-4" />
                                Add Room
                            </Button>
                        </Link>
                    )}
                </div>
                <div className="grid gap-6">
                    {rooms?.map(room => (
                        <div key={room.id} className="p-8 border border-white/5 rounded-[32px] flex justify-between items-center bg-white/[0.02] backdrop-blur-xl shadow-2xl hover:bg-white/[0.04] transition-all group border-t-white/10">
                            <div>
                                <h3 className="font-black text-2xl text-white mb-1">{room.name}</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-white/30">{room.hotel.name}</p>
                                <div className="flex gap-6 mt-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Starting from</span>
                                        <span className="text-lg font-black text-white">${room.base_price} <span className="text-xs text-white/40 font-medium">/ night</span></span>
                                    </div>
                                    <div className="flex flex-col border-l border-white/5 pl-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Capacity</span>
                                        <span className="text-lg font-black text-white">{room.max_guests} <span className="text-xs text-white/40 font-medium">Guests</span></span>
                                    </div>
                                </div>
                            </div>
                            <Link href={`/partner/dashboard/rooms/${room.id}`}>
                                <Button className="rounded-2xl h-14 px-8 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 font-bold transition-all shadow-xl">
                                    Edit Details
                                </Button>
                            </Link>
                        </div>
                    ))}
                    {rooms.length === 0 && (
                        <div className="text-center py-24 bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[32px]">
                            <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">No suites found in this collection</p>
                            <Link href="/partner/dashboard" className="mt-4 block text-white/40 hover:text-white transition-colors text-xs font-bold underline">Return to dashboard</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
