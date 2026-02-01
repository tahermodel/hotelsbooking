"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function SearchSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Parse initial state from URL
    const initialStars = searchParams.get("stars")?.split(",").map(Number) || []
    const initialAmenities = searchParams.get("amenities")?.split(",") || []

    const [selectedStars, setSelectedStars] = useState<number[]>(initialStars)
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialAmenities)

    const amenitiesList = ["WiFi", "Pool", "Spa", "Gym", "Parking", "Restaurant", "Bar"]

    useEffect(() => {
        // Debounce or just update on change? enhancing UX by manual update or auto
        // Let's do auto update for now
        const params = new URLSearchParams(searchParams.toString())

        if (selectedStars.length > 0) {
            params.set("stars", selectedStars.join(","))
        } else {
            params.delete("stars")
        }

        if (selectedAmenities.length > 0) {
            params.set("amenities", selectedAmenities.join(","))
        } else {
            params.delete("amenities")
        }

        router.push(`/search?${params.toString()}`, { scroll: false })
    }, [selectedStars, selectedAmenities, router, searchParams])

    const toggleStar = (star: number) => {
        setSelectedStars(prev =>
            prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
        )
    }

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        )
    }

    return (
        <aside className="md:w-72 space-y-8">
            <div className="p-8 rounded-3xl border border-white/20 shadow-2xl bg-white/5 backdrop-blur-md">
                <div className="space-y-10">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Star Rating</h3>
                        <div className="space-y-4">
                            {[5, 4, 3, 2].map(star => (
                                <label key={star} className="flex items-center space-x-4 cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedStars.includes(star) ? 'bg-accent border-accent' : 'bg-white/10 border-white/20'}`}
                                        onClick={() => toggleStar(star)}
                                    >
                                        {selectedStars.includes(star) && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <span className="text-sm font-bold group-hover:text-accent transition-colors">{star} Stars</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Amenities</h3>
                        <div className="space-y-4">
                            {amenitiesList.map(amenity => (
                                <label key={amenity} className="flex items-center space-x-4 cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedAmenities.includes(amenity) ? 'bg-accent border-accent' : 'bg-white/10 border-white/20'}`}
                                        onClick={() => toggleAmenity(amenity)}
                                    >
                                        {selectedAmenities.includes(amenity) && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <span className="text-sm font-bold group-hover:text-accent transition-colors">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
