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
        <div className="flex min-h-screen flex-col bg-background-alt">
            <Header />
            <main className="flex-1 container py-12 max-w-2xl pt-24 px-4 sm:px-6">
                <div className="animate-fade-in mb-8">
                    <span className="section-title">Account</span>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                </div>

                <div className="space-y-6">
                    <section className="card-section p-6 animate-fade-in-up stagger-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{user.name || "User"}</h2>
                                <p className="text-muted-foreground">{user.email}</p>
                                <div className="flex gap-2 mt-3">
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase">
                                        {user.role}
                                    </span>
                                    {user.is_verified && (
                                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Link href={dashboardLink} className="w-full sm:w-auto">
                                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all w-full">
                                    <DashboardIcon className="w-5 h-5" />
                                    {dashboardLabel}
                                </button>
                            </Link>
                        </div>
                    </section>

                    <AccountSettingsForm
                        user={{
                            name: user.name,
                            email: user.email,
                            phone: user.phone
                        }}
                    />

                    <section className="animate-fade-in-up stagger-4">
                        <div className="card-section p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                                        <LogOut className="w-6 h-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Sign Out</h3>
                                        <p className="text-sm text-muted-foreground">Log out from your account</p>
                                    </div>
                                </div>
                                <SignOutButton
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white hover:border-destructive w-full sm:w-auto"
                                >
                                    Sign Out
                                </SignOutButton>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
