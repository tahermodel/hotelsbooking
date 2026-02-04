
import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Star, MapPin, Wifi, Car, Coffee, Tv, Info, ShieldCheck, Share2, Heart, ChevronRight, Globe, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReviewForm } from "@/components/hotels/review-form"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection, ClientContentWrapper, AnimatedScaleButton } from "@/components/layout/client-animation-wrapper"
import { formatCurrency } from "@/lib/utils"
import { HotelActions } from "@/components/hotels/hotel-actions"
import { HotelGallery } from "@/components/hotels/hotel-gallery"

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
                                check_in_date: { lte: new Date() },
                                check_out_date: { gte: new Date() }
                            })
                        }
                    },
                    availability: {
                        where: {
                            is_available: false,
                            ...(searchCheckIn && searchCheckOut ? {
                                AND: [
                                    { date: { gte: searchCheckIn } },
                                    { date: { lt: searchCheckOut } }
                                ]
                            } : {
                                date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
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

    const ratings = hotel.reviews.map(r => r.rating)
    const averageRating = ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : "5.0"

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />

            <main className="container mx-auto px-4 pt-32 pb-24">
                <div className="flex flex-col gap-12">
                    {/* Header Info Section */}
                    <AnimatedSection>
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
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
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
                                    {hotel.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-white/40 font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-accent" />
                                        {hotel.address}, {hotel.city}
                                    </div>
                                    <div className="hidden md:block h-1 w-1 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-accent" />
                                        {hotel.country}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <HotelActions hotelName={hotel.name} hotelSlug={hotel.slug} />
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Premium Gallery */}
                    <div className="-mx-4">
                        <HotelGallery
                            images={[
                                (hotel as any).main_image,
                                ...((hotel as any).images || [])
                            ].filter(Boolean)}
                            hotelName={hotel.name}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-16 items-start">
                        {/* Left Column: Core Info */}
                        <div className="lg:col-span-2 space-y-24">
                            {/* Description */}
                            <AnimatedSection>
                                <div className="relative">
                                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-white/5 to-transparent" />
                                    <div className="space-y-8">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">The Residence</h2>
                                        <p className="text-2xl md:text-3xl leading-tight text-white/90 font-medium italic">
                                            &quot;{hotel.description || "In the heart of luxury, where every detail is a masterpiece of design and comfort. StayEase presents an unmatched hospitality experience tailored for those who seek the extraordinary."}&quot;
                                        </p>
                                    </div>
                                </div>
                            </AnimatedSection>

                            {/* Amenities */}
                            <AnimatedSection>
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">Signature Amenities</h2>
                                        <div className="h-px w-full bg-white/5" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {hotel.amenities?.map((amenity, i) => (
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

                            {/* Accommodations */}
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
                                            const isBooked = room.bookings && room.bookings.length > 0
                                            const isBlocked = room.availability && room.availability.length > 0
                                            const isOutsideRange = (room.available_from && searchCheckIn && new Date(room.available_from) > searchCheckIn) ||
                                                (room.available_until && searchCheckOut && new Date(room.available_until).getTime() < (new Date(searchCheckOut).getTime() - 86400000));
                                            const isAvailable = !isBooked && !isBlocked && !isOutsideRange;

                                            return (
                                                <div key={room.id} className="relative group/room rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-700">
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="relative w-full md:w-80 aspect-[4/3] md:aspect-square overflow-hidden shrink-0">
                                                            <Image src={room.main_image || (hotel as any).main_image} alt={room.name} fill className="object-cover group-hover/room:scale-110 transition-transform duration-1000" />
                                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                                        </div>
                                                        <div className="p-10 flex-1 flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex justify-between items-start mb-6">
                                                                    <div className="space-y-1">
                                                                        <h3 className="text-3xl font-black uppercase italic tracking-tight">{room.name}</h3>
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
                                                            <div className="flex items-end justify-between mt-12 pt-8 border-t border-white/5">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Starting from</p>
                                                                    <p className="text-3xl font-black text-white">{formatCurrency(room.base_price)}<span className="text-sm text-white/40 ml-1">/ NIGHT</span></p>
                                                                </div>
                                                                <Link href={`/rooms/${room.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""}`}>
                                                                    <AnimatedScaleButton className="h-14 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-colors shadow-2xl shadow-white/10">
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

                        {/* Right Column: Contact & Reviews */}
                        <div className="space-y-12">
                            <div className="sticky top-32 space-y-12">
                                {/* Contact Card */}
                                <AnimatedSection>
                                    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-2xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[100px] -mr-16 -mt-16 rounded-full" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-10">Direct Contact</h3>

                                        <div className="space-y-8">
                                            <div className="flex items-center gap-5 group cursor-pointer">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all duration-500">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Concierge</p>
                                                    <p className="font-bold text-white/80 group-hover:text-white transition-colors">{hotel.contact_email || "concierge@stayease.com"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-5 group cursor-pointer">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all duration-500">
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Protocol</p>
                                                    <p className="font-bold text-white/80 group-hover:text-white transition-colors">{hotel.contact_phone || "+1 (888) LUX-STAY"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                                <span>Check-in</span>
                                                <span className="text-white/60">15:00</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                                <span>Check-out</span>
                                                <span className="text-white/60">11:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedSection>

                                {/* Reviews Summary */}
                                <AnimatedSection delay={0.2}>
                                    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Guest Rating</h3>
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-accent fill-accent" />
                                                <span className="text-2xl font-black italic">{averageRating}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {hotel.reviews.slice(0, 2).map((review: any) => (
                                                <div key={review.id} className="space-y-3">
                                                    <p className="text-sm font-bold text-white/80 leading-relaxed italic">&quot;{review.title}&quot;</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-black text-white/40">
                                                            {review.user?.name?.[0] || 'G'}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{review.user?.name || 'Anonymous'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </div>
                    </div>

                    {/* Full Reviews Section (Bottom) */}
                    <div className="pt-32 border-t border-white/5 space-y-16">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Guest Chronicles</h2>
                                <h3 className="text-5xl font-black tracking-tighter uppercase italic">The Guest Experience</h3>
                            </div>
                            {session?.user?.id && bookingToReview && !existingReview && (
                                <ReviewForm bookingId={bookingToReview.id} hotelId={hotel.id} />
                            )}
                        </div>

                        {session?.user?.id && bookingToReview && existingReview && (
                            <div className="p-10 rounded-[2.5rem] bg-accent/[0.03] border border-accent/20">
                                <p className="text-accent font-black uppercase tracking-widest text-[10px] mb-4">Your Experience</p>
                                <ReviewForm bookingId={bookingToReview.id} hotelId={hotel.id} existingReview={existingReview} />
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hotel.reviews.map((review: any) => (
                                <div key={review.id} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 font-black border border-white/10 uppercase italic">
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
                                    <h4 className="text-lg font-black italic mb-4 tracking-tight uppercase">{review.title}</h4>
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

