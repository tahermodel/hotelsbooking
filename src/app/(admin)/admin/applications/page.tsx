import { Header } from "@/components/layout/header"
import { prisma } from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ApplicationsList } from "@/components/admin/applications-list"

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
    const applications = await prisma.hotelApplication.findMany({
        orderBy: { created_at: 'desc' }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl pt-32">
                <div className="mb-12 animate-fade-in text-center">
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col items-center">
                        <span className="section-title block mb-2">Review Management</span>
                        <h1 className="text-4xl font-bold tracking-tight">Partner Applications</h1>
                        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                            Manage and review applications from potential hotel partners.
                        </p>
                    </div>
                </div>

                <div className="animate-fade-in-up stagger-1">
                    <ApplicationsList applications={applications} />
                </div>
            </main>
        </div>
    )
}
