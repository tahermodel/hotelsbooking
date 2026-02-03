import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, LogOut, LayoutDashboard } from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { AccountSettingsForm } from "@/components/forms/account-settings-form"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) redirect("/login")

    const isAdmin = user.role === "platform_admin"
    const isHotelAdmin = user.role === "hotel_admin"
    const isCustomer = user.role === "customer"

    const dashboardLink = isAdmin ? "/admin/dashboard" : isHotelAdmin ? "/partner" : "/account/bookings"
    const dashboardLabel = isCustomer ? "My Bookings" : isHotelAdmin ? "Hotel Dashboard" : "Admin Dashboard"
    const DashboardIcon = isCustomer ? BookOpen : LayoutDashboard

    return (
        <div className="flex min-h-screen flex-col relative">
            <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
                }}
            >
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container py-12 max-w-2xl pt-24 px-4 sm:px-6 mx-auto">
                    <div className="animate-fade-in mb-8">
                        <span className="text-white/60 text-sm font-extrabold tracking-widest uppercase mb-2 block">Account</span>
                        <h1 className="text-4xl font-bold text-white tracking-tight">My Profile</h1>
                    </div>

                    <div className="space-y-6">
                        <section className="glass-liquid p-8 animate-fade-in-up stagger-1 rounded-3xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-black">{user.name || "User"}</h2>
                                    <p className="text-black/60 font-medium">{user.email}</p>
                                    <div className="flex gap-2 mt-4">
                                        <span className="px-3 py-1 bg-black/10 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                                            {user.role.replace('_', ' ')}
                                        </span>
                                        {user.is_verified && (
                                            <span className="px-3 py-1 bg-white/40 text-black text-xs font-bold rounded-full border border-black/10">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link href={dashboardLink} className="w-full sm:w-auto">
                                    <button className="flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-2xl font-bold hover:bg-black/90 transition-all w-full shadow-xl shadow-black/10 active:scale-95">
                                        <DashboardIcon className="w-5 h-5" />
                                        {dashboardLabel}
                                    </button>
                                </Link>
                            </div>
                        </section>

                        <div className="animate-fade-in-up stagger-2">
                            <AccountSettingsForm
                                user={{
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone
                                }}
                            />
                        </div>

                        <section className="animate-fade-in-up stagger-4">
                            <div className="glass-liquid p-6 rounded-3xl">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                            <LogOut className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-black">Sign Out</h3>
                                            <p className="text-sm text-black/60">Log out from your account</p>
                                        </div>
                                    </div>
                                    <SignOutButton
                                        variant="outline"
                                        size="sm"
                                        className="text-black border-black/20 hover:bg-black hover:text-white hover:border-black w-full sm:w-auto rounded-xl font-bold h-11"
                                    >
                                        Sign Out
                                    </SignOutButton>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}
