"use client"

import { useState } from "react"
import { Star, MoreVertical, Edit2, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteReview } from "@/actions/reviews"
import { ReviewForm } from "./review-form"
import { motion, AnimatePresence } from "framer-motion"

export function UserReviewCard({
    review,
    bookingId,
    hotelId
}: {
    review: any
    bookingId: string
    hotelId: string
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your review?")) return

        setIsDeleting(true)
        try {
            await deleteReview(review.id)
            window.location.reload()
        } catch (err: any) {
            alert(err.message)
            setIsDeleting(false)
        }
    }

    if (isEditing) {
        return (
            <div className="relative p-10 rounded-[2.5rem] bg-accent/[0.03] border border-accent/20">
                <button
                    onClick={() => setIsEditing(false)}
                    className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-white/40" />
                </button>
                <div className="mb-8">
                    <p className="text-accent font-black uppercase tracking-widest text-[10px] mb-2">Edit Your Experience</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Refine your thoughts</h3>
                </div>
                <ReviewForm
                    bookingId={bookingId}
                    hotelId={hotelId}
                    existingReview={review}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        )
    }

    return (
        <div className="relative p-10 rounded-[2.5rem] bg-accent/[0.05] border border-accent/20 hover:bg-accent/[0.08] transition-all duration-500 shadow-xl shadow-accent/5">
            <div className="flex justify-between items-start mb-8">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-black border border-accent/30 uppercase">
                        {review.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-black uppercase text-xs tracking-widest">Your Review</p>
                            <div className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/30 text-[8px] font-black uppercase tracking-widest text-accent">Owner</div>
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">{new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? "text-accent fill-accent" : "text-white/10"}`}
                            />
                        ))}
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => {
                                                setIsEditing(true)
                                                setIsMenuOpen(false)
                                            }}
                                            className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Review
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete()
                                                setIsMenuOpen(false)
                                            }}
                                            disabled={isDeleting}
                                            className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {isDeleting ? "Deleting..." : "Delete Review"}
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <h4 className="text-2xl font-black mb-4 tracking-tight uppercase text-white">{review.title}</h4>
            <p className="text-white/70 leading-relaxed text-lg font-medium">{review.content}</p>
        </div>
    )
}
