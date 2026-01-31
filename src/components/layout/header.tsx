import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { SignOutButton } from "@/components/auth/sign-out-button"

export async function Header() {
    const session = await auth()

    const navBtnClass = "liquid-flicker shadow-2xl rounded-full px-4 py-0 md:px-6 md:py-0 h-9 bg-primary hover:bg-primary/90 text-white font-black border-none text-[10px] md:text-[11px] tracking-widest uppercase transition-all hover:scale-105 active:scale-95 flex items-center justify-center min-w-[80px] md:min-w-[100px]"

    return (
        <header className="sticky top-0 z-50 w-full p-2">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LiquidGlass animate={false} className="grid grid-cols-[1fr_auto_1fr] h-16 items-center rounded-full border-white/20 px-6">
                    {/* Left Navigation */}
                    <nav className="col-start-1 flex items-center space-x-4 md:space-x-6">
                        {!session && (
                            <Link href="/partner" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                Partner
                            </Link>
                        )}
                    </nav>

                    {/* Centered Logo */}
                    <div className="col-start-2 justify-self-center px-4">
                        <Link href="/" className="flex items-center space-x-2 liquid-flicker">
                            <span className="text-xl md:text-2xl font-black tracking-tight text-primary">StayEase</span>
                        </Link>
                    </div>

                    {/* Right Navigation (Auth) */}
                    <div className="col-start-3 flex items-center justify-end space-x-2 md:space-x-4 h-full">
                        {session ? (
                            <>
                                <SignOutButton />
                                <Link href="/account" className="flex items-center h-full">
                                    <Button size="sm" className={navBtnClass}>
                                        Account
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center h-full">
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
