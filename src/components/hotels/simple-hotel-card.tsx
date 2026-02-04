"use client"

import Link from "next/link"
import { Star, MapPin, ArrowRight, ShieldCheck, Heart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export function SimpleHotelCard({ hotel }: { hotel: any }) {
    const prices = hotel.rooms?.map((r: any) => r.base_price) || []
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group"
        >
            <Link href={`/hotels/${hotel.slug}`}>
                <LiquidGlass className="p-6 border-white/10 group-hover:border-white/20 transition-all duration-300" animate={false}>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors line-clamp-1 truncate">
                                    {hotel.name}
                                </h3>
                                <div className="flex items-center gap-2 text-white/40">
                                    <MapPin className="h-3 w-3 text-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{hotel.city}, {hotel.country}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                <Star className="h-3 w-3 fill-accent text-accent" />
                                <span className="text-[10px] font-black text-white">{hotel.star_rating}.0</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Starting Price</p>
                                <p className="text-lg font-black text-white">{lowestPrice !== null ? formatCurrency(lowestPrice) : "TBA"}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Category</p>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-3 w-3 text-success" />
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">Luxury</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Heart className="w-4 h-4 fill-red-500" />
                                </div>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Favorited</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                                <ArrowRight className="w-5 h-5 text-white group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>
                </LiquidGlass>
            </Link>
        </motion.div>
    )
}
