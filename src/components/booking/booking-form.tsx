"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { lockRoom, releaseRoomLock } from "@/actions/availability"
import { createPaymentIntent } from "@/actions/payments"
import { createBooking } from "@/actions/bookings"
import { formatCurrency } from "@/lib/utils"

export function BookingForm({
    hotel,
    roomType,
    searchParams
}: {
    hotel: any,
    roomType: any,
    searchParams: any
}) {
    const { data: session } = useSession()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [locked, setLocked] = useState(false)
    const [clientSecret, setClientSecret] = useState("")

    const checkIn = searchParams.checkIn || new Date().toISOString().split('T')[0]
    const checkOut = searchParams.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0]
    const dates = [checkIn]

    useEffect(() => {
        if (session?.user?.id && !locked) {
            lockRoom(roomType.id, dates)
                .then((success) => {
                    if (success) setLocked(true)
                    else alert("Room is no longer available. Please choose another.")
                })
        }

        return () => {
            if (locked && session?.user?.id) {
                releaseRoomLock(roomType.id, dates)
            }
        }
    }, [session, roomType.id])

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) return router.push("/login")

        setLoading(true)
        try {
            // Create Payment Intent with Metadata for Stripe Dashboard
            const { clientSecret, id: paymentIntentId } = await createPaymentIntent(roomType.base_price, "usd", {
                hotelId: hotel.id,
                hotelName: hotel.name,
                roomId: roomType.id,
                roomName: roomType.name,
                guestEmail: session?.user?.email,
                checkIn,
                checkOut
            })

            // Attempt to create the booking
            const result = await createBooking({
                hotelId: hotel.id,
                roomId: roomType.id,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                guestsCount: 2,
                totalAmount: roomType.base_price,
                guestName: session?.user?.name || "Guest",
                guestEmail: session?.user?.email || "",
                paymentIntentId: paymentIntentId
            })

            if (result && result.success) {
                router.push(`/booking/confirmation?id=${result.bookingId}`)
            } else {
                throw new Error("Booking creation failed")
            }

        } catch (error: any) {
            console.error(error)
            alert(error.message || "Booking failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <div className="rounded-xl border p-6 space-y-6">
                    <h2 className="text-xl font-bold">Guest Details</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input className="w-full p-2 border rounded-md" defaultValue={session?.user?.name || ""} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input className="w-full p-2 border rounded-md" defaultValue={session?.user?.email || ""} />
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <div className="p-4 border-2 border-sky-500 rounded-lg bg-sky-500/5">
                            <p className="font-semibold">Pay Later</p>
                            <p className="text-sm text-muted-foreground">Your card will be authorized now, but you won&apos;t be charged until you arrive at the hotel.</p>
                        </div>
                    </div>

                    <Button
                        className="w-full lg:w-max"
                        size="lg"
                        onClick={handleBooking}
                        disabled={loading || !locked}
                    >
                        {loading ? "Processing..." : "Confirm Reservation"}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-xl border p-6 bg-card">
                    <h2 className="text-xl font-bold mb-4">Summary</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>{roomType.name} x 1 night</span>
                            <span>{formatCurrency(roomType.base_price)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>{formatCurrency(0)}</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(roomType.base_price)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
