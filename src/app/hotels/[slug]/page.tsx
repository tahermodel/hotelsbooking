import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Star, MapPin, Wifi, Car, Coffee, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const session = await auth()

    // Fetch hotel with rooms and reviews
    const hotel = await prisma.hotel.findUnique({
        where: { slug: slug },
        include: {
            rooms: true,
            reviews: {
                include: { user: true },
                orderBy: { created_at: 'desc' },
                take: 3
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

    if (!hotel) return <div>Hotel not found</div>

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container pt-32 pb-12">
                <div className="grid gap-12 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl group border border-white/20">
                            <Image
                                src={hotel.main_image || hotel.images?.[0] || "/placeholder.jpg"}
                                alt={hotel.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {hotel.images && hotel.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                {hotel.images.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border shadow-md group">
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

                        <div className="space-y-8 px-2">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">{hotel.name}</h1>
                                    <div className="flex items-center text-muted-foreground font-medium">
                                        <MapPin className="mr-2 h-4 w-4 text-accent" />
                                        <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                    <Star className="h-5 w-5 fill-accent text-accent" />
                                    <span className="text-xl font-black">{hotel.star_rating}</span>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-border/50">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">World Class Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-border shadow-sm"><Wifi className="h-5 w-5 text-accent" /> <span className="text-sm font-bold">Free WiFi</span></div>
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-border shadow-sm"><Car className="h-5 w-5 text-accent" /> <span className="text-sm font-bold">Secure Parking</span></div>
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-border shadow-sm"><Coffee className="h-5 w-5 text-accent" /> <span className="text-sm font-bold">Gourmet Breakfast</span></div>
                                    <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-border shadow-sm"><Tv className="h-5 w-5 text-accent" /> <span className="text-sm font-bold">Smart Entertainment</span></div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-border/50">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">About the Property</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                                    {hotel.description || "Experience unprecedented luxury and comfort in our meticulously designed hotel, located in the vibrant heart of the city's most prestigious district."}
                                </p>
                            </div>
                        </div>

                        {/* Premium Reviews Section */}
                        <div className="pt-10 border-t border-border/50">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Guest Experiences</h2>
                            <div className="grid gap-6">
                                {hotel.reviews && hotel.reviews.length > 0 ? (
                                    hotel.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                                                        {review.user?.name?.[0] || 'G'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm">{review.user?.name || 'Anonymous Guest'}</h4>
                                                        <div className="flex items-center">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h5 className="font-bold mb-2">{review.title}</h5>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                        <p className="text-muted-foreground italic">No reviews yet. Be the first to experience this luxury.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-border p-8 sticky top-24 shadow-2xl bg-white">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Available Curated Rooms</h3>
                            <div className="space-y-6">
                                {hotel.rooms?.map((room: any) => (
                                    <div key={room.id} className="p-6 bg-background-alt border border-border rounded-2xl transition-all hover:bg-white/50 group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-black text-lg group-hover:text-primary transition-colors">{room.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{room.max_guests} Guests max</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-2xl bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">${room.base_price}</span>
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">per night</p>
                                            </div>
                                        </div>
                                        <Link href={`/booking/${hotel.id}?roomType=${room.id}`}>
                                            <Button className="w-full h-12 rounded-xl font-black bg-accent hover:bg-accent/90 text-accent-foreground border-none shadow-lg">Select Experience</Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

