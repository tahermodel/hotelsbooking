import { Header } from "@/components/layout/header"

export default function PartnerAgreementPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Hotel Partner Agreement</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Scope of Agreement</h2>
                        <p className="text-muted-foreground">This agreement governs the relationship between StayEase and hotel partners listing their properties on our platform.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Commission and Fees</h2>
                        <p className="text-muted-foreground">StayEase charges a standard commission of 15% on the total booking value for every completed reservation facilitated by the platform.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Partner Obligations</h2>
                        <p className="text-muted-foreground">Partners must maintain accurate room availability, pricing, and descriptions. Reservations made through StayEase must be honored.</p>
                    </section>
                </div>
            </main>
        </div>
    )
}
