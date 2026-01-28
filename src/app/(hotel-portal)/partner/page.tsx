import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, Lock, ShieldCheck, TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PartnerPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="bg-primary text-white py-20">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Grow Your Hotel Business</h1>
                        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                            Partner with StayEase and reach thousands of travelers looking for their next stay.
                        </p>
                        <Link href="/partner/apply">
                            <Button size="lg" variant="secondary" className="px-12 py-6 text-lg">Apply Now</Button>
                        </Link>
                    </div>
                </section>

                <section className="py-20 container">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Increase Revenue</h3>
                            <p className="text-muted-foreground">Access a global network of travelers and boost your occupancy rates year-round.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Simple Integration</h3>
                            <p className="text-muted-foreground">Our partner dashboard makes it easy to manage rooms, rates, and bookings in real-time.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Secure Payments</h3>
                            <p className="text-muted-foreground">Benefit from our secure pay-later system and guaranteed reservations policy.</p>
                        </div>
                    </div>
                </section>

                <section className="bg-muted py-20">
                    <div className="container px-4 lg:flex items-center gap-12">
                        <div className="lg:w-1/2 mb-10 lg:mb-0">
                            <h2 className="text-3xl font-bold mb-6">Rules and Policies</h2>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-primary flex-shrink-0" />
                                    <p><strong>Commission:</strong> Standard 15% commission on all completed stays.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-primary flex-shrink-0" />
                                    <p><strong>Response Time:</strong> Must respond to booking requests within 24 hours.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-primary flex-shrink-0" />
                                    <p><strong>Accuracy:</strong> All room info and photos must be kept up-to-date.</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-primary flex-shrink-0" />
                                    <p><strong>Cancellations:</strong> Partners must honor the platform's cancellation policy.</p>
                                </li>
                            </ul>
                        </div>
                        <div className="lg:w-1/2 p-8 bg-background rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold mb-4">Contact Our Team</h3>
                            <p className="text-muted-foreground mb-6">Have questions? Reach out to our partnership specialist.</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    <span>partners@stayease.com</span>
                                </div>
                                <Button className="w-full">Message Us</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
