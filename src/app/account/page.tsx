import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Settings, CreditCard, LogOut, User, ShieldCheck, Bell, HelpCircle, ChevronRight } from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const user = session.user

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-12 max-w-5xl pt-24">
                <div className="animate-fade-in">
                    <span className="section-title">Account</span>
                    <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                </div>

                <section className="card-section p-6 mb-8 animate-fade-in-up stagger-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{user?.name || "Guest User"}</h2>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    Verified Member
                                </span>
                                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                                    Joined Jan 2026
                                </span>
                            </div>
                        </div>
                        <Link href="/account/settings" className="hidden sm:flex">
                            <button className="icon-btn">
                                <Settings className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </section>

                <section className="mb-8 animate-fade-in-up stagger-2">
                    <span className="section-title">Quick Actions</span>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Link href="/account/bookings" className="card-section card-section-hover p-5 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <BookOpen className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">My Bookings</h3>
                                    <p className="text-sm text-muted-foreground">View and manage reservations</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <Link href="/account/settings" className="card-section card-section-hover p-5 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <Settings className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">Personal Info</h3>
                                    <p className="text-sm text-muted-foreground">Update your details</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <Link href="/account/payment" className="card-section card-section-hover p-5 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <CreditCard className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">Payment Methods</h3>
                                    <p className="text-sm text-muted-foreground">Manage billing info</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="mb-8 animate-fade-in-up stagger-3">
                    <span className="section-title">Security & Preferences</span>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Link href="/account/security" className="card-section card-section-hover p-5 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <ShieldCheck className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">Login & Security</h3>
                                    <p className="text-sm text-muted-foreground">Password and authentication</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>

                        <Link href="/account/notifications" className="card-section card-section-hover p-5 group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Bell className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">Notifications</h3>
                                    <p className="text-sm text-muted-foreground">Email and push preferences</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="animate-fade-in-up stagger-4">
                    <span className="section-title">Session</span>
                    <div className="card-section p-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                                    <LogOut className="w-6 h-6 text-destructive" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">End Session</h3>
                                    <p className="text-sm text-muted-foreground">Sign out from this device</p>
                                </div>
                            </div>
                            <SignOutButton
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive/30 hover:bg-destructive hover:text-white hover:border-destructive"
                            >
                                Sign Out
                            </SignOutButton>
                        </div>
                    </div>
                </section>

                <div className="mt-10 flex justify-center animate-fade-in-up stagger-5">
                    <Link href="/support" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <HelpCircle className="w-4 h-4" />
                        Need help with your account?
                    </Link>
                </div>
            </main>
        </div>
    )
}
