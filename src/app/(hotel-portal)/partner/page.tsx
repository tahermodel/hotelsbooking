import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Building2, Lock, ShieldCheck, TrendingUp, CheckCircle2, ArrowRight, Mail } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PartnerPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 w-full">
                {/* Full Screen Hero Section */}
                <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0"
                            alt="Partner with Us"
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Gradient Blur to Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background-alt via-background-alt/80 to-transparent" />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-20">
                        <div className="space-y-4 animate-fade-in-up">
                            <span className="inline-block px-4 py-1.5 bg-accent text-accent-foreground text-sm font-semibold rounded-full shadow-lg">
                                Partner Program
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                                Grow Your Hotel <br className="hidden md:block" />
                                <span className="text-secondary-foreground">Business</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-sm font-medium">
                                Partner with StayEase and reach thousands of travelers looking for their next stay. <br className="hidden md:block" /> Exclusive tools for the modern hotelier.
                            </p>
                            <div className="pt-4">
                                <Link href="/partner/apply">
                                    <Button size="lg" className="bg-white text-secondary hover:bg-white/90 gap-2 h-12 px-8 text-lg font-semibold shadow-xl">
                                        Apply Now
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container px-4 max-w-6xl mx-auto">
                        <div className="text-center mb-16 animate-fade-in">
                            <span className="section-title">Benefits</span>
                            <h2 className="text-3xl font-bold">Why Partner With Us</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="card-section card-section-hover p-8 text-center animate-fade-in-up stagger-1">
                                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                    <TrendingUp className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Increase Revenue</h3>
                                <p className="text-muted-foreground">
                                    Access a global network of travelers and boost your occupancy rates year-round.
                                </p>
                            </div>

                            <div className="card-section card-section-hover p-8 text-center animate-fade-in-up stagger-2">
                                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                                    <Lock className="w-8 h-8 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Simple Integration</h3>
                                <p className="text-muted-foreground">
                                    Our partner dashboard makes it easy to manage rooms, rates, and bookings in real-time.
                                </p>
                            </div>

                            <div className="card-section card-section-hover p-8 text-center animate-fade-in-up stagger-3">
                                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                                <p className="text-muted-foreground">
                                    Benefit from our secure pay-later system and guaranteed reservations policy.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-muted">
                    <div className="container px-4 max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            <div className="animate-fade-in-up">
                                <span className="section-title">Guidelines</span>
                                <h2 className="text-3xl font-bold mb-8">Rules and Policies</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Commission</p>
                                            <p className="text-muted-foreground">Standard 15% commission on all completed stays.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Response Time</p>
                                            <p className="text-muted-foreground">Must respond to booking requests within 24 hours.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Accuracy</p>
                                            <p className="text-muted-foreground">All room info and photos must be kept up-to-date.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4 text-accent-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Cancellations</p>
                                            <p className="text-muted-foreground">Partners must honor the platform&apos;s cancellation policy.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-section p-8 animate-fade-in-up stagger-2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Contact Our Team</h3>
                                        <p className="text-sm text-muted-foreground">Have questions? Reach out to our partnership specialist.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                                        <Building2 className="w-5 h-5 text-primary" />
                                        <span className="font-medium">partners@stayease.com</span>
                                    </div>
                                    <Button className="w-full">Send Message</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-accent text-accent-foreground">
                    <div className="container px-4 max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-primary-foreground/80 mb-8">Join hundreds of hotels already growing with StayEase</p>
                        <Link href="/partner/apply">
                            <Button size="lg" className="bg-white text-accent hover:bg-white/90">
                                Apply Now
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
