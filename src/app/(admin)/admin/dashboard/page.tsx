import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Building2, FileText, BarChart3, ChevronRight, Settings, Shield } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'platform_admin') redirect("/login")

    const hotelCount = await prisma.hotel.count()
    const userCount = await prisma.user.count()
    const pendingApps = await prisma.hotelApplication.count({
        where: { status: 'pending' }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl pt-32 flex flex-col items-center">
                <div className="w-full mb-12 animate-fade-in text-center">
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg">
                            <Shield className="w-6 h-6 text-accent-foreground" />
                        </div>
                        <span className="section-title mb-0">Admin Panel</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Platform Administration</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Essential overview and management tools</p>
                </div>

                <div className="w-full grid gap-8">
                    <section className="animate-fade-in-up stagger-1">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="stat-card">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Hotels</p>
                                        <p className="text-3xl font-black">{hotelCount || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Total Users</p>
                                        <p className="text-3xl font-black">{userCount || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Pending Applications</p>
                                        <p className="text-3xl font-black">{pendingApps || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="animate-fade-in-up stagger-2 max-w-sm mx-auto w-full">
                        <Link href="/admin/applications" className="group">
                            <div className="card-section p-6 flex flex-col items-center text-center gap-4 hover:border-primary transition-all duration-300 hover:shadow-xl group-hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                    <FileText className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Review Applications</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Approve or reject new hotel partner requests</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                                    Launch Module <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    )
}
