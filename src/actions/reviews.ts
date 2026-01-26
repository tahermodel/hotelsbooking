"use server"

import { createClient } from "@/lib/supabase/server"
import { auth } from "@/lib/auth"

export async function submitReview(data: {
    bookingId: string
    hotelId: string
    rating: number
    title: string
    content: string
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const supabase = await createClient()
    const { error } = await supabase.from('reviews').insert({
        ...data,
        user_id: session.user.id
    })
    if (error) throw new Error(error.message)
}

export async function getHotelReviews(hotelId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .eq('hotel_id', hotelId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}
