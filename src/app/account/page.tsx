import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Settings, CreditCard, LogOut, User, ShieldCheck, Bell, HelpCircle } from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const user = session.user

    return (
        <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500/5 via-background to-background">
            <Header />
            <main className="flex-1 container py-12 max-w-6xl">
                {/* Profile Header */}
                <div className="mb-12 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 shadow-inner">
                        <User className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-black tracking-tight mb-1">{user?.name || "Guest User"}</h1>
                        <p className="text-muted-foreground font-medium">{user?.email}</p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">Verified Member</span>
                            <span className="px-3 py-1 bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">Joined Jan 2026</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/account/bookings" className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6 text-sky-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">My Bookings</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">View and manage your current and past reservations.</p>
                    </Link>

                    <Link href="/account/settings" className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Settings className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">Personal Info</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Update your name, email and security preferences.</p>
                    </Link>

                    <Link href="/account/payment" className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">Payment Methods</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Securely store and manage your billing information.</p>
                    </Link>

                    <Link href="/account/security" className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">Login & Security</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Manage your password and authentication methods.</p>
                    </Link>

                    <Link href="/account/notifications" className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group shadow-xl">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Bell className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">Notifications</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Choose how and when we send you updates.</p>
                    </Link>

                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-destructive/5 transition-all group shadow-xl cursor-default">
                        <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <LogOut className="w-6 h-6 text-destructive" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 italic">Session</h3>
                        <div className="flex flex-col items-start gap-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">End your current session securely.</p>
                            <SignOutButton
                                variant="outline"
                                size="sm"
                                className="mt-2 text-destructive border-destructive/20 hover:bg-destructive hover:text-white rounded-xl px-6 h-10 italic"
                            >
                                Confirm Logout
                            </SignOutButton>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/support" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                        <HelpCircle className="h-4 w-4" />
                        Need help with your account?
                    </Link>
                </div>
            </main>
        </div>
    )
}
