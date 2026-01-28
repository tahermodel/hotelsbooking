import Link from "next/link"
import { auth } from "@/lib/auth"
import { handleSignOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export async function Header() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full p-2">
            <LiquidGlass className="container flex h-16 items-center justify-between rounded-full border-white/20 px-8">
                <Link href="/" className="flex items-center space-x-2 liquid-flicker">
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">StayEase</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link href="/search" className="text-sm font-medium hover:text-teal-600 transition-colors">
                        Find Hotels
                    </Link>
                    <Link href="/partner" className="text-sm font-medium hover:text-teal-600 transition-colors">
                        Partner with Us
                    </Link>
                    {session ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/account" className="text-sm font-medium hover:text-teal-600 transition-colors">
                                My Account
                            </Link>
                            <form action={handleSignOut}>
                                <Button variant="ghost" size="sm" className="glass hover:bg-white/20 rounded-full">Sign Out</Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="liquid-flicker shadow-lg rounded-full px-6">Sign In</Button>
                        </Link>
                    )}
                </nav>
            </LiquidGlass>
        </header>
    )
}
