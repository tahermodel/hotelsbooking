import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Building2, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const session = await auth()
    // In a real app, check for 'platform_admin' role
    if (!session?.user?.id || session.user.role !== 'platform_admin') redirect("/login")

    const hotelCount = await prisma.hotel.count()
    const userCount = await prisma.user.count()
    const pendingApps = await prisma.hotelApplication.count({
        where: { status: 'pending' }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">Platform Administration</h1>

                <div className="grid gap-6 md:grid-cols-3 mb-12">
                    <div className="p-8 rounded-2xl glass-surface border-white/20 shadow-xl group hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl glass bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Building2 className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Total Hotels</p>
                                <p className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">{hotelCount || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 rounded-2xl glass-surface border-white/20 shadow-xl group hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl glass bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Total Users</p>
                                <p className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">{userCount || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 rounded-2xl glass-surface border-white/20 shadow-xl group hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl glass bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Pending Apps</p>
                                <p className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">{pendingApps || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <section className="p-8 rounded-2xl glass-surface border-white/20 shadow-xl">
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            Quick Actions
                        </h2>
                        <div className="grid gap-3">
                            <Link href="/admin/applications">
                                <Button variant="outline" className="w-full justify-start glass bg-white/5 hover:bg-white/10 border-white/10 h-12 rounded-xl liquid-flicker">Review Hotel Applications</Button>
                            </Link>
                            <Link href="/admin/hotels">
                                <Button variant="outline" className="w-full justify-start glass bg-white/5 hover:bg-white/10 border-white/10 h-12 rounded-xl liquid-flicker">Manage All Hotels</Button>
                            </Link>
                            <Link href="/admin/users">
                                <Button variant="outline" className="w-full justify-start glass bg-white/5 hover:bg-white/10 border-white/10 h-12 rounded-xl liquid-flicker">Manage Platform Users</Button>
                            </Link>
                        </div>
                    </section>

                    <section className="p-8 rounded-2xl glass-surface border-white/20 border-dashed shadow-xl flex flex-col items-center justify-center text-center opacity-80">
                        <div className="w-16 h-16 rounded-full glass bg-white/5 flex items-center justify-center mb-4">
                            <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-xl font-black mb-2 italic">Platform Insights</h2>
                        <p className="text-sm text-muted-foreground max-w-xs lowercase">In-depth analytics and revenue reports will be generated as booking data accumulates.</p>
                    </section>
                </div>
            </main>
        </div>
    )
}
