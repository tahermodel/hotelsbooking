import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { AnimatedScaleButton } from "@/components/layout/client-animation-wrapper"

export async function Header() {
    const session = await auth()

    return (
        <header className="fixed top-0 inset-x-0 z-50 py-4 px-4 sm:px-6 pointer-events-none">
            <div className="w-full max-w-5xl mx-auto pointer-events-auto">
                <LiquidGlass animate={false} className="flex h-14 items-center justify-between px-6 rounded-full shadow-lg">
                    <div className="relative z-10 flex-1 flex items-center gap-4">
                        {(!session || session.user.role === "customer") && (
                            <Link
                                href="/partner"
                                className="text-sm font-semibold text-white/90 hover:text-white transition-colors"
                            >
                                Become a Partner
                            </Link>
                        )}
                        {session?.user.role === "platform_admin" && (
                            <Link href="/admin/dashboard" className="hidden sm:block">
                                <AnimatedScaleButton
                                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border border-white/10"
                                >
                                    Admin
                                </AnimatedScaleButton>
                            </Link>
                        )}
                        {session?.user.role === "hotel_admin" && (
                            <Link href="/partner/dashboard" className="hidden sm:block">
                                <AnimatedScaleButton
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                                >
                                    Dashboard
                                </AnimatedScaleButton>
                            </Link>
                        )}
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center px-4">
                            <span className="text-xl font-bold text-foreground">
                                Stay<span className="text-primary">Ease</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 flex-1 flex items-center justify-end gap-2 sm:gap-3">
                        {session ? (
                            <>
                                <div className="hidden sm:block">
                                    <SignOutButton />
                                </div>
                                <Link href="/account">
                                    <Button size="sm">
                                        Account
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button size="sm">
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
