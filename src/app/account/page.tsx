import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, LogOut, LayoutDashboard } from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { AccountSettingsForm } from "@/components/forms/account-settings-form"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { motion, AnimatePresence } from "framer-motion"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

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
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat w-full h-[100dvh]"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="absolute inset-0 bg-black/15" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <motion.main
                    className="flex-1 container py-12 max-w-2xl pt-24 px-4 sm:px-6 mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div className="mb-8" variants={itemVariants}>
                        <span className="text-white/60 text-sm font-extrabold tracking-widest uppercase mb-2 block">Account</span>
                        <h1 className="text-4xl font-bold text-white tracking-tight">My Profile</h1>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div variants={itemVariants}>
                            <LiquidGlass className="p-8 rounded-3xl border-white/20 shadow-2xl">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{user.name || "User"}</h2>
                                        <p className="text-white/70 font-medium">{user.email}</p>
                                        <div className="flex gap-2 mt-4">
                                            <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/10">
                                                {user.role.replace('_', ' ')}
                                            </span>
                                            {user.is_verified && (
                                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full border border-white/20">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Link href={dashboardLink} className="w-full sm:w-auto">
                                        <motion.button
                                            className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black rounded-2xl font-bold hover:bg-white/90 transition-all w-full shadow-xl shadow-white/10 active:scale-95"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <DashboardIcon className="w-5 h-5" />
                                            {dashboardLabel}
                                        </motion.button>
                                    </Link>
                                </div>
                            </LiquidGlass>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <AccountSettingsForm
                                user={{
                                    name: user.name,
                                    email: user.email,
                                    phone: user.phone
                                }}
                            />
                        </motion.div>

                        <motion.section variants={itemVariants}>
                            <LiquidGlass className="p-6 rounded-3xl border-red-500/20 shadow-lg">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                            <LogOut className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Sign Out</h3>
                                            <p className="text-sm text-white/60">Log out from your account</p>
                                        </div>
                                    </div>
                                    <SignOutButton
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 w-full sm:w-auto rounded-xl font-bold h-11 transition-all"
                                    >
                                        Sign Out
                                    </SignOutButton>
                                </div>
                            </LiquidGlass>
                        </motion.section>
                    </div>
                </motion.main>
            </div>
        </div>
    )
}
