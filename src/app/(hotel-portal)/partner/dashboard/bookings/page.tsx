import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { BookingAction } from "@/components/booking/booking-action"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Hash } from "lucide-react"
import Link from "next/link"
import { AnimatedSection, ClientContentWrapper, AnimatedScaleButton } from "@/components/layout/client-animation-wrapper"

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
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container px-4 sm:px-6 lg:px-8 pt-40 pb-24 max-w-4xl mx-auto">
                <ClientContentWrapper className="space-y-12">

                    <AnimatedSection>
                        <div className="flex flex-col items-center text-center space-y-6">
                            <Link href="/partner/dashboard" className="group">
                                <AnimatedScaleButton className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all shadow-xl shadow-black/20">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Dashboard
                                </AnimatedScaleButton>
                            </Link>
                            <div className="space-y-2">
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">Reservations</h1>
                                <p className="text-white/40 font-medium text-lg">Manage and oversee your property bookings</p>
                            </div>
                        </div>
                    </AnimatedSection>

                    <div className="space-y-6">
                        {bookings?.map((booking, index) => (
                            <AnimatedSection key={booking.id} delay={0.05 * index}>
                                <div className="card-section p-8 bg-white/[0.02] border-white/10 hover:border-white/20 transition-all group overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                                                    <Hash className="w-3 h-3 text-white/20" />
                                                    <span className="text-[10px] font-black tracking-wider text-white/60">{booking.booking_reference}</span>
                                                </div>
                                                <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                                    booking.status === 'cancelled' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                                        'bg-white/5 border-white/10 text-white/40'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-white/20" />
                                                    <h3 className="font-black text-2xl tracking-tight text-white">{booking.guest_name}</h3>
                                                </div>
                                                <p className="text-white/40 font-bold text-sm ml-6">{booking.hotel.name}</p>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm font-medium text-white/60 ml-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(booking.check_in_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    <span className="text-white/20 mx-1">-</span>
                                                    {new Date(booking.check_out_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start md:items-end gap-6 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/5">
                                            <div className="space-y-1 text-left md:text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Total Revenue</p>
                                                <p className="font-black text-3xl tracking-tighter text-white">{formatCurrency(booking.total_amount)}</p>
                                            </div>
                                            <div className="w-full md:w-auto">
                                                <BookingAction
                                                    bookingId={booking.id}
                                                    paymentStatus={booking.payment?.status || "pending"}
                                                    bookingStatus={booking.status}
                                                    paymentIntentId={booking.payment?.stripe_payment_intent_id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}

                        {bookings.length === 0 && (
                            <AnimatedSection>
                                <div className="card-section py-32 text-center bg-white/[0.01] border-dashed border-white/10">
                                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8">
                                        <Calendar className="w-10 h-10 text-white/20" />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight mb-2">No Reservations Found</h3>
                                    <p className="text-white/40 font-medium">Your upcoming guest stays will manifest here once booked.</p>
                                </div>
                            </AnimatedSection>
                        )}
                    </div>
                </ClientContentWrapper>
            </main>
        </div>
    )
}
