import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { HotelCard } from "@/components/hotels/hotel-card"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_active', true)
    .limit(6)

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-30 pointer-events-none">
            <div className="absolute top-20 left-0 w-72 h-72 bg-primary/40 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center space-y-10 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                  Your Next Escape,<br />Perfectly Refracted.
                </h1>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl font-medium">
                  Experience boutique luxury with our seamless pay-later booking system.
                </p>
              </div>

              <div className="w-full max-w-5xl">
                <SearchFilters />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 container px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Featured Destinations</h2>
              <p className="text-muted-foreground">Handpicked properties for your next adventure.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex glass px-6 rounded-full hover:bg-white/20 liquid-flicker">View All</Button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hotels?.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/5 backdrop-blur-sm">
        <div className="container flex flex-col md:flex-row h-auto md:h-24 items-center justify-between py-6 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">StayEase</span>
            <span className="text-xs text-muted-foreground font-medium">© 2026. All rights reserved.</span>
          </div>
          <nav className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a className="hover:text-primary transition-colors" href="/terms">Terms</a>
            <a className="hover:text-primary transition-colors" href="/privacy">Privacy</a>
            <a className="hover:text-primary transition-colors" href="/partner">Partner</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
