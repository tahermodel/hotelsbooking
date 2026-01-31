import { Header } from "@/components/layout/header"
import { PartnerApplyForm } from "@/components/forms/partner-apply-form"

export default function PartnerApplyPage() {
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
