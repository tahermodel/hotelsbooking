import { Header } from "@/components/layout/header"
import { AnimatedSection, ClientContentWrapper } from "@/components/layout/client-animation-wrapper"
import { Briefcase, Coins, Handshake, Building2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PartnerAgreementPage() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-40 pb-24 max-w-5xl">
                <ClientContentWrapper className="space-y-24">
                    <AnimatedSection>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-12 bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Strategic Alliance</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                                Partner <br />Agreement
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed">
                                Our partnership framework is designed to elevate luxury properties through digital excellence and global accessibility.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Handshake className="w-6 h-6" />,
                                title: "1. Strategic Scope",
                                content: "This agreement governs the elite synergy between StayEase and modern properties listing their assets on our platform."
                            },
                            {
                                icon: <Coins className="w-6 h-6" />,
                                title: "2. Revenue Model",
                                content: "StayEase operates on a performance-based commission of 15% on the total booking value for every successful stay facilitated."
                            },
                            {
                                icon: <Building2 className="w-6 h-6" />,
                                title: "3. Property Standards",
                                content: "Partners must maintain architectural excellence, accurate availability, and honor all platform-facilitated reservations."
                            }
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={0.1 * (i + 1)}>
                                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 h-full group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all mb-8">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic mb-4">{item.title}</h3>
                                    <p className="text-white/40 font-medium leading-relaxed italic text-sm">
                                        &quot;{item.content}&quot;
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.4}>
                        <div className="p-12 rounded-[3.5rem] bg-white/[0.01] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 blur-[140px] -ml-48 -mt-48 rounded-full" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="w-24 h-24 rounded-full bg-accent text-black flex items-center justify-center shrink-0">
                                    <Briefcase className="w-10 h-10" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Operational Excellence</h2>
                                    <p className="text-white/40 font-medium leading-relaxed italic text-lg max-w-2xl">
                                        We provide our partners with advanced dashboard analytics, direct capital management via Stripe, and global exposure to a curated audience of high-net-worth travelers.
                                    </p>
                                    <div className="flex gap-8 items-center pt-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Payment Processor</p>
                                            <p className="text-xl font-black italic uppercase tracking-tight">Stripe Connect</p>
                                        </div>
                                        <div className="h-10 w-px bg-white/10" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent">Settlement Cycle</p>
                                            <p className="text-xl font-black italic uppercase tracking-tight">On Check-in</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </ClientContentWrapper>
            </main>
        </div>
    )
}
