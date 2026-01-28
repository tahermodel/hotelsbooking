import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function PartnerBookingsPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const supabase = await createClient()
    const { data: hotels } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', session.user.id)

    const hotelIds = hotels?.map(h => h.id) || []

    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, hotels(name)')
        .in('hotel_id', hotelIds)
        .order('created_at', { ascending: false })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>
                <div className="space-y-4">
                    {bookings?.map(booking => (
                        <div key={booking.id} className="p-6 border rounded-xl flex justify-between items-center bg-card">
                            <div>
                                <p className="text-sm font-medium text-primary">{booking.booking_reference}</p>
                                <h3 className="font-bold text-lg">{booking.guest_name}</h3>
                                <p className="text-sm text-muted-foreground">{booking.hotels.name} | {booking.check_in_date} - {booking.check_out_date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">{formatCurrency(booking.total_amount)}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{booking.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
