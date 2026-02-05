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
    existingReview,
    onCancel
}: {
    bookingId: string
    hotelId: string
    existingReview?: {
        rating: number
        title: string | null
        content: string | null
    } | null
    onCancel?: () => void
}) {
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [hoveredRating, setHoveredRating] = useState(0)
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
            window.location.reload()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Your Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent/10 group"
                        >
                            <Star
                                className={`w-6 h-6 transition-all duration-300 ${star <= (hoveredRating || rating)
                                        ? 'fill-accent text-accent scale-110'
                                        : 'text-white/20'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Headline</label>
                    <input
                        placeholder="Summarize your stay..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Your Story</label>
                    <textarea
                        placeholder="What made your stay special? Mention the service, amenities, or view..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all font-medium leading-relaxed resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    disabled={loading}
                    className="flex-1 h-14 bg-white text-black hover:bg-neutral-200 font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-white/5 transition-all active:scale-95"
                >
                    {loading ? "Publishing..." : existingReview ? "Update Experience" : "Post Experience"}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        className="h-14 px-8 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    )
}
