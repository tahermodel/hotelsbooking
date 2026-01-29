import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const userProfile = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

                <form className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                defaultValue={userProfile?.name || ""}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm opacity-50 cursor-not-allowed"
                                defaultValue={userProfile?.email || ""}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                defaultValue={userProfile?.phone || ""}
                            />
                        </div>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>

                <div className="mt-12 pt-8 border-t">
                    <h2 className="text-xl font-bold text-destructive mb-4">Danger Zone</h2>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </main>
        </div>
    )
}
