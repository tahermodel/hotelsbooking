"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cancelBooking } from "@/actions/bookings"
import { Loader2, AlertTriangle } from "lucide-react"

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCancel() {
        setLoading(true)
        try {
            await cancelBooking(bookingId, "Customer request")
            router.refresh()
            setIsConfirming(false)
        } catch (error) {
            console.error("Failed to cancel:", error)
            alert("Failed to cancel booking. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (isConfirming) {
        return (
            <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px] p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Are you sure?</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                        onClick={() => setIsConfirming(false)}
                        className="flex-1 rounded-xl text-white/40 hover:text-white hover:bg-white/10 font-bold h-10"
                    >
                        No
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={loading}
                        onClick={handleCancel}
                        className="flex-1 rounded-xl font-bold h-10 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Cancel"}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfirming(true)}
            className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500 w-full md:w-auto md:min-w-[140px] rounded-xl font-bold h-11 transition-all"
        >
            Cancel Booking
        </Button>
    )
}
