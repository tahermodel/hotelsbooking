import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { cancelBooking } from "@/actions/bookings"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Hotel } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function MyBookingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const bookings = await prisma.booking.findMany({
        where: { user_id: session.user.id },
        include: { hotel: { select: { name: true, city: true, country: true } } },
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-12 max-w-4xl pt-24">
                <div className="mb-8 animate-fade-in">
                    <Link
                        href="/account"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Account
                    </Link>
                    <span className="section-title block">Reservations</span>
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                </div>

                <div className="space-y-4">
                    {bookings?.map((booking: any, index: number) => (
                        <div
                            key={booking.id}
                            className={`card-section p-6 animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Hotel className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg">{booking.hotel.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${booking.status === 'confirmed' ? 'bg-secondary/10 text-secondary' :
                                                    booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                                                        'bg-muted text-muted-foreground'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <MapPin className="w-4 h-4" />
                                            {booking.hotel.city}, {booking.hotel.country}
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-medium">
                                                    Check-in: {new Date(booking.check_in_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-medium">
                                                    Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3 md:border-l md:border-border md:pl-6">
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(booking.total_amount)}</p>
                                    {booking.status === 'confirmed' && (
                                        <form action={async () => {
                                            "use server"
                                            await cancelBooking(booking.id, "Customer request")
                                        }}>
                                            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white">
                                                Cancel
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!bookings || bookings.length === 0) && (
                        <div className="card-section py-16 text-center animate-fade-in">
                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                                <Hotel className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground mb-4">You haven&apos;t made any bookings yet.</p>
                            <Link href="/search">
                                <Button>Start Exploring</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
