import { Header } from "@/components/layout/header"
import { PartnerApplyForm } from "@/components/forms/partner-apply-form"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function PartnerApplyPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/partner/apply")

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <main className="flex-1 container mx-auto py-16 max-w-4xl px-6 lg:px-0">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Partner Application</h1>
                    <p className="text-muted-foreground">Join our network of premium hotels.</p>
                </div>


                <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
                    <PartnerApplyForm />
                </div>

            </main>
        </div>
    )
}
