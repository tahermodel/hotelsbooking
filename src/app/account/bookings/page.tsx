import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { cancelBooking } from "@/actions/bookings"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function MyBookingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const bookings = await prisma.booking.findMany({
        where: { user_id: session.user.id },
        include: { hotel: { select: { name: true, city: true, country: true } } },
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

                <div className="space-y-6">
                    {bookings?.map((booking: any) => (
                        <div key={booking.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-2xl transition-all">
                            <div>
                                <div className="flex items-center gap-4 mb-1">
                                    <h3 className="font-bold text-lg">{booking.hotel.name}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                        booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                            'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{booking.hotel.city}, {booking.hotel.country}</p>
                                <p className="text-sm mt-3 flex gap-4">
                                    <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold">IN: {new Date(booking.check_in_date).toLocaleDateString()}</span>
                                    <span className="bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px] font-bold">OUT: {new Date(booking.check_out_date).toLocaleDateString()}</span>
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                <p className="font-black text-2xl bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">{formatCurrency(booking.total_amount)}</p>
                                {booking.status === 'confirmed' && (
                                    <form action={async () => {
                                        "use server"
                                        await cancelBooking(booking.id, "Customer request")
                                    }}>
                                        <Button variant="glass" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10 liquid-flicker">Cancel Reservation</Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!bookings || bookings.length === 0) && (
                        <div className="py-20 text-center border-dashed border-2 border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                            <p className="text-muted-foreground">You haven&apos;t made any bookings yet.</p>
                            <Link href="/search" className="text-primary font-bold hover:underline mt-4 inline-block liquid-flicker">Start exploring</Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
