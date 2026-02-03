import { Header } from "@/components/layout/header"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { ApplicationsList } from "@/components/admin/applications-list"
import { AnimatedSection, ClientContentWrapper } from "@/components/layout/client-animation-wrapper"

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
    const applications = await prisma.hotelApplication.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white selection:bg-white selection:text-black">
            <Header />
            <main className="flex-1 container mx-auto px-6 py-24 max-w-4xl pt-40">
                <ClientContentWrapper className="space-y-12">

                    <AnimatedSection>
                        <div className="text-center space-y-6">
                            <Link
                                href="/admin/dashboard"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group mb-4"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                Back to Authority
                            </Link>
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Review Management
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Applications</h1>
                                <p className="text-white/40 font-medium text-lg max-w-2xl mx-auto">
                                    Audit and process incoming partnership requests for the platform.
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection delay={0.1}>
                        <ApplicationsList applications={applications} />
                    </AnimatedSection>

                </ClientContentWrapper>
            </main>
        </div>
    )
}
