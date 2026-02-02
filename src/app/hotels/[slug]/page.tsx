
import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Star, MapPin, Wifi, Car, Coffee, Tv, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReviewForm } from "@/components/hotels/review-form"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function HotelPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ checkIn?: string, checkOut?: string }>
}) {
    const { slug } = await params
    const { checkIn, checkOut } = await searchParams

    const searchCheckIn = checkIn ? new Date(checkIn) : undefined
    const searchCheckOut = checkOut ? new Date(checkOut) : undefined

    const session = await auth()

    // Fetch hotel with rooms and reviews
    const hotel = await prisma.hotel.findUnique({
        where: { slug: slug },
        include: {
            rooms: {
                include: {
                    bookings: {
                        where: {
                            status: { in: ['pending', 'confirmed'] },
                            ...(searchCheckIn && searchCheckOut ? {
                                AND: [
                                    { check_in_date: { lt: searchCheckOut } },
                                    { check_out_date: { gt: searchCheckIn } }
                                ]
                            } : {
                                // Default check: currently booked
                                check_in_date: { lte: new Date() },
                                check_out_date: { gte: new Date() }
                            })
                        }
                    }
                }
            },
            reviews: {
                include: { user: true },
                orderBy: { created_at: 'desc' },
                take: 10
            }
        }
    })

    if (!hotel) return <div>Hotel not found</div>

    // Access Control
    if (!hotel.is_active && hotel.owner_id !== session?.user?.id) {
        return (
            <div className="flex min-h-screen flex-col bg-background items-center justify-center">
                <Header />
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Property Not Published</h1>
                    <p className="text-muted-foreground">This property is currently not available to the public.</p>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Check availability for review
    let bookingToReview = null;
    let existingReview = null;
    if (session?.user?.id) {
        bookingToReview = await prisma.booking.findFirst({
            where: {
                user_id: session.user.id,
                hotel_id: hotel.id,
                status: { in: ['completed', 'confirmed'] },
            },
            include: {
                review: true
            }
        })

        if (bookingToReview?.review) {
            existingReview = bookingToReview.review
        }
    }

    // Dynamic Icon mapping for amenities (simple fallback)
    const getAmenityIcon = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('wifi')) return <Wifi className="h-5 w-5 text-accent" />
        if (lower.includes('parking')) return <Car className="h-5 w-5 text-accent" />
        if (lower.includes('coffee') || lower.includes('breakfast')) return <Coffee className="h-5 w-5 text-accent" />
        if (lower.includes('tv')) return <Tv className="h-5 w-5 text-accent" />
        return <Info className="h-5 w-5 text-accent" />
    }

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
                {/* Added mx-auto px-4 to ensure it doesn't touch edges on any screen size */}

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image Card */}
                        <div className="rounded-3xl border bg-card p-2 shadow-sm overflow-hidden">
                            <div className="relative aspect-video overflow-hidden rounded-2xl group">
                                <Image
                                    src={(hotel as any).main_image || (hotel as any).images?.[0] || "/placeholder.jpg"}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        {(hotel as any).images && (hotel as any).images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {(hotel as any).images.slice(0, 4).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border bg-muted shadow-sm group">
                                        <Image
                                            src={img}
                                            alt={`${hotel.name} gallery ${idx + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="bg-card rounded-3xl border shadow-sm p-8 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black tracking-tight">{hotel.name}</h1>
                                    <div className="flex items-center text-muted-foreground font-medium">
                                        <MapPin className="mr-2 h-4 w-4 text-accent" />
                                        <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                                    </div>
                                </div>
                                <div className="flex bg-accent/5 px-4 py-2 rounded-2xl border border-accent/20 items-center gap-2">
                                    <Star className="h-5 w-5 fill-accent text-accent" />
                                    <span className="text-xl font-black text-accent-foreground">{hotel.star_rating}</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-dashed">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Overview</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                                    {hotel.description || "No description available."}
                                </p>
                            </div>

                            {/* Dynamic Amenities */}
                            <div className="pt-8 border-t border-dashed">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {hotel.amenities && hotel.amenities.length > 0 ? (
                                        hotel.amenities.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 bg-muted/50 p-4 rounded-2xl border border-border/50">
                                                {getAmenityIcon(amenity)}
                                                <span className="text-sm font-bold text-foreground">{amenity}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground italic">Amenities not listed.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-card rounded-3xl border shadow-sm p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Guest Reviews</h2>
                                {bookingToReview && (
                                    <Badge variant="secondary" className="animate-pulse">You can review your stay!</Badge>
                                )}
                            </div>

                            {/* Review Form */}
                            {bookingToReview && (
                                <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20">
                                    <ReviewForm bookingId={bookingToReview.id} hotelId={hotel.id} existingReview={existingReview} />
                                </div>
                            )}

                            <div className="space-y-6">
                                {hotel.reviews && hotel.reviews.length > 0 ? (
                                    hotel.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-background-alt p-6 rounded-2xl border hover:border-accent/40 transition-colors">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {review.user?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{review.user?.name || 'Anonymous Guest'}</div>
                                                    <div className="flex mt-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="ml-auto text-xs text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <h4 className="font-bold mb-2 text-sm">{review.title}</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Booking Card */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border bg-card p-8 sticky top-24 shadow-xl">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Select Your Room</h3>
                            <div className="space-y-6">
                                {hotel.rooms?.map((room: any) => {
                                    const isBooked = room.bookings && room.bookings.length > 0
                                    const isOutsideRange = (room.available_from && searchCheckIn && new Date(room.available_from) > searchCheckIn) ||
                                        (room.available_until && searchCheckOut && new Date(room.available_until) < searchCheckOut);

                                    const isAvailable = !isBooked && !isOutsideRange;

                                    return (
                                        <div key={room.id} className="p-5 bg-background border border-dashed rounded-2xl group hover:border-accent transition-all">
                                            <div className="mb-4">
                                                <h4 className="font-black text-lg text-foreground">{room.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                                                    {room.max_guests} Guests
                                                    {room.available_from && ` • Available from ${new Date(room.available_from).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-muted-foreground line-through opacity-50">${Math.round(room.base_price * 1.2)}</span>
                                                    <span className="font-black text-2xl text-primary">${room.base_price}</span>
                                                </div>
                                                {!isAvailable ? (
                                                    <div className="px-4 py-2 bg-destructive/10 border border-destructive/30 rounded-xl">
                                                        <span className="text-sm font-bold text-destructive">
                                                            {isBooked ? "Booked" : "Unavailable for these dates"}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Link href={`/rooms/${room.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""}`}>
                                                        <Button size="sm" className="rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90">
                                                            More Info
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

