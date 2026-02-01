import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Users, Bed, Maximize, Wifi, Coffee, Tv, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = await params
    const session = await auth()

    const room = await prisma.roomType.findUnique({
        where: { id: roomId },
        include: {
            hotel: true,
            bookings: {
                where: {
                    status: { in: ['pending', 'confirmed'] },
                    check_in_date: { lte: new Date() },
                    check_out_date: { gte: new Date() }
                }
            }
        }
    })

    if (!room) return <div className="flex min-h-screen items-center justify-center"><p className="text-xl font-semibold">Room not found</p></div>

    const isBooked = room.bookings.length > 0

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="rounded-3xl border bg-card p-2 shadow-sm overflow-hidden">
                        <div className="relative aspect-video overflow-hidden rounded-2xl group">
                            <Image
                                src={(room as any).main_image || (room as any).images?.[0] || "/placeholder.jpg"}
                                alt={room.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                    </div>

                    {(room as any).images && (room as any).images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {(room as any).images.slice(0, 4).map((img: string, idx: number) => (
                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border bg-muted shadow-sm group">
                                    <Image
                                        src={img}
                                        alt={`${room.name} ${idx + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-card rounded-3xl border shadow-sm p-8 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-black tracking-tight text-foreground">{room.name}</h1>
                                <div className="flex items-center text-muted-foreground font-medium">
                                    <span>at {room.hotel.name}</span>
                                </div>
                            </div>
                            <div className="flex bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20 items-center gap-2">
                                <span className="text-3xl font-black text-primary">${room.base_price}</span>
                                <span className="text-sm text-muted-foreground font-semibold">/ night</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-dashed">
                            <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-2xl border border-border/50">
                                <Users className="h-5 w-5 text-accent" />
                                <div>
                                    <p className="text-xs text-muted-foreground font-semibold">Max Guests</p>
                                    <p className="text-sm font-bold text-foreground">{room.max_guests}</p>
                                </div>
                            </div>
                            {room.bed_configuration && (
                                <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-2xl border border-border/50">
                                    <Bed className="h-5 w-5 text-accent" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold">Bed Type</p>
                                        <p className="text-sm font-bold text-foreground">{room.bed_configuration}</p>
                                    </div>
                                </div>
                            )}
                            {room.size_sqm && (
                                <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-2xl border border-border/50">
                                    <Maximize className="h-5 w-5 text-accent" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-semibold">Room Size</p>
                                        <p className="text-sm font-bold text-foreground">{room.size_sqm} m²</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {room.description && (
                            <div className="pt-6 border-t border-dashed">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Description</h2>
                                <p className="text-muted-foreground leading-relaxed text-base font-medium">{room.description}</p>
                            </div>
                        )}

                        {room.amenities && room.amenities.length > 0 && (
                            <div className="pt-6 border-t border-dashed">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Room Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {room.amenities.map((amenity: string, idx: number) => (
                                        <div key={idx} className="flex items-center space-x-2 text-sm font-semibold text-foreground">
                                            <div className="h-2 w-2 rounded-full bg-accent" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-dashed flex flex-col items-center gap-4">
                            {isBooked ? (
                                <div className="w-full p-6 bg-destructive/10 border-2 border-destructive/30 rounded-2xl text-center">
                                    <p className="text-xl font-black text-destructive">This room is currently booked</p>
                                    <p className="text-sm text-muted-foreground mt-2 font-medium">Please check back later or choose another room</p>
                                </div>
                            ) : (
                                <Link href={`/booking/${room.hotel_id}?roomType=${room.id}`} className="w-full">
                                    <Button size="lg" className="w-full text-lg font-bold h-14 rounded-xl bg-foreground text-background hover:bg-foreground/90">
                                        Book This Room
                                    </Button>
                                </Link>
                            )}
                            <Link href={`/hotels/${room.hotel.slug}`}>
                                <Button variant="outline" size="lg" className="font-semibold">
                                    Back to Hotel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
