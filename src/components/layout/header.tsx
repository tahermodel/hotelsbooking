import Link from "next/link"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"

export async function Header() {
    const session = await auth()

    return (
        <header className="fixed top-0 inset-x-0 z-50 py-3 px-4 sm:px-6">
            <div className="w-full max-w-7xl mx-auto">
                <nav className="nav-glass flex h-14 items-center justify-between rounded-2xl px-4 sm:px-6">
                    <div className="flex-1 flex items-center">
                        {!session && (
                            <Link
                                href="/partner"
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                Partner
                            </Link>
                        )}
                    </div>

                    <Link href="/" className="flex items-center px-4">
                        <span className="text-xl font-bold text-foreground">
                            Stay<span className="text-primary">Ease</span>
                        </span>
                    </Link>

                    <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
                        {session ? (
                            <>
                                {session.user.role === "platform_admin" && (
                                    <Link href="/admin/dashboard">
                                        <Button
                                            size="sm"
                                            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                        >
                                            Admin
                                        </Button>
                                    </Link>
                                )}
                                {session.user.role === "hotel_admin" && (
                                    <Link href="/partner/dashboard">
                                        <Button
                                            size="sm"
                                            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
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
                </nav>
            </div>
        </header>
    )
}
