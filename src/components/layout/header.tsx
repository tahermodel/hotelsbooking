import Link from "next/link"
import { auth } from "@/lib/auth"
import { handleSignOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export async function Header() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full p-2">
            <LiquidGlass className="container flex h-16 items-center rounded-full border-white/20 px-8">
                {/* Left Navigation */}
                <nav className="flex-1 flex items-center space-x-6">
                    <Link href="/search" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                        Find Hotels
                    </Link>
                    <Link href="/partner" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                        Partner with Us
                    </Link>
                </nav>

                {/* Centered Logo */}
                <div className="flex-initial px-4">
                    <Link href="/" className="flex items-center space-x-2 liquid-flicker">
                        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">StayEase</span>
                    </Link>
                </div>

                {/* Right Navigation (Auth) */}
                <div className="flex-1 flex items-center justify-end space-x-4">
                    {session ? (
                        <>
                            <Link href="/account" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                                My Account
                            </Link>
                            <form action={handleSignOut}>
                                <Button variant="ghost" size="sm" className="glass hover:bg-white/20 rounded-full font-bold">Sign Out</Button>
                            </form>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="liquid-flicker shadow-lg rounded-full px-8 bg-sky-500 hover:bg-sky-600 text-white font-bold border-none">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </LiquidGlass>
        </header>
    )
}
