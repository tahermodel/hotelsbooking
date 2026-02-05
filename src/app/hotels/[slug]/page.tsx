import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Star,
    MapPin,
    Wifi,
    Car,
    Coffee,
    Tv,
    Info,
    ShieldCheck,
    Mail,
    Phone,
    Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { HotelGallery } from "@/components/hotels/hotel-gallery"
import { HotelActions } from "@/components/hotels/hotel-actions"
import { AnimatedSection, ClientContentWrapper, AnimatedScaleButton } from "@/components/layout/client-animation-wrapper"
import { ReviewForm } from "@/components/hotels/review-form"
import { UserReviewCard } from "@/components/hotels/user-review-card"

export const dynamic = 'force-dynamic'

export default async function HotelPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ checkIn?: string, checkOut?: string }>
}) {
    const { slug } = await params
    const sParams = await searchParams
    const checkIn = sParams.checkIn
    const checkOut = sParams.checkOut

    const searchCheckIn = checkIn ? new Date(checkIn) : undefined
    const searchCheckOut = checkOut ? new Date(checkOut) : undefined

    const session = await auth()

    const hotel = await prisma.hotel.findUnique({
        where: { slug: slug },
        include: {
            rooms: {
                include: {
                    bookings: {
                        where: {
                            AND: [
                                {
                                    OR: [
                                        { status: 'confirmed' },
                                        {
                                            status: 'pending',
                                            created_at: { gt: new Date(Date.now() - 10 * 60 * 1000) }
                                        }
                                    ]
                                },
                                ...(searchCheckIn && searchCheckOut ? [{
                                    check_in_date: { lt: searchCheckOut },
                                    check_out_date: { gt: searchCheckIn }
                                }] : [{
                                    check_in_date: { lte: new Date() },
                                    check_out_date: { gte: new Date() }
                                }])
                            ]
                        }
                    },
                    availability: {
                        where: {
                            OR: [
                                { is_available: false },
                                {
                                    id: { not: undefined }, // Hack to ensure we select something if query matches
                                    locked_until: { gt: new Date() }
                                }
                            ],
                            ...(searchCheckIn && searchCheckOut ? {
                                AND: [
                                    { date: { gte: searchCheckIn } },
                                    { date: { lt: searchCheckOut } }
                                ]
                            } : {
                                date: {
                                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                    lt: new Date(new Date().setHours(23, 59, 59, 999))
                                }
                            })
                        }
                    }
                }
            },
            reviews: {
                include: { user: true },
                orderBy: { created_at: 'desc' },
                take: 10
            },
            favorites: session?.user?.id ? {
                where: { user_id: session.user.id }
            } : false,
            _count: {
                select: { favorites: true }
            }
        }
    }) as any

    if (!hotel) return (
        <div className="flex min-h-screen flex-col bg-neutral-950 items-center justify-center text-white">
            <Header />
            <h1 className="text-2xl font-bold">Property not found</h1>
            <Link href="/" className="mt-4 text-primary hover:underline">Return to exploration</Link>
        </div>
    )

    if (!hotel.is_active && hotel.owner_id !== session?.user?.id) {
        return (
            <div className="flex min-h-screen flex-col bg-neutral-950 items-center justify-center text-white px-4">
                <Header />
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                        <ShieldCheck className="w-10 h-10 text-white/20" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight uppercase">Private Property</h1>
                    <p className="text-white/40 font-medium">This luxury retreat is currently being prepared for its public debut. Check back soon for exclusive access.</p>
                    <Link href="/">
                        <Button className="bg-white text-black font-bold h-12 px-10 rounded-xl hover:bg-white/90">Return Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const getAmenityIcon = (name: string) => {
        const lower = name.toLowerCase()
        if (lower.includes('wifi')) return <Wifi className="h-5 w-5" />
        if (lower.includes('parking')) return <Car className="h-5 w-5" />
        if (lower.includes('coffee') || lower.includes('breakfast')) return <Coffee className="h-5 w-5" />
        if (lower.includes('tv')) return <Tv className="h-5 w-5" />
        return <Info className="h-5 w-5" />
    }

    // Check availability for review
    let bookingToReview: any = null;
    let existingReview: any = null;
    if (session?.user?.id) {
        const booking = await prisma.booking.findFirst({
            where: {
                user_id: session.user.id,
                hotel_id: hotel.id,
                status: { in: ['completed', 'confirmed'] },
            },
            include: {
                review: true
            }
        })

        if (booking) {
            bookingToReview = booking
            if (booking.review) {
                existingReview = booking.review
            }
        }
    }

    const ratings = hotel.reviews.map((r: any) => r.rating)
    const averageRating = ratings.length > 0
        ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
        : "5.0"

    const isLiked = hotel.favorites?.length > 0

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />

            <main className="container mx-auto px-4 pt-32 pb-24">
                <div className="flex flex-col gap-12">

                    <AnimatedSection>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                            <div className="space-y-6 max-w-4xl">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                        <Star className="w-3 h-3 text-accent fill-accent" />
                                        {hotel.star_rating}.0 Luxury Hotel
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-black uppercase tracking-widest text-success">
                                        <ShieldCheck className="w-3 h-3" />
                                        Verified Property
                                    </div>
                                </div>
                                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.85] uppercase break-words">
                                    {hotel.name}
                                </h1>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                            <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Admiration</p>
                                            <p className="text-lg sm:text-xl font-black">{hotel._count?.favorites || 0} Loves</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block h-10 w-px bg-white/5" />
                                    <HotelActions hotelName={hotel.name} hotelSlug={hotel.slug} initialIsLiked={isLiked} hotelId={hotel.id} />
                                </div>
                                <div className="flex flex-wrap items-center gap-6 text-white/40 font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-accent" />
                                        <span className="text-sm uppercase tracking-widest font-bold text-white/60">{hotel.address}, {hotel.city}, {hotel.country}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>


                    <HotelGallery
                        images={hotel.main_image ? [hotel.main_image, ...hotel.images.filter((img: string) => img !== hotel.main_image)] : hotel.images}
                        hotelName={hotel.name}
                    />

                    <div className="grid lg:grid-cols-3 gap-16 pt-12">

                        <div className="lg:col-span-2 space-y-24">

                            <AnimatedSection>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">About the Retreat</h2>
                                        <div className="h-px w-full bg-white/5" />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute -top-12 -left-8 text-[120px] font-black text-white/[0.03] select-none tracking-tighter">&quot;</span>
                                        <p className="text-2xl md:text-3xl leading-tight text-white/90 font-medium">
                                            &quot;{hotel.description || "In the heart of luxury, where every detail is a masterpiece of design and comfort. StayEase presents an unmatched hospitality experience tailored for those who seek the extraordinary."}&quot;
                                        </p>
                                    </div>
                                </div>
                            </AnimatedSection>


                            <AnimatedSection>
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">Signature Amenities</h2>
                                        <div className="h-px w-full bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {hotel.amenities?.map((amenity: any, i: number) => (
                                            <div key={i} className="flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 group">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-black transition-all duration-500">
                                                    {getAmenityIcon(amenity)}
                                                </div>
                                                <span className="font-bold text-sm text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>


                            <AnimatedSection>
                                <div id="accommodations" className="space-y-12 scroll-mt-32">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">Available Units</h2>
                                            <div className="h-px w-full bg-white/5" />
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                            <span className="text-xs font-black">{hotel.rooms.length}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Suites</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-8">
                                        {hotel.rooms.map((room: any) => {
                                            const isBooked = room.bookings && room.bookings.length > 0;
                                            const isBlocked = room.availability && room.availability.length > 0;
                                            const isOutsideRange = (room.available_from && searchCheckIn && new Date(room.available_from) > searchCheckIn) ||
                                                (room.available_until && searchCheckOut && new Date(room.available_until).getTime() < (new Date(searchCheckOut).getTime() - 86400000));

                                            const isAvailable = !isBooked && !isBlocked && !isOutsideRange;

                                            return (
                                                <div key={room.id} className="relative group/room rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-700">
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="relative w-full md:w-80 aspect-[4/3] md:aspect-square overflow-hidden shrink-0">
                                                            <Image src={room.main_image || hotel.main_image} alt={room.name} fill className="object-cover group-hover/room:scale-110 transition-transform duration-1000" />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                                        </div>
                                                        <div className="p-6 md:p-10 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex justify-between items-start mb-6">
                                                                    <div className="space-y-1">
                                                                        <h3 className="text-3xl font-black uppercase tracking-tight">{room.name}</h3>
                                                                        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                                                                            <span>{room.max_guests} Guests</span>
                                                                            <span>•</span>
                                                                            <span>{room.bed_configuration || "King Bed"}</span>
                                                                        </div>
                                                                    </div>
                                                                    {isAvailable ? (
                                                                        <div className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-black uppercase tracking-widest text-success">Vacant</div>
                                                                    ) : (
                                                                        <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500">Occupied</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mt-12 pt-8 border-t border-white/5">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Starting from</p>
                                                                    <p className="text-3xl font-black text-white">{formatCurrency(room.base_price)}<span className="text-sm text-white/40 ml-1">/ NIGHT</span></p>
                                                                </div>
                                                                <Link href={`/rooms/${room.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""}`} className="w-full sm:w-auto">
                                                                    <AnimatedScaleButton className="h-14 w-full sm:px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-colors shadow-2xl shadow-white/10">
                                                                        View Details
                                                                    </AnimatedScaleButton>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>


                        <div className="space-y-12">
                            <div className="sticky top-32 space-y-12">

                                <AnimatedSection>
                                    <div className="p-6 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-2xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full -mr-16 -mt-16" />
                                        <div className="relative z-10 space-y-8">
                                            <div className="space-y-2">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Connect</h3>
                                                <p className="text-2xl font-black uppercase tracking-tighter">Reservation Inquiries</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">{hotel.contact_email}</span>
                                                </div>
                                                {hotel.contact_phone && (
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all">
                                                            <Phone className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">{hotel.contact_phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedSection>

                                <AnimatedSection delay={0.2}>
                                    <div className="p-6 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-accent/20 transition-all duration-500">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-all" />
                                        <div className="relative z-10">
                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Guest Sentiment</h3>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-6xl font-black tracking-tighter text-white">{averageRating}</span>
                                                    <div className="flex flex-col">
                                                        <div className="flex gap-0.5 mb-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < Math.round(Number(averageRating)) ? "text-accent fill-accent" : "text-white/10"}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Average Rating</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-white/5">
                                                <p className="text-xs font-medium text-white/40 leading-relaxed uppercase tracking-widest">
                                                    Based on {hotel.reviews.length} authenticated guest experiences
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </div>
                    </div>


                    <div className="pt-32 border-t border-white/5 space-y-16">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Guest Chronicles</h2>
                                <h3 className="text-5xl font-black tracking-tighter uppercase">The Guest Experience</h3>
                            </div>
                            {session?.user?.id && bookingToReview && !existingReview && (
                                <ReviewForm bookingId={bookingToReview.id} hotelId={hotel.id} />
                            )}
                        </div>

                        {session?.user?.id && bookingToReview && existingReview && (
                            <UserReviewCard
                                review={{ ...existingReview, user: session.user }}
                                bookingId={bookingToReview.id}
                                hotelId={hotel.id}
                            />
                        )}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hotel.reviews
                                .filter((r: any) => r.id !== existingReview?.id)
                                .map((review: any) => (
                                    <div key={review.id} className="p-6 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-black border border-white/10 uppercase">
                                                    {review.user?.name?.[0] || 'G'}
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-xs tracking-widest">{review.user?.name || 'Anonymous'}</p>
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">{new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-accent fill-accent" />)}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black mb-4 tracking-tight uppercase">{review.title}</h4>
                                        <p className="text-white/60 leading-relaxed text-sm font-medium">{review.content}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
