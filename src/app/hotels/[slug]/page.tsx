import { Header } from "@/components/layout/header"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Star, MapPin, Wifi, Car, Coffee, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function HotelPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: hotel } = await supabase
        .from('hotels')
        .select('*, room_types(*)')
        .eq('slug', slug)
        .single()

    if (!hotel) return <div>Hotel not found</div>

    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-background to-background">
            <Header />
            <main className="flex-1 container py-12">
                <div className="grid gap-12 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="relative aspect-video overflow-hidden rounded-3xl glass shadow-2xl group">
                            <Image
                                src={hotel.images?.[0] || "/placeholder.jpg"}
                                alt={hotel.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        <div className="space-y-8 px-2">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">{hotel.name}</h1>
                                    <div className="flex items-center text-muted-foreground font-medium">
                                        <MapPin className="mr-2 h-4 w-4 text-teal-600" />
                                        <span>{hotel.address}, {hotel.city}, {hotel.country}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 glass px-4 py-2 rounded-2xl border-white/20">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-black">{hotel.star_rating}</span>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/10">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">World Class Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex items-center space-x-3 glass bg-white/5 p-4 rounded-2xl border-white/10"><Wifi className="h-5 w-5 text-teal-600" /> <span className="text-sm font-bold">Free WiFi</span></div>
                                    <div className="flex items-center space-x-3 glass bg-white/5 p-4 rounded-2xl border-white/10"><Car className="h-5 w-5 text-teal-600" /> <span className="text-sm font-bold">Secure Parking</span></div>
                                    <div className="flex items-center space-x-3 glass bg-white/5 p-4 rounded-2xl border-white/10"><Coffee className="h-5 w-5 text-teal-600" /> <span className="text-sm font-bold">Gourmet Breakfast</span></div>
                                    <div className="flex items-center space-x-3 glass bg-white/5 p-4 rounded-2xl border-white/10"><Tv className="h-5 w-5 text-teal-600" /> <span className="text-sm font-bold">Smart Entertainment</span></div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/10">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">About the Property</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                                    {hotel.description || "Experience unprecedented luxury and comfort in our meticulously designed hotel, located in the vibrant heart of the city's most prestigious district."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl glass-surface border-white/20 p-8 sticky top-24 shadow-2xl backdrop-blur-2xl">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Available Curated Rooms</h3>
                            <div className="space-y-6">
                                {hotel.room_types?.map((room: any) => (
                                    <div key={room.id} className="p-6 glass bg-white/5 border-white/10 rounded-2xl transition-all hover:bg-white/10 group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-black text-lg group-hover:text-teal-600 transition-colors">{room.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{room.max_guests} Guests max</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-2xl bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">${room.base_price}</span>
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">per night</p>
                                            </div>
                                        </div>
                                        <Link href={`/booking/${hotel.id}?roomType=${room.id}`}>
                                            <Button className="w-full h-12 rounded-xl font-black liquid-flicker shadow-lg">Select Experience</Button>
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
