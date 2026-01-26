import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export async function Header() {
    const session = await auth()

    return (
        <header className="sticky top-0 z-50 w-full border-b glass-surface border-white/20">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 liquid-flicker">
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">StayEase</span>
                </Link>

                <nav className="flex items-center space-x-4">
                    <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                        Find Hotels
                    </Link>
                    <Link href="/partner" className="text-sm font-medium hover:text-primary transition-colors">
                        Partner with Us
                    </Link>
                    {session ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/account" className="text-sm font-medium hover:text-primary transition-colors">
                                My Account
                            </Link>
                            <form action={async () => {
                                "use server"
                                await signOut()
                            }}>
                                <Button variant="ghost" size="sm" className="glass hover:bg-white/20">Sign Out</Button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="liquid-flicker shadow-lg">Sign In</Button>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
