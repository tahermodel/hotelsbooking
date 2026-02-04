import { Header } from "@/components/layout/header"
import { AnimatedSection, ClientContentWrapper } from "@/components/layout/client-animation-wrapper"
import { Eye, Database, Share2, Lock } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto px-4 pt-40 pb-24 max-w-5xl">
                <ClientContentWrapper className="space-y-24">
                    <AnimatedSection>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-12 bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Data Integrity</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                                Privacy <br />Policy
                            </h1>
                            <p className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed">
                                Understanding how your information is handled is paramount to our commitment to excellence and security.
                            </p>
                        </div>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Database className="w-6 h-6" />,
                                title: "Data Collection",
                                content: "We collect information necessary to facilitate your hotel bookings, including contact details and payment information via Stripe's encrypted infrastructure."
                            },
                            {
                                icon: <Share2 className="w-6 h-6" />,
                                title: "Data Usage",
                                content: "Your data is shared exclusively with the hotels you book with. We maintain a zero-tolerance policy against the sale of personal data."
                            },
                            {
                                icon: <Eye className="w-6 h-6" />,
                                title: "Transparency",
                                content: "You have full visibility over your account data and can request deletion or modifications at any time through our concierge support."
                            },
                            {
                                icon: <Lock className="w-6 h-6" />,
                                title: "Security Protocols",
                                content: "Every transaction and data point is protected by industry-leading encryption and advanced firewall systems to ensure absolute confidentiality."
                            }
                        ].map((item, i) => (
                            <AnimatedSection key={i} delay={0.1 * (i + 1)}>
                                <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 group">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all mb-10">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic mb-6 tracking-tight">{item.title}</h3>
                                    <p className="text-white/40 font-medium leading-relaxed italic">
                                        &quot;{item.content}&quot;
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <AnimatedSection delay={0.5}>
                        <div className="p-12 rounded-[3rem] bg-accent/5 border border-accent/20 relative overflow-hidden group hover:bg-accent/10 transition-colors duration-700">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 blur-[140px] -mr-40 -mt-40 rounded-full group-hover:bg-accent/30 transition-colors" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Your Trust is our Currency</h2>
                                    <p className="text-white/60 font-medium max-w-xl italic">Our privacy framework is designed to exceed global standards, providing you with peace of mind during every stay.</p>
                                </div>
                                <div className="text-left md:text-right space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Encryption Standard</h4>
                                    <p className="text-white font-bold uppercase tracking-tighter italic text-2xl">AES-256 BIT</p>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </ClientContentWrapper>
            </main>
        </div>
    )
}
