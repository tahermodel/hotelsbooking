import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { HotelCard } from "@/components/hotels/hotel-card"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string, guests?: string, stars?: string, minPrice?: string, maxPrice?: string }>
}) {
    const searchParamsObj = await searchParams
    const supabase = await createClient()

    let query = supabase.from('hotels').select('*').eq('is_active', true)

    if (searchParamsObj.q) {
        query = query.or(`city.ilike.%${searchParamsObj.q}%,name.ilike.%${searchParamsObj.q}%`)
    }

    if (searchParamsObj.stars) {
        const starList = searchParamsObj.stars.split(',').map(Number)
        query = query.in('star_rating', starList)
    }

    const { data: hotels } = await query

    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-background to-background">
            <Header />
            <main className="flex-1 container py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Available Stays</h1>
                    <p className="text-muted-foreground font-medium lowercase tracking-widest mt-1">Found matching properties for your journey.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    <aside className="md:w-72 space-y-8">
                        <div className="p-8 rounded-3xl glass-surface border-white/20 shadow-2xl space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Star Rating</h3>
                                <div className="space-y-4">
                                    {[5, 4, 3, 2].map(star => (
                                        <label key={star} className="flex items-center space-x-4 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded glass bg-white/5 border-white/20 text-teal-600 transition-all" />
                                            <span className="text-sm font-bold group-hover:text-teal-600 transition-colors">{star} Stars</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 space-y-10">
                        <div className="glass p-2 rounded-2xl border-white/10">
                            <SearchFilters />
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2">
                            {hotels?.map((hotel: any) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                            {(!hotels || hotels.length === 0) && (
                                <div className="col-span-full py-24 text-center rounded-3xl glass-surface border-dashed border-2 border-white/10 flex flex-col items-center justify-center">
                                    <p className="text-lg font-black text-muted-foreground italic tracking-widest uppercase opacity-40">No properties found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
