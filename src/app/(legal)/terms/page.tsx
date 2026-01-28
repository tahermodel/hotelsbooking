import { Header } from "@/components/layout/header"

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground">By accessing and using StayEase, you agree to be bound by these Terms of Service. Our platform acts as an intermediary agent connecting hotels with customers.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Booking and Reservations</h2>
                        <p className="text-muted-foreground">Reservations are confirmed only after successful payment authorization. Our pay-later system holds the funds on your card to guarantee the room for the hotel.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
                        <p className="text-muted-foreground">Users are responsible for providing accurate information during booking. Misuse of the platform, including frequent cancellations or no-shows, may lead to account restrictions.</p>
                    </section>
                </div>
            </main>
        </div>
    )
}
