import { Header } from "@/components/layout/header"
import { PartnerApplyForm } from "@/components/forms/partner-apply-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AnimatedSection, ClientContentWrapper } from "@/components/layout/client-animation-wrapper"
import { Building2, Sparkles } from "lucide-react"

export default async function PartnerApplyPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/partner/apply")

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto pt-40 pb-24 px-4">
                <ClientContentWrapper className="max-w-4xl mx-auto space-y-20">

                    <AnimatedSection>
                        <div className="text-center space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                                <Sparkles className="w-3.5 h-3.5" />
                                Growth Partnership
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">Join Our <br />Network</h1>
                            <p className="text-white/40 font-medium text-lg max-w-2xl mx-auto italic leading-relaxed">
                                &quot;In the world of elite hospitality, visibility is everything. Partner with StayEase to showcase your unique property to seekers of the extraordinary.&quot;
                            </p>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.2}>
                        <div className="card-section p-1 border-white/10 bg-white/[0.01] shadow-[0_64px_128px_-24px_rgba(0,0,0,0.9)] relative">
                            <div className="absolute -inset-4 bg-accent/5 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                            <div className="bg-neutral-900/60 rounded-[31px] p-8 md:p-16 relative overflow-hidden backdrop-blur-3xl border border-white/5">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[140px] -mr-48 -mt-48 rounded-full pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[140px] -ml-48 -mb-48 rounded-full pointer-events-none" />
                                <PartnerApplyForm />
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.4}>
                        <div className="flex flex-wrap justify-center gap-16 py-8">
                            {[
                                { icon: Building2, text: "Boutique Curation" },
                                { icon: Sparkles, text: "Global Exposure" },
                                { icon: Building2, text: "Elite Networking" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-accent transition-colors duration-500 cursor-default">
                                    <item.icon className="w-4 h-4" />
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                </ClientContentWrapper>
            </main>
        </div>
    )
}
