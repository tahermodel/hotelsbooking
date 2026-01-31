import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Hotel } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function PartnerDashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")
    const hotels = await prisma.hotel.findMany({
        where: { owner_id: session.user.id }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Partner Dashboard</h1>
                    <Link href="/partner/apply">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Hotel
                        </Button>
                    </Link>
                </div>

                {(!hotels || hotels.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 shadow-xl">
                        <Hotel className="w-20 h-20 text-muted-foreground/30 mb-6" />
                        <h2 className="text-2xl font-black mb-2">No Hotels Found</h2>
                        <p className="text-muted-foreground mb-8 text-center max-w-sm">You haven&apos;t added any properties to our platform yet. Start growing your business today.</p>
                        <Button variant="glass" className="px-8 rounded-xl liquid-flicker">Learn how to get started</Button>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {hotels.map((hotel: any) => (
                            <div key={hotel.id} className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 hover:shadow-2xl transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Hotel className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-black text-xl mb-2 group-hover:text-primary transition-colors">{hotel.name}</h3>
                                <p className="text-sm text-muted-foreground mb-6">{hotel.city}, {hotel.country}</p>
                                <div className="flex gap-3 border-t border-white/10 pt-6">
                                    <Link href="/partner/dashboard/rooms" className="flex-1">
                                        <Button variant="glass" size="sm" className="w-full bg-white/5 hover:bg-white/10 rounded-xl liquid-flicker shadow-none">Rooms</Button>
                                    </Link>
                                    <Link href="/partner/dashboard/bookings" className="flex-1">
                                        <Button variant="glass" size="sm" className="w-full bg-white/5 hover:bg-white/10 rounded-xl liquid-flicker shadow-none">Bookings</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
