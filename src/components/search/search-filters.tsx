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
        <form onSubmit={handleSearch} className="w-full">
            <div className="flex flex-col md:flex-row gap-3 p-3 card-section">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Where are you going?"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="relative flex-1 md:flex-none md:w-48">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Check-in - Out"
                        className="h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm cursor-pointer hover:border-primary/50 transition-all"
                        readOnly
                    />
                </div>

                <div className="relative flex-1 md:flex-none md:w-36">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <select
                        className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-12 pr-4 text-sm cursor-pointer hover:border-primary/50 transition-all"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                    </select>
                </div>

                <Button type="submit" size="lg" className="h-12 px-8">
                    Search
                </Button>
            </div>
        </form>
    )
}
