import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Hotel, ChevronRight, BarChart3, Calendar, Settings } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function PartnerDashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")
    const hotels = await prisma.hotel.findMany({
        where: { owner_id: session.user.id }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background-alt relative overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
            </div>

            <Header />

            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl pt-32 relative z-10">
                <div className="flex flex-col items-center text-center mb-16 animate-fade-in">
                    <span className="section-title">Partner Portal</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        My Properties
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Manage your hotels, track performance, and grow your hospitality business with ease.
                    </p>
                    <div className="mt-8">
                        <Link href="/partner/apply">
                            <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90 font-black rounded-full px-10 shadow-2xl shadow-white/10 transition-all hover:scale-105 active:scale-95 h-14">
                                <Plus className="w-5 h-5" />
                                Add New Hotel
                            </Button>
                        </Link>
                    </div>
                </div>

                {(!hotels || hotels.length === 0) ? (
                    <div className="animate-fade-in-up flex justify-center">
                        <div className="card-section p-12 text-center max-w-2xl w-full bg-white/[0.02] backdrop-blur-xl border-white/10 shadow-3xl rounded-[40px]">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
                                <Hotel className="w-10 h-10 text-white/20" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">No Hotels Yet</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                You haven&apos;t added any properties to our platform yet. Start growing your business today and reach thousands of travelers.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/partner/apply">
                                    <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground border-none rounded-full px-8">
                                        <Plus className="w-4 h-4" />
                                        Add Your First Hotel
                                    </Button>
                                </Link>
                                <Link href="/partner">
                                    <Button variant="outline" size="lg" className="rounded-full px-8">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        <section className="animate-fade-in-up">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                <span className="section-title mb-0">Your Hotels</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {hotels.map((hotel: any, index: number) => (
                                    <div
                                        key={hotel.id}
                                        className={`p-8 rounded-[32px] animate-fade-in-up stagger-${Math.min(index + 1, 6)} bg-white/[0.02] backdrop-blur-xl border border-white/10 flex flex-col hover:bg-white/[0.04] transition-all group shadow-2xl border-t-white/20`}
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                                                <Hotel className="w-7 h-7 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-lg truncate leading-tight">{hotel.name}</h3>
                                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${hotel.is_active ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                                                        {hotel.is_active ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                                    <span className="opacity-70">{hotel.city}, {hotel.country}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-3">
                                            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Link href={`/partner/dashboard/rooms?hotel=${hotel.id}`} className="w-full">
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl hover:bg-primary/5 border-primary/20 text-primary font-semibold">
                                                        Rooms
                                                    </Button>
                                                </Link>
                                                <Link href={`/partner/dashboard/bookings?hotel=${hotel.id}`} className="w-full">
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl hover:bg-secondary/5 border-secondary/20 text-secondary font-semibold">
                                                        Bookings
                                                    </Button>
                                                </Link>
                                            </div>
                                            <Link href={`/partner/dashboard/hotel/${hotel.id}`} className="w-full block">
                                                <Button variant="default" className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 font-bold">
                                                    {hotel.is_active ? 'Edit' : 'Complete Setup'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="animate-fade-in-up stagger-3">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                                <span className="section-title mb-0">Quick Actions</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <Link href="/partner/dashboard/bookings" className="p-8 rounded-[32px] group bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.04] transition-all shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 border border-white/10">
                                            <Calendar className="w-6 h-6 text-white/40 group-hover:text-black transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Total Reservations</p>
                                            <p className="text-xs text-muted-foreground">Manage all check-ins</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>

                                <Link href="/partner/dashboard/analytics" className="p-8 rounded-[32px] group bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.04] transition-all shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 border border-white/10">
                                            <BarChart3 className="w-6 h-6 text-white/40 group-hover:text-black transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Analytics</p>
                                            <p className="text-xs text-muted-foreground">Revenue and growth</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>

                                <Link href="/partner/dashboard/settings" className="p-8 rounded-[32px] group bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.04] transition-all shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 border border-white/10">
                                            <Settings className="w-6 h-6 text-white/40 group-hover:text-black transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold">Portal Settings</p>
                                            <p className="text-xs text-muted-foreground">Profile & Preferences</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    )
}
