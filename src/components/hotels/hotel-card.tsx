import Link from "next/link"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export function HotelCard({ hotel }: { hotel: any }) {
    return (
        <LiquidGlass className="p-0 border-white/10 group">
            <Link href={`/hotels/${hotel.slug}`} className="block overflow-hidden transition-all active:scale-[0.98]">
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={hotel.images?.[0] || "/placeholder.jpg"}
                        alt={hotel.name}
                        fill
                        className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1.5 rounded-full glass bg-white/10 backdrop-blur-xl border-white/20">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-black text-white">{hotel.star_rating}</span>
                    </div>
                </div>
                <div className="p-6 relative">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors mb-1">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 opacity-60" />
                        <span className="font-medium">{hotel.city}, {hotel.country}</span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{formatCurrency(199)}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">per night</span>
                        </div>
                        <div className="h-10 w-10 rounded-full glass bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <span className="text-lg font-bold">→</span>
                        </div>
                    </div>
                </div>
            </Link>
        </LiquidGlass>
    )
}
