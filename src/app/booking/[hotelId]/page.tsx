import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BookingForm } from "@/components/booking/booking-form"
import { redirect } from "next/navigation"
import { Clock, ShieldCheck, Sparkles } from "lucide-react"
import { ClientContentWrapper, AnimatedSection } from "@/components/layout/client-animation-wrapper"

export const dynamic = 'force-dynamic'

export default async function BookingPage({
    params,
    searchParams
}: {
    params: Promise<{ hotelId: string }>,
    searchParams: Promise<{ roomType: string, checkIn: string, checkOut: string }>
}) {
    const { hotelId } = await params
    const { roomType, checkIn, checkOut } = await searchParams
    const session = await auth()

    if (!session) {
        redirect(`/login?callbackUrl=/booking/${hotelId}?roomType=${roomType}&checkIn=${checkIn}&checkOut=${checkOut}`)
    }

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } })
    const roomTypeData = await prisma.roomType.findUnique({ where: { id: roomType } })

    if (!hotel || !roomTypeData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
                <p className="text-xl font-black uppercase tracking-widest text-white/20">Booking data invalid</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-40 pb-24">
                <ClientContentWrapper className="max-w-4xl mx-auto space-y-12">

                    {/* Header Section */}
                    <AnimatedSection>
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                                <Sparkles className="w-3.5 h-3.5" />
                                Secured Reservation
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Confirm Your Stay</h1>
                            <p className="text-white/40 font-medium text-lg">Finishing the details for your experience at <span className="text-white">{hotel.name}</span></p>
                        </div>
                    </AnimatedSection>

                    {/* Lock Message / Timer UI */}
                    <AnimatedSection delay={0.1}>
                        <div className="relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
                                <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/20 flex items-center justify-center text-accent animate-pulse">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h3 className="text-xl font-bold tracking-tight">Temporary Reservation Lock</h3>
                                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                                        We&apos;ve exclusively locked the <span className="text-white font-bold">{roomTypeData.name}</span> for you.
                                        Please complete your reservation in the next <span className="text-accent font-black underline decoration-2 underline-offset-4">10 minutes</span> to guarantee this rate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Form Section */}
                    <AnimatedSection delay={0.2}>
                        <div className="card-section p-1 border-white/10 bg-white/[0.01]">
                            <div className="bg-neutral-900/50 rounded-[31px] p-8 md:p-12">
                                <BookingForm
                                    hotel={hotel}
                                    roomType={roomTypeData}
                                    searchParams={{ roomType, checkIn, checkOut }}
                                />
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Trust Signals */}
                    <AnimatedSection delay={0.3}>
                        <div className="flex flex-wrap justify-center gap-8 pt-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                PCI DSS Compliant
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                Secured by Stripe
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                Handled with Care
                            </div>
                        </div>
                    </AnimatedSection>

                </ClientContentWrapper>
            </main>
        </div>
    )
}
