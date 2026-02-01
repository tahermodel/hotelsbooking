import { Header } from "@/components/layout/header"
import { SearchFilters } from "@/components/search/search-filters"
import { HotelCard } from "@/components/hotels/hotel-card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredHotels = await prisma.hotel.findMany({
    where: { is_active: true },
    take: 6
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 w-full">
        {/* Full Screen Hero Section */}
        <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=3270&auto=format&fit=crop"
              alt="Luxury Hotel"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Gradient Blur to Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-20">
            <div className="space-y-4 animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-semibold rounded-full">
                Book Now, Pay Later
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                Find Your Perfect <br className="hidden md:block" />
                <span className="text-primary-foreground">Escape</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-sm font-medium">
                Experience boutique luxury with our seamless booking system. <br className="hidden md:block" /> Handpicked properties for the discerning traveler.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section - Overlapping or just below with smooth transition */}
        <section className="relative z-20 -mt-24 pb-16">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in-up stagger-2 bg-card/50 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2">
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
                <div className="text-4xl font-bold mb-2">5K+</div>
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
