import { Header } from "@/components/layout/header"
import { PartnerApplyForm } from "@/components/forms/partner-apply-form"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function PartnerApplyPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/partner/apply")

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-24 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Partner Application</h1>
                <PartnerApplyForm />
            </main>
        </div>
    )
}
