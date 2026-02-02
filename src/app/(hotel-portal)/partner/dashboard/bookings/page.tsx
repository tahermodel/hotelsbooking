import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { BookingAction } from "@/components/booking/booking-action"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function PartnerBookingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")



    const bookings = await prisma.booking.findMany({
        where: {
            hotel: {
                owner_id: session.user.id
            }
        },
        include: {
            hotel: {
                select: { name: true }
            },
            payment: true
        },
        orderBy: { created_at: 'desc' }
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
                        <h1 className="text-3xl font-bold tracking-tight">Manage Bookings</h1>
                        <p className="text-muted-foreground/80 font-medium">Track and manage your property bookings</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {bookings?.map(booking => (
                        <div key={booking.id} className="p-6 border border-black/5 rounded-2xl flex justify-between items-center bg-white shadow-sm transition-all">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-primary tracking-wide uppercase">{booking.booking_reference}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl text-black/80">{booking.guest_name}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{booking.hotel.name} | {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                                <p className="font-bold text-2xl text-black/90">{formatCurrency(booking.total_amount)}</p>
                                <BookingAction
                                    bookingId={booking.id}
                                    paymentStatus={booking.payment?.status || "pending"}
                                    bookingStatus={booking.status}
                                    paymentIntentId={booking.payment?.stripe_payment_intent_id}
                                />
                            </div>
                        </div>
                    ))}
                    {bookings.length === 0 && (
                        <div className="text-center py-20 bg-white/50 border-2 border-dashed border-black/10 rounded-2xl">
                            <p className="text-muted-foreground font-medium text-lg">No bookings found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
