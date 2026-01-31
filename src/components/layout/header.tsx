import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { cn } from "@/lib/utils"

export async function Header() {
    const session = await auth()

    const navBtnClass = "liquid-flicker shadow-2xl rounded-full px-4 md:px-6 h-9 bg-primary hover:bg-primary/90 text-white font-black border-none text-[10px] md:text-[11px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95 flex items-center justify-center min-w-[80px] md:min-w-[100px]"

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full py-2 px-2 sm:px-0 overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto">
                <LiquidGlass animate={false} className="flex h-16 items-center justify-between rounded-full border-white/20 px-3 md:px-6">
                    {/* Left Section */}
                    <div className="flex-1 flex items-center">
                        <nav className="flex items-center">
                            {!session && (
                                <Link href="/partner" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                    Partner
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Center Logo */}
                    <div className="flex items-center justify-center">
                        <Link href="/" className="flex items-center space-x-2 liquid-flicker">
                            <span className="text-xl md:text-2xl font-black tracking-tight text-primary">StayEase</span>
                        </Link>
                    </div>

                    {/* Right Navigation (Auth & Dashboards) */}
                    <div className="flex-1 flex items-center justify-end space-x-1 md:space-x-3">
                        {session ? (
                            <>
                                {session.user.role === "platform_admin" && (
                                    <Link href="/admin">
                                        <Button size="sm" className={cn(navBtnClass, "bg-accent hover:bg-accent/90")}>
                                            Admin
                                        </Button>
                                    </Link>
                                )}
                                {session.user.role === "hotel_admin" && (
                                    <Link href="/partner/dashboard">
                                        <Button size="sm" className={cn(navBtnClass, "bg-accent hover:bg-accent/90")}>
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                                <div className="hidden sm:block">
                                    <SignOutButton />
                                </div>
                                <Link href="/account">
                                    <Button size="sm" className={navBtnClass}>
                                        <span className="hidden xs:inline">Account</span>
                                        <span className="xs:hidden">Me</span>
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className={navBtnClass}>
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </LiquidGlass>
            </div>
        </header>
    )
}
