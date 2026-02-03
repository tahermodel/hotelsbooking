import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function HotelCard({ hotel }: { hotel: any }) {
    const prices = hotel.rooms?.map((r: any) => r.base_price) || []
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : null

    return (
        <div className="card-section card-section-hover overflow-hidden group">
            <Link href={`/hotels/${hotel.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={hotel.main_image || hotel.images?.[0] || "/placeholder.jpg"}
                        alt={hotel.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="text-xs font-bold">{hotel.star_rating}</span>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{hotel.city}, {hotel.country}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                            <span className="text-xl font-bold">
                                {lowestPrice !== null ? formatCurrency(lowestPrice) : "View"}
                            </span>
                            {lowestPrice !== null && <span className="text-xs text-muted-foreground ml-1">/ night</span>}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
