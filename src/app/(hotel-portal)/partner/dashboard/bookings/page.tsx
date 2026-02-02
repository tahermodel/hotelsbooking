import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { BookingAction } from "@/components/booking/booking-action"

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
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>
                <div className="space-y-4">
                    {bookings?.map(booking => (
                        <div key={booking.id} className="p-6 border rounded-xl flex justify-between items-center bg-card">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-primary">{booking.booking_reference}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg">{booking.guest_name}</h3>
                                <p className="text-sm text-muted-foreground">{booking.hotel.name} | {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                <p className="font-bold text-lg">{formatCurrency(booking.total_amount)}</p>
                                <BookingAction
                                    bookingId={booking.id}
                                    paymentStatus={booking.payment?.status || "pending"}
                                    bookingStatus={booking.status}
                                    paymentIntentId={booking.payment?.stripe_payment_intent_id}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
