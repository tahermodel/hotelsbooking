import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { HotelCard } from "@/components/hotels/hotel-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredHotels = await prisma.hotel.findMany({
    where: { is_active: true },
    take: 6
  })



  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <Header />
      <main className="flex-1 w-full relative z-10">
        <section className="relative py-12 md:py-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 md:space-y-10 text-center">
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                  Your Next Escape,<br />Perfectly Refracted.
                </h1>
                <p className="mx-auto max-w-[600px] text-sm md:text-base lg:text-lg text-muted-foreground font-medium">
                  Experience boutique luxury with our seamless pay-later booking system.
                </p>
              </div>

              <div className="w-full max-w-4xl">
                <SearchFilters />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 border-t border-primary/5">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-0 mb-8 md:mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Featured Destinations</h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Handpicked properties for your next adventure.</p>
              </div>
              <Button variant="glass" className="hidden md:flex px-6 rounded-full hover:bg-primary/5 liquid-flicker text-primary">View All</Button>
            </div>
            <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {featuredHotels?.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-primary/5 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row h-auto md:h-24 items-center justify-between py-6 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-black tracking-tighter text-primary">StayEase</span>
            <span className="text-xs text-muted-foreground font-medium">© 2026. All rights reserved. This is a demonstration project not a real commercial one</span>
          </div>
          <nav className="flex space-x-6 md:space-x-8 text-xs md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a className="hover:text-primary transition-colors" href="/terms">Terms</a>
            <a className="hover:text-primary transition-colors" href="/privacy">Privacy</a>
            <a className="hover:text-primary transition-colors" href="/partner">Partner</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
