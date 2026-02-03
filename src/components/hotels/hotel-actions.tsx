"use client"

import { Share2, Heart, ChevronRight } from "lucide-react"
import { AnimatedScaleButton } from "@/components/layout/client-animation-wrapper"
import { useState } from "react"

export function HotelActions({ hotelName, hotelSlug }: { hotelName: string, hotelSlug: string }) {
    const [isLiked, setIsLiked] = useState(false)

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({
                    title: hotelName,
                    text: `Check out this luxury stay: ${hotelName}`,
                    url: url
                })
            } catch (err) {
                console.error("Share failed", err)
            }
        } else {
            await navigator.clipboard.writeText(url)
        }
    }

    const handleExperience = () => {
        const element = document.getElementById("accommodations")
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="flex gap-3">
            <AnimatedScaleButton
                onClick={handleShare}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
            >
                <Share2 className="w-5 h-5 text-white/60" />
            </AnimatedScaleButton>
            <AnimatedScaleButton
                onClick={() => setIsLiked(!isLiked)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
            >
                <Heart className={`w-5 h-5 transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-white/60"}`} />
            </AnimatedScaleButton>
            <AnimatedScaleButton
                onClick={handleExperience}
                className="h-12 px-6 rounded-2xl bg-white text-black font-black flex items-center gap-2 hover:bg-white/90 transition-all shadow-xl shadow-white/5"
            >
                Experience <ChevronRight className="w-4 h-4" />
            </AnimatedScaleButton>
        </div>
    )
}
