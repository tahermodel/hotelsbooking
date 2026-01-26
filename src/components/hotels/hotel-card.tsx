import Link from "next/link"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function HotelCard({ hotel }: { hotel: any }) {
    return (
        <Link href={`/hotels/${hotel.slug}`} className="group overflow-hidden rounded-2xl glass-surface border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={hotel.images?.[0] || "/placeholder.jpg"}
                    alt={hotel.name}
                    fill
                    className="object-cover opacity-90 transition-transform group-hover:scale-110 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            </div>
            <div className="p-5 relative">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold tracking-tight group-hover:text-primary transition-colors">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 px-2 py-1 rounded-full glass bg-white/5 border-white/10">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold">{hotel.star_rating}</span>
                    </div>
                </div>
                <div className="mt-2 flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{hotel.city}, {hotel.country}</span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">from {formatCurrency(199)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">per night</span>
                </div>
            </div>
        </Link>
    )
}
