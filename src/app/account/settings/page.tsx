import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AccountSettingsForm } from "@/components/forms/account-settings-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const userProfile = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-12 max-w-2xl pt-24">
                <div className="mb-8 animate-fade-in">
                    <Link
                        href="/account"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Account
                    </Link>
                    <span className="section-title block">Settings</span>
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                </div>

                <AccountSettingsForm
                    user={{
                        name: userProfile?.name || null,
                        email: userProfile?.email || null,
                        phone: userProfile?.phone || null
                    }}
                />
            </main>
        </div>
    )
}
