"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { submitReview } from "@/actions/reviews"
import { useRouter } from "next/navigation"

export function ReviewForm({
    bookingId,
    hotelId,
    existingReview
}: {
    bookingId: string
    hotelId: string
    existingReview?: {
        rating: number
        title: string | null
        content: string | null
    } | null
}) {
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [title, setTitle] = useState(existingReview?.title || "")
    const [content, setContent] = useState(existingReview?.content || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) return alert("Please select a rating")

        setLoading(true)
        try {
            await submitReview({
                bookingId,
                hotelId,
                rating,
                title,
                content
            })
            alert(existingReview ? "Review updated!" : "Review submitted!")
            window.location.reload()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-card rounded-xl border">
            <h3 className="text-lg font-bold">{existingReview ? "Edit Your Review" : "Write a Review"}</h3>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                    >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                    </button>
                ))}
            </div>
            <Input
                placeholder="Review Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Input
                placeholder="Share your experience..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <Button disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    )
}
