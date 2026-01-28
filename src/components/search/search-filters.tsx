"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Users } from "lucide-react"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export function SearchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [guests, setGuests] = useState(searchParams.get("guests") || "2")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (guests) params.set("guests", guests)
        router.push(`/search?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="relative">
            <LiquidGlass className="flex flex-col gap-3 p-3 border-white/10 shadow-2xl md:flex-row md:items-center rounded-[2rem]">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Where are you going?"
                        className="h-16 w-full rounded-2xl border-none bg-white/5 pl-14 pr-6 text-lg placeholder:text-muted-foreground/30 focus:bg-white/10 transition-all font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="relative md:w-64 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-muted-foreground transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Check-in - Out"
                        className="h-16 w-full rounded-2xl border-none bg-white/5 pl-14 pr-6 text-sm cursor-pointer hover:bg-white/10 transition-all font-medium"
                        readOnly
                    />
                </div>

                <div className="relative md:w-48 group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-muted-foreground transition-colors" />
                    </div>
                    <select
                        className="h-16 w-full appearance-none rounded-2xl border-none bg-white/5 pl-14 pr-6 text-sm cursor-pointer hover:bg-white/10 transition-all font-medium"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                    </select>
                </div>

                <Button type="submit" size="lg" className="h-16 px-10 rounded-2xl shadow-xl liquid-flicker font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white">
                    Explore
                </Button>
            </LiquidGlass>
        </form>
    )
}
