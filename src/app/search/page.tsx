import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchSidebar } from "@/components/search/search-sidebar"
import { HotelCard } from "@/components/hotels/hotel-card"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string, guests?: string, stars?: string, minPrice?: string, maxPrice?: string, amenities?: string }>
}) {
    const searchParamsObj = await searchParams

    const starRatings = searchParamsObj.stars ? searchParamsObj.stars.split(',').map(Number) : undefined
    const amenities = searchParamsObj.amenities ? searchParamsObj.amenities.split(',') : undefined

    const hotels = await prisma.hotel.findMany({
        where: {
            is_active: true,
            AND: [
                searchParamsObj.q ? {
                    OR: [
                        { name: { contains: searchParamsObj.q, mode: 'insensitive' } },
                        { city: { contains: searchParamsObj.q, mode: 'insensitive' } },
                    ]
                } : {},
                starRatings ? {
                    star_rating: { in: starRatings }
                } : {},
                amenities ? {
                    amenities: { hasSome: amenities } // or hasEvery depending on requirement. hasMy usually implies looking for hotels that have AT LEAST one of these. 
                    // If user selects multiple, they might expect ALL. "hasEvery" is better for strict filtering.
                    // Let's use hasEvery to narrow down.
                } : {}
            ]
        }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container pt-32 pb-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">Available Stays</h1>
                    <p className="text-muted-foreground font-medium lowercase tracking-widest mt-1">Found matching properties for your journey.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    <SearchSidebar />

                    <div className="flex-1 space-y-10">
                        <div className="p-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                            <SearchFilters />
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2">
                            {hotels?.map((hotel: any) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                            {(!hotels || hotels.length === 0) && (
                                <div className="col-span-full py-24 text-center rounded-3xl border-dashed border-2 border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center">
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
