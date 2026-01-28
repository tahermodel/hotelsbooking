import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ id: string }> }) {
    const { id } = await searchParams
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Reservation Confirmed!</h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-md">
                    Your booking (Ref: {id}) is successfully confirmed. We've sent the details to your email.
                </p>
                <div className="flex gap-4">
                    <Link href="/account/bookings">
                        <Button size="lg">View My Bookings</Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" size="lg">Go Home</Button>
                    </Link>
                </div>
            </main>
        </div>
    )
}
