"use client"

import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export function SimpleHotelCard({ hotel }: { hotel: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="group"
        >
            <Link href={`/hotels/${hotel.slug}`}>
                <LiquidGlass className="p-4 border-white/10 group-hover:border-white/20 transition-all duration-300" animate={false}>
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors truncate mb-1">
                                {hotel.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-white/40">
                                <MapPin className="h-3 w-3 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest truncate">{hotel.city}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 shrink-0">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-[10px] font-black text-white">{hotel.star_rating}.0</span>
                        </div>
                    </div>
                </LiquidGlass>
            </Link>
        </motion.div>
    )
}
