import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CancelBookingButton } from "@/components/account/cancel-booking-button"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Hotel } from "lucide-react"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { ClientContentWrapper, AnimatedSection } from "@/components/layout/client-animation-wrapper"

export const dynamic = 'force-dynamic'

export default async function MyBookingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const bookings = await prisma.booking.findMany({
        where: { user_id: session.user.id },
        include: { hotel: { select: { name: true, city: true, country: true, slug: true } } },
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col relative bg-neutral-950 text-white">
            <div
                className="fixed top-0 left-0 w-full h-[100lvh] z-0 bg-cover bg-center bg-no-repeat pointer-events-none will-change-transform"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <ClientContentWrapper className="flex-1 container py-12 max-w-4xl pt-24 px-4 sm:px-6 mx-auto">
                    <AnimatedSection className="mb-8">
                        <Link
                            href="/account"
                            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-4 group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Account
                        </Link>
                        <span className="text-white/60 text-sm font-extrabold tracking-widest uppercase mb-2 block">Reservations</span>
                        <h1 className="text-4xl font-bold text-white tracking-tight">My Bookings</h1>
                    </AnimatedSection>

                    <div className="space-y-6">
                        {bookings?.map((booking: any, index: number) => (
                            <AnimatedSection key={booking.id}>
                                <LiquidGlass className="p-6 border-white/20 shadow-xl backdrop-blur-md" animate={false}>
                                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                                                <Hotel className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <Link href={`/hotels/${booking.hotel.slug}`} className="hover:text-accent transition-colors">
                                                        <h3 className="font-bold text-xl text-white">{booking.hotel.name}</h3>
                                                    </Link>
                                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                                                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                                                            'bg-white/10 text-white/60 border-white/10'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                                                    <MapPin className="w-4 h-4" />
                                                    {booking.hotel.city}, {booking.hotel.country}
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                                                        <Calendar className="w-4 h-4 text-white/60" />
                                                        <span className="text-xs font-bold text-white/90">
                                                            IN: {new Date(booking.check_in_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                                                        <Calendar className="w-4 h-4 text-white/60" />
                                                        <span className="text-xs font-bold text-white/90">
                                                            OUT: {new Date(booking.check_out_date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end justify-between gap-4 md:border-l md:border-white/10 md:pl-8">
                                            <div className="text-right">
                                                <p className="text-sm text-white/60 font-medium mb-1">Total Amount</p>
                                                <p className="text-3xl font-black text-white">{formatCurrency(booking.total_amount)}</p>
                                            </div>
                                            {booking.status === 'confirmed' && (
                                                <CancelBookingButton bookingId={booking.id} />
                                            )}
                                        </div>
                                    </div>
                                </LiquidGlass>
                            </AnimatedSection>
                        ))}

                        {(!bookings || bookings.length === 0) && (
                            <AnimatedSection>
                                <LiquidGlass className="p-6 border-white/20 shadow-xl backdrop-blur-md" animate={false}>
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                                            <Hotel className="w-10 h-10 text-white/40" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
                                        <p className="text-white/60 mb-8 max-w-xs mx-auto">You haven&apos;t made any reservations yet. Ready to start your next adventure?</p>
                                        <Link href="/">
                                            <Button className="bg-white text-black hover:bg-white/90 font-bold px-8 py-6 rounded-2xl h-auto">
                                                Start Exploring
                                            </Button>
                                        </Link>
                                    </div>
                                </LiquidGlass>
                            </AnimatedSection>
                        )}
                    </div>
                </ClientContentWrapper>
            </div>
        </div>
    )
}
