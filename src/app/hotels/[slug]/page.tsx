
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

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />

            {/* Full Width Gallery Header */}
            <div className="relative pt-24 pb-12">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
                    <div className="md:col-span-2 relative rounded-3xl overflow-hidden group border border-white/10">
                        <Image
                            src={(hotel as any).main_image || (hotel as any).images?.[0] || "/placeholder.jpg"}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="hidden md:grid grid-cols-1 gap-4 h-full">
                        {(hotel as any).images?.slice(1, 3).map((img: string, i: number) => (
                            <div key={i} className="relative h-full rounded-2xl overflow-hidden group border border-white/10">
                                <Image src={img} alt={`${hotel.name} ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                    <div className="hidden md:grid grid-cols-1 gap-4 h-full">
                        <div className="relative h-full rounded-2xl overflow-hidden group border border-white/10">
                            <Image src={(hotel as any).images?.[3] || (hotel as any).main_image} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="relative h-full rounded-2xl overflow-hidden group border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="text-center p-4">
                                <p className="text-2xl font-black">{((hotel as any).images?.length || 0) + 1}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">View Gallery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 pb-24">
                <ClientContentWrapper className="grid lg:grid-cols-3 gap-12 relative items-start">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Title & Actions */}
                        <AnimatedSection>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest">
                                            <Star className="w-3 h-3 text-accent fill-accent" />
                                            {hotel.star_rating}.0 Luxury Hotel
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-xs font-black uppercase tracking-widest text-success">
                                            <ShieldCheck className="w-3 h-3" />
                                            Verified
                                        </div>
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">{hotel.name}</h1>
                                    <div className="flex items-center gap-4 text-white/40 font-medium">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-accent" />
                                            {hotel.address}, {hotel.city}
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-white/10" />
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-accent" />
                                            {hotel.country}
                                        </div>
                                    </div>
                                </div>
                                <HotelActions hotelName={hotel.name} hotelSlug={hotel.slug} />
                            </div>
                        </AnimatedSection>

                        {/* Description */}
                        <AnimatedSection>
                            <div className="card-section p-10 border-white/10 bg-white/[0.02]">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8">The Experience</h2>
                                <p className="text-xl leading-relaxed text-white/80 font-medium italic">
                                    &quot;{hotel.description || "In the heart of luxury, where every detail is a masterpiece of design and comfort. StayEase presents an unmatched hospitality experience tailored for those who seek the extraordinary."}&quot;
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Amenities */}
                        <AnimatedSection>
                            <div className="space-y-8">
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Establishment Amenities</h2>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {hotel.amenities?.map((amenity, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                                {getAmenityIcon(amenity)}
                                            </div>
                                            <span className="font-bold text-white/80">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Rooms List */}
                        <AnimatedSection>
                            <div id="accommodations" className="space-y-10 pt-16 border-t border-white/5 scroll-mt-32">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tight mb-2">Accommodations</h2>
                                        <p className="text-white/40 font-medium">Curated selection of our finest rooms and suites</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Available</p>
                                        <p className="text-2xl font-black">{hotel.rooms.length} Units</p>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {hotel.rooms.map((room: any) => {
                                        const isBooked = room.bookings && room.bookings.length > 0
                                        const isBlocked = room.availability && room.availability.length > 0
                                        const isOutsideRange = (room.available_from && searchCheckIn && new Date(room.available_from) > searchCheckIn) ||
                                            (room.available_until && searchCheckOut && new Date(room.available_until).getTime() < (new Date(searchCheckOut).getTime() - 86400000));
                                        const isAvailable = !isBooked && !isBlocked && !isOutsideRange;

                                        return (
                                            <div key={room.id} className="card-section p-2 flex flex-col md:flex-row gap-6 border-white/10 hover:border-white/20 transition-all group/room">
                                                <div className="relative w-full md:w-64 aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0 border border-white/5">
                                                    <Image src={room.main_image || (hotel as any).main_image} alt={room.name} fill className="object-cover group-hover/room:scale-105 transition-transform duration-700" />
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h3 className="text-2xl font-bold">{room.name}</h3>
                                                            {isAvailable ? (
                                                                <div className="px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-black uppercase tracking-wider text-success">Available</div>
                                                            ) : (
                                                                <div className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-wider text-red-500">Booked</div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-white/40 text-sm font-medium">
                                                            <span>Up to {room.max_guests} Guests</span>
                                                            <div className="h-1 w-1 rounded-full bg-white/10 mt-2" />
                                                            <span>{room.bed_configuration || "King Bed"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-8">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Price per night</p>
                                                            <p className="text-2xl font-black text-white">{formatCurrency(room.base_price)}</p>
                                                        </div>
                                                        <Link href={`/rooms/${room.id}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""}`}>
                                                            <AnimatedScaleButton className="h-12 px-8 rounded-xl bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 font-bold transition-all">
                                                                Details
                                                            </AnimatedScaleButton>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Reviews */}
                        <AnimatedSection>
                            <div className="space-y-12 pt-24 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-3xl font-black tracking-tight">Guest Insights</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-accent fill-accent" />)}
                                        </div>
                                        <span className="font-bold text-lg">4.9 / 5.0</span>
                                    </div>
                                </div>

                                {session?.user?.id && bookingToReview && (
                                    <div className="card-section p-8 border-accent/20 bg-accent/[0.02]">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <p className="font-bold">You stayed here recently. Share your verdict with the world.</p>
                                        </div>
                                        <ReviewForm bookingId={bookingToReview.id} hotelId={hotel.id} existingReview={existingReview} />
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {hotel.reviews.map((review: any) => (
                                        <div key={review.id} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-black border border-white/10">
                                                        {review.user?.name?.[0] || 'G'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{review.user?.name || 'Anonymous Guest'}</p>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-white/20">{new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-accent fill-accent" />)}
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-bold mb-3 tracking-tight">{review.title}</h4>
                                            <p className="text-white/60 leading-relaxed font-normal">{review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Right Column: Contact & Sidebar */}
                    <div className="sticky top-32 space-y-8">
                        <AnimatedSection>
                            <div className="card-section p-8 bg-white/[0.02] border-white/10 shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[100px] -mr-16 -mt-16 rounded-full" />
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8">Official Contact</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Email</p>
                                            <p className="font-bold text-white/80">{hotel.contact_email || "concierge@stayease.com"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Support</p>
                                            <p className="font-bold text-white/80">{hotel.contact_phone || "+1 (888) LUX-STAY"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-12 border-t border-white/5 space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Operating Hours</p>
                                    <p className="text-sm font-medium text-white/60 uppercase">Check-in: 15:00 • Check-out: 11:00</p>
                                    <p className="text-sm font-medium text-white/60 uppercase">24/7 Front Desk Premium Service</p>
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.2}>
                            <div className="card-section p-8 bg-white/[0.02] border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <h4 className="text-xl font-black tracking-tight mb-4 relative z-10">Luxury Concierge</h4>
                                <p className="text-white/40 text-sm mb-8 leading-relaxed relative z-10">Our elite concierge team is ready to curate your perfect stay, from private jet transfers to exclusive local experiences.</p>
                                <Button className="w-full bg-white text-black font-black h-12 rounded-xl relative z-10 hover:bg-white/90 shadow-xl shadow-white/5 transition-all">
                                    Inquire Now
                                </Button>
                            </div>
                        </AnimatedSection>
                    </div>

                </ClientContentWrapper>
            </main>
        </div>
    )
}

