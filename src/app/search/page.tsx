import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { HotelCard } from "@/components/hotels/hotel-card"
import { createClient } from "@/lib/supabase/server"

export default async function SearchPage({
    searchParams
}: {
    searchParams: { q?: string, guests?: string, stars?: string, minPrice?: string, maxPrice?: string }
}) {
    const supabase = await createClient()

    let query = supabase.from('hotels').select('*').eq('is_active', true)

    if (searchParams.q) {
        query = query.or(`city.ilike.%${searchParams.q}%,name.ilike.%${searchParams.q}%`)
    }

    if (searchParams.stars) {
        const starList = searchParams.stars.split(',').map(Number)
        query = query.in('star_rating', starList)
    }

    const { data: hotels } = await query

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="md:w-64 space-y-6">
                        <div className="p-4 border rounded-xl">
                            <h3 className="font-bold mb-4">Filters</h3>
                            {/* Add more filter UI here */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Price Range</label>
                                    <input type="range" className="w-full" min="0" max="1000" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Star Rating</label>
                                    <div className="flex flex-col space-y-2 pt-2">
                                        {[5, 4, 3, 2, 1].map(star => (
                                            <label key={star} className="flex items-center space-x-2">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                                <span className="text-sm">{star} Stars</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 space-y-6">
                        <SearchFilters />
                        <div className="grid gap-6 sm:grid-cols-2">
                            {hotels?.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                            {(!hotels || hotels.length === 0) && (
                                <div className="col-span-full py-12 text-center text-muted-foreground">
                                    No hotels found for your search.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
