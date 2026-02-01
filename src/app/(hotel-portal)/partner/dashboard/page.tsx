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
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-12 max-w-6xl pt-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
                    <div>
                        <span className="section-title">Partner Portal</span>
                        <h1 className="text-3xl font-bold">My Properties</h1>
                        <p className="text-muted-foreground mt-1">Manage your hotels and track performance</p>
                    </div>
                    <Link href="/partner/apply">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Hotel
                        </Button>
                    </Link>
                </div>

                {(!hotels || hotels.length === 0) ? (
                    <div className="animate-fade-in-up">
                        <div className="card-section p-12 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                                <Hotel className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">No Hotels Yet</h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                You haven&apos;t added any properties to our platform yet. Start growing your business today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/partner/apply">
                                    <Button size="lg" className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Add Your First Hotel
                                    </Button>
                                </Link>
                                <Link href="/partner">
                                    <Button variant="outline" size="lg">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <section>
                            <span className="section-title">Your Hotels</span>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {hotels.map((hotel: any, index: number) => (
                                    <div
                                        key={hotel.id}
                                        className={`card-section card-section-hover p-6 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Hotel className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold truncate">{hotel.name}</h3>
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${hotel.is_active ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}>
                                                        {hotel.is_active ? 'Published' : 'Draft'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{hotel.city}, {hotel.country}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-4 border-t border-border">
                                            <Link href={`/partner/dashboard/hotel/${hotel.id}`} className="w-full">
                                                <Button variant="default" size="sm" className="w-full mb-1">
                                                    Edit Info
                                                </Button>
                                            </Link>
                                            <div className="flex gap-2">
                                                <Link href={`/partner/dashboard/rooms?hotel=${hotel.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Rooms
                                                    </Button>
                                                </Link>
                                                <Link href={`/partner/dashboard/bookings?hotel=${hotel.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Bookings
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <span className="section-title">Quick Actions</span>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Link href="/partner/dashboard/bookings" className="card-section card-section-hover p-5 group animate-fade-in-up stagger-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Calendar className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">All Bookings</p>
                                            <p className="text-sm text-muted-foreground">View all reservations</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>

                                <Link href="/partner/dashboard/analytics" className="card-section card-section-hover p-5 group animate-fade-in-up stagger-2">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                            <BarChart3 className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Analytics</p>
                                            <p className="text-sm text-muted-foreground">Track performance</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>

                                <Link href="/partner/dashboard/settings" className="card-section card-section-hover p-5 group animate-fade-in-up stagger-3">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Settings className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Settings</p>
                                            <p className="text-sm text-muted-foreground">Partner preferences</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
