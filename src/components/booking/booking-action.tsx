"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { checkInGuest } from "@/actions/bookings"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingActionProps {
    bookingId: string
    paymentStatus: string
    bookingStatus: string
    paymentIntentId?: string | null
}

export function BookingAction({ bookingId, paymentStatus, bookingStatus, paymentIntentId }: BookingActionProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCheckIn = async () => {
        if (!paymentIntentId) return alert("No payment method on file")

        setLoading(true)
        try {
            const result = await checkInGuest(bookingId)
            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || "Failed to check in")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    if (bookingStatus === "cancelled") return null

    if (paymentStatus === "captured" || paymentStatus === "succeeded") {
        return (
            <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Paid</span>
            </div>
        )
    }

    if (paymentStatus === "authorized" || paymentStatus === "requires_capture") {
        return (
            <Button size="sm" onClick={handleCheckIn} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check In & Charge
            </Button>
        )
    }

    return <span className="text-muted-foreground text-sm">Pending Auth</span>
}
