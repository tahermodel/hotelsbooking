import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { LiquidGlass } from "@/components/ui/liquid-glass"

export async function Header() {
    const session = await auth()

    return (
        <header className="fixed top-0 inset-x-0 z-50 py-3 px-4 sm:px-6">
            <div className="w-full max-w-7xl mx-auto">
                <LiquidGlass animate={false} className="flex h-14 items-center justify-between px-4 sm:px-6">
                    <div className="relative z-10 flex-1 flex items-center gap-2">
                        {!session && (
                            <Link
                                href="/partner"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                            >
                                Partner
                            </Link>
                        )}
                        {session?.user.role === "platform_admin" && (
                            <Link href="/admin/dashboard">
                                <Button
                                    size="sm"
                                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                >
                                    Admin
                                </Button>
                            </Link>
                        )}
                        {session?.user.role === "hotel_admin" && (
                            <Link href="/partner/dashboard">
                                <Button
                                    size="sm"
                                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                >
                                    Dashboard
                                </Button>
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
