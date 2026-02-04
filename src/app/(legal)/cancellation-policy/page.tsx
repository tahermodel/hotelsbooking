import { Header } from "@/components/layout/header"
import { AnimatedSection, ClientContentWrapper } from "@/components/layout/client-animation-wrapper"
import { Clock, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CancellationPolicyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-40 pb-24 max-w-5xl">
                <ClientContentWrapper className="space-y-24">
                    <AnimatedSection>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-12 bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Refund Protocols</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                                Cancellation <br />Policy
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed">
                                Our commitment to flexibility balanced with property security ensures a sustainable hospitality ecosystem for all.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        <AnimatedSection delay={0.1}>
                            <div className="p-10 rounded-[2.5rem] bg-success/5 border border-success/20 group hover:bg-success/10 transition-all duration-700">
                                <div className="w-16 h-16 rounded-3xl bg-success/10 flex items-center justify-center text-success mb-10 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic mb-4">7+ Days Prior</h3>
                                <p className="text-4xl font-black text-white mb-4 tracking-tighter italic">100%<span className="text-sm font-medium text-white/40 ml-2 uppercase tracking-widest">Refund</span></p>
                                <p className="text-white/40 font-medium leading-relaxed italic text-sm">
                                    Full restitution of authorized capital without any administrative penalties.
                                </p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.2}>
                            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 group hover:border-white/20 transition-all duration-700">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/60 mb-10 group-hover:scale-110 transition-transform">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic mb-4">3-7 Days Prior</h3>
                                <p className="text-4xl font-black text-white mb-4 tracking-tighter italic">75%<span className="text-sm font-medium text-white/40 ml-2 uppercase tracking-widest">Refund</span></p>
                                <p className="text-white/40 font-medium leading-relaxed italic text-sm">
                                    A 25% administrative retention applies to facilitate room re-allocation.
                                </p>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.3}>
                            <div className="p-10 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 group hover:bg-red-500/10 transition-all duration-700">
                                <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-10 group-hover:scale-110 transition-transform">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic mb-4">1-3 Days Prior</h3>
                                <p className="text-4xl font-black text-white mb-4 tracking-tighter italic">50%<span className="text-sm font-medium text-white/40 ml-2 uppercase tracking-widest">Refund</span></p>
                                <p className="text-white/40 font-medium leading-relaxed italic text-sm">
                                    Final window for partial refund as property preparation is significantly advanced.
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <AnimatedSection delay={0.4}>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">Special Provisions</h2>
                                    <div className="h-px w-full bg-white/5" />
                                </div>
                                <div className="space-y-6">
                                    <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4">
                                        <h4 className="text-lg font-black uppercase italic">No-Show Protocol</h4>
                                        <p className="text-white/40 font-medium leading-relaxed italic">Failure to check-in within 24 hours of the reserved window results in total capital forfeiture (100% penalty).</p>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 space-y-4">
                                        <h4 className="text-lg font-black uppercase italic">Last Minute Change</h4>
                                        <p className="text-white/40 font-medium leading-relaxed italic">Cancellations within 24 hours of expected arrival are treated as no-shows to protect property occupancy rates.</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={0.5}>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 whitespace-nowrap">Platform Security</h2>
                                    <div className="h-px w-full bg-white/5" />
                                </div>
                                <div className="p-10 rounded-[2.5rem] bg-accent/5 border border-accent/20 flex flex-col justify-between h-full">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                                            <ShieldAlert className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Abuse Prevention Mechanism</h3>
                                        <p className="text-white/60 font-medium leading-relaxed italic">To maintain the integrity of our partnership with global luxury properties, we monitor cancellation patterns. Frequent cancellations exceed our systemic threshold may lead to temporary reservation suspension.</p>
                                    </div>
                                    <div className="mt-12 pt-8 border-t border-accent/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-accent">Threshold</p>
                                        <p className="text-2xl font-black uppercase italic tracking-tighter">5 cancellations / 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </ClientContentWrapper>
            </main>
        </div>
    )
}
