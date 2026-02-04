import { Header } from "@/components/layout/header"
import { AnimatedSection, ClientContentWrapper } from "@/components/layout/client-animation-wrapper"
import { Scale, ShieldCheck, UserCheck, FileText } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-40 pb-24 max-w-5xl">
                <ClientContentWrapper className="space-y-24">
                    <AnimatedSection>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-12 bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Legal Protocol</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
                                Terms of <br />Service
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed">
                                Please review the operational standards and legal boundaries that govern your experience on the StayEase elite hospitality platform.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Scale className="w-6 h-6" />,
                                title: "1. Acceptance",
                                content: "By accessing and using StayEase, you agree to be bound by these Terms of Service. Our platform acts as an intermediary agent connecting hotels with customers."
                            },
                            {
                                icon: <ShieldCheck className="w-6 h-6" />,
                                title: "2. Reservations",
                                content: "Reservations are confirmed only after successful payment authorization. Our pay-later system holds the funds on your card to guarantee the room for the hotel."
                            },
                            {
                                icon: <UserCheck className="w-6 h-6" />,
                                title: "3. Responsibilities",
                                content: "Users are responsible for providing accurate information. Misuse of the platform, including frequent no-shows, may lead to account restrictions."
                            }
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={0.1 * (i + 1)}>
                                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 h-full group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all mb-8">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-black uppercase mb-4">{item.title}</h3>
                                    <p className="text-white/40 font-medium leading-relaxed text-sm">
                                        &quot;{item.content}&quot;
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.4}>
                        <div className="p-12 rounded-[3rem] bg-white/[0.01] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] -mr-32 -mt-32 rounded-full" />
                            <div className="relative z-10 space-y-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">Standard Operating Procedures</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Last Updated</h4>
                                        <p className="text-white/40 font-bold uppercase tracking-tighter">February 2026</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Contact Legal</h4>
                                        <p className="text-white/40 font-bold uppercase tracking-tighter">legal@stayease.com</p>
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
