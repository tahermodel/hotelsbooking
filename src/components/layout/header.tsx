import Link from "next/link"
import { auth } from "@/lib/auth"
import { handleSignOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export async function Header() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full p-2">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LiquidGlass className="grid grid-cols-[1fr_auto_1fr] h-16 items-center rounded-full border-white/20 px-6">
                    {/* Left Navigation */}
                    <nav className="col-start-1 flex items-center space-x-4 md:space-x-6">
                        <Link href="/search" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                            Find Hotels
                        </Link>
                        <Link href="/partner" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                            Partner
                        </Link>
                    </nav>

                    {/* Centered Logo - kept truly centered regardless of side widths */}
                    <div className="col-start-2 justify-self-center px-4">
                        <Link href="/" className="flex items-center space-x-2 liquid-flicker">
                            <span className="text-xl md:text-2xl font-black tracking-tight text-primary">StayEase</span>
                        </Link>
                    </div>

                    {/* Right Navigation (Auth) */}
                    <div className="col-start-3 flex items-center justify-end space-x-3 md:space-x-4">
                        {session ? (
                            <>
                                <Link href="/account" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors hidden sm:block">
                                    Account
                                </Link>
                                <form action={handleSignOut}>
                                    <Button variant="ghost" size="sm" className="glass hover:bg-white/20 rounded-full font-bold text-xs md:text-sm">Sign Out</Button>
                                </form>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="liquid-flicker shadow-lg rounded-full px-6 md:px-8 bg-primary hover:bg-primary/90 text-white font-bold border-none text-xs md:text-sm">
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
