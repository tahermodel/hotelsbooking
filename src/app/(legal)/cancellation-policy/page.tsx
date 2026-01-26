import { Header } from "@/components/layout/header"

export default function CancellationPolicyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Cancellation Policy</h1>
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="p-6 border rounded-xl bg-green-50/50 dark:bg-green-950/20">
                            <h3 className="font-bold text-green-700 dark:text-green-400">7+ Days Before</h3>
                            <p className="text-2xl font-bold mt-2">100% Refund</p>
                            <p className="text-sm text-muted-foreground mt-1">Full refund of authorized amount.</p>
                        </div>
                        <div className="p-6 border rounded-xl bg-yellow-50/50 dark:bg-yellow-950/20">
                            <h3 className="font-bold text-yellow-700 dark:text-yellow-400">3-7 Days Before</h3>
                            <p className="text-2xl font-bold mt-2">75% Refund</p>
                            <p className="text-sm text-muted-foreground mt-1">25% penalty fee applies.</p>
                        </div>
                        <div className="p-6 border rounded-xl bg-red-50/50 dark:bg-red-950/20">
                            <h3 className="font-bold text-red-700 dark:text-red-400">1-3 Days Before</h3>
                            <p className="text-2xl font-bold mt-2">50% Refund</p>
                            <p className="text-sm text-muted-foreground mt-1">50% penalty fee applies.</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">No-Show & Late Cancellation</h2>
                        <p className="text-muted-foreground">Cancellations made less than 24 hours before check-in or failure to arrive (No-Show) will result in a 100% penalty of the authorized amount.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Abuse Prevention</h2>
                        <p className="text-muted-foreground">Accounts showing a pattern of excessive cancellations (e.g., more than 5 in 30 days) may be temporarily suspended from making new reservations.</p>
                    </section>
                </div>
            </main>
        </div>
    )
}
