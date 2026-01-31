import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { HotelCard } from "@/components/hotels/hotel-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ArrowRight, Star, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredHotels = await prisma.hotel.findMany({
    where: { is_active: true },
    take: 6
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full pt-20">
        <section className="py-16 md:py-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <div className="space-y-4">
                  <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    Book Now, Pay Later
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                    Find Your Perfect
                    <span className="text-primary block">Escape</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Experience boutique luxury with our seamless booking system. Handpicked properties for the discerning traveler.
                  </p>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Premium Selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Verified Properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-sm font-medium">Flexible Payment</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in stagger-2">
                <div className="aspect-[4/3] rounded-2xl bg-muted overflow-hidden border border-border">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground hero-pattern">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Star className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Hero Image Placeholder</p>
                      <p className="text-xs text-muted-foreground mt-1">Replace with your hotel imagery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-card border-y border-border">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in-up stagger-3">
              <SearchFilters />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 animate-fade-in">
              <div>
                <span className="section-title">Explore</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Featured Destinations</h2>
                <p className="text-muted-foreground mt-2">Handpicked properties for your next adventure</p>
              </div>
              <Link href="/search">
                <Button variant="outline" className="group">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredHotels?.map((hotel, index) => (
                <div key={hotel.id} className={`animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="animate-fade-in-up stagger-1">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-secondary-foreground/80">Premium Hotels</div>
              </div>
              <div className="animate-fade-in-up stagger-2">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-secondary-foreground/80">Happy Travelers</div>
              </div>
              <div className="animate-fade-in-up stagger-3">
                <div className="text-4xl font-bold mb-2">4.9</div>
                <div className="text-secondary-foreground/80">Average Rating</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary">StayEase</span>
              <span className="text-sm text-muted-foreground">© 2026. Demo project.</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/partner" className="hover:text-primary transition-colors">Partner</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
