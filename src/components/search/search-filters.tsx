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
        <form onSubmit={handleSearch} className="flex flex-col gap-3 rounded-2xl glass-surface p-2 border-white/20 shadow-2xl md:flex-row md:items-center">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Where are you going?"
                    className="h-14 w-full rounded-xl border-none bg-white/5 pl-12 pr-4 text-lg placeholder:text-muted-foreground/50 focus:bg-white/10 focus:ring-1 focus:ring-white/20 transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="relative md:w-56 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-muted-foreground transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Check-in - Out"
                    className="h-14 w-full rounded-xl border-none bg-white/5 pl-12 pr-4 text-sm cursor-pointer hover:bg-white/10 transition-all"
                    readOnly
                />
            </div>

            <div className="relative md:w-40 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-muted-foreground transition-colors" />
                </div>
                <select
                    className="h-14 w-full appearance-none rounded-xl border-none bg-white/5 pl-12 pr-4 text-sm cursor-pointer hover:bg-white/10 transition-all focus:ring-1 focus:ring-white/20"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                </select>
            </div>

            <Button type="submit" size="lg" className="h-14 px-8 rounded-xl shadow-lg liquid-flicker">
                Explore
            </Button>
        </form>
    )
}
