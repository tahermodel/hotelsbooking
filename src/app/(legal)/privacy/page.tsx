import { Header } from "@/components/layout/header"

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
                        <p className="text-muted-foreground">We collect information necessary to facilitate your hotel bookings, including contact details and payment information via Stripe.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Data Usage</h2>
                        <p className="text-muted-foreground">Your data is shared with the specific hotels you book with. We do not sell your personal data to third parties.</p>
                    </section>
                </div>
            </main>
        </div>
    )
}
