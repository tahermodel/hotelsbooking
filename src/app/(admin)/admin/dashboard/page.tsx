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
            <main className="flex-1 container py-12 max-w-6xl pt-24">
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                            <Shield className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="section-title mb-0">Admin Panel</span>
                    </div>
                    <h1 className="text-3xl font-bold">Platform Administration</h1>
                    <p className="text-muted-foreground mt-1">Manage hotels, users, and applications</p>
                </div>

                <section className="mb-10">
                    <span className="section-title">Overview</span>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="stat-card animate-fade-in-up stagger-1">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Total Hotels</p>
                                    <p className="text-3xl font-bold">{hotelCount || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up stagger-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                                    <p className="text-3xl font-bold">{userCount || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card animate-fade-in-up stagger-3">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Pending Apps</p>
                                    <p className="text-3xl font-bold">{pendingApps || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="animate-fade-in-up stagger-4">
                        <span className="section-title">Quick Actions</span>
                        <div className="card-section divide-y divide-border">
                            <Link href="/admin/applications" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <FileText className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Review Applications</p>
                                        <p className="text-sm text-muted-foreground">Approve or reject hotel applications</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>

                            <Link href="/admin/hotels" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                        <Building2 className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Manage Hotels</p>
                                        <p className="text-sm text-muted-foreground">View and edit all properties</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                            </Link>

                            <Link href="/admin/users" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Users className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Manage Users</p>
                                        <p className="text-sm text-muted-foreground">View platform users</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>

                            <Link href="/admin/settings" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                                        <Settings className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Platform Settings</p>
                                        <p className="text-sm text-muted-foreground">Configure system options</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </section>

                    <section className="animate-fade-in-up stagger-5">
                        <span className="section-title">Analytics</span>
                        <div className="card-section p-8 flex flex-col items-center justify-center text-center h-[calc(100%-2rem)] min-h-[280px]">
                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                <BarChart3 className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Platform Insights</h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Analytics and revenue reports will appear here as booking data accumulates
                            </p>
                            <Button variant="outline" size="sm" className="mt-6" disabled>
                                Coming Soon
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
