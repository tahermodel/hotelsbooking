"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Users } from "lucide-react"

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
        <form onSubmit={handleSearch} className="relative w-full">
            <div className="flex flex-col gap-2 md:gap-3 p-2 md:p-3 border border-white/10 shadow-2xl md:flex-row md:items-center rounded-2xl md:rounded-[2rem] bg-white/10 backdrop-blur-xl">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-3 md:left-5 flex items-center pointer-events-none">
                        <Search className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Where are you going?"
                        className="h-12 md:h-16 w-full rounded-xl md:rounded-2xl border-none bg-white/5 pl-10 md:pl-14 pr-4 md:pr-6 text-sm md:text-lg placeholder:text-muted-foreground/30 focus:bg-white/10 focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="relative flex-1 md:flex-none md:w-56 group">
                    <div className="absolute inset-y-0 left-3 md:left-5 flex items-center pointer-events-none">
                        <Calendar className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Check-in - Out"
                        className="h-12 md:h-16 w-full rounded-xl md:rounded-2xl border-none bg-white/5 pl-10 md:pl-14 pr-4 md:pr-6 text-xs md:text-sm cursor-pointer hover:bg-white/10 transition-all font-medium"
                        readOnly
                    />
                </div>

                <div className="relative flex-1 md:flex-none md:w-44 group">
                    <div className="absolute inset-y-0 left-3 md:left-5 flex items-center pointer-events-none">
                        <Users className="h-4 md:h-5 w-4 md:w-5 text-muted-foreground transition-colors" />
                    </div>
                    <select
                        className="h-12 md:h-16 w-full appearance-none rounded-xl md:rounded-2xl border-none bg-white/5 pl-10 md:pl-14 pr-4 md:pr-6 text-xs md:text-sm cursor-pointer hover:bg-white/10 transition-all font-medium"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                    </select>
                </div>

                <Button type="submit" className="h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl shadow-xl liquid-flicker font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white text-xs md:text-sm">
                    Explore
                </Button>
            </div>
        </form>
    )
}
