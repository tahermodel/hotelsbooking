import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Settings, CreditCard, LogOut } from "lucide-react"

export default async function AccountPage() {
    const session = await auth()
    if (!session) redirect("/login")

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/account/bookings" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors group">
                        <BookOpen className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold">My Bookings</h3>
                        <p className="text-sm text-muted-foreground">View and manage your reservations</p>
                    </Link>

                    <Link href="/account/settings" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors group">
                        <Settings className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold">Settings</h3>
                        <p className="text-sm text-muted-foreground">Manage your personal information</p>
                    </Link>

                    <Link href="/account/payment" className="p-6 border rounded-xl hover:bg-muted/50 transition-colors group">
                        <CreditCard className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold">Payment Methods</h3>
                        <p className="text-sm text-muted-foreground">Saved cards and billing info</p>
                    </Link>

                    <button className="p-6 border rounded-xl hover:bg-destructive/5 text-left transition-colors group w-full">
                        <LogOut className="w-8 h-8 mb-4 text-destructive group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold">Sign Out</h3>
                        <p className="text-sm text-muted-foreground">Log out of your account</p>
                    </button>
                </div>
            </main>
        </div>
    )
}
