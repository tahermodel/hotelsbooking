import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { MessageSquare, ArrowLeft, Star, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ClientContentWrapper, AnimatedSection, AnimatedScaleButton } from "@/components/layout/client-animation-wrapper"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export const dynamic = 'force-dynamic'

export default async function UserReviewsPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const reviews = await prisma.review.findMany({
        where: { user_id: session.user.id },
        include: {
            hotel: true
        },
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col relative bg-neutral-950">
            <div
                className="fixed top-0 left-0 w-full h-[100lvh] z-0 bg-cover bg-center bg-no-repeat pointer-events-none will-change-transform"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <ClientContentWrapper className="flex-1 container py-12 max-w-6xl pt-32 px-4 sm:px-6 mx-auto">
                    <AnimatedSection className="mb-12">
                        <Link href="/account" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest">Return to Profile</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center text-accent">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <span className="text-white/40 text-sm font-extrabold tracking-widest uppercase mb-1 block">Guest Chronicles</span>
                                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Your Reviews</h1>
                            </div>
                        </div>
                    </AnimatedSection>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <Link href={`/hotels/${review.hotel.slug}`} key={review.id} className="group flex">
                                    <LiquidGlass className="p-6 border-white/20 shadow-xl backdrop-blur-xl" animate={false}>
                                        <div className="relative z-10 flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-base text-white group-hover:text-accent transition-colors truncate mb-1">{review.hotel.name}</h3>
                                                <div className="flex items-center gap-1.5 text-white/40">
                                                    <MapPin className="w-3 h-3 text-accent" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest truncate">{review.hotel.city}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 shrink-0">
                                                <Star className="h-3 w-3 fill-accent text-accent" />
                                                <span className="text-[10px] font-black text-white">{review.rating}.0</span>
                                            </div>
                                        </div>
                                    </LiquidGlass>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <AnimatedSection>
                            <LiquidGlass className="p-20 rounded-[3rem] border-white/10 text-center" animate={false}>
                                <div className="max-w-md mx-auto space-y-6 relative z-10">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                                        <MessageSquare className="w-10 h-10 text-white/10" />
                                    </div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">Silent Chronicles</h2>
                                    <p className="text-white/40 font-medium leading-relaxed">You haven&apos;t penned any experiences yet. Your voice matters to the community of luxury seekers.</p>
                                    <Link href="/account/bookings" className="inline-block mt-4">
                                        <AnimatedScaleButton className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all shadow-2xl shadow-white/5">
                                            Compose from Bookings
                                        </AnimatedScaleButton>
                                    </Link>
                                </div>
                            </LiquidGlass>
                        </AnimatedSection>
                    )}
                </ClientContentWrapper>
            </div>
        </div>
    )
}
