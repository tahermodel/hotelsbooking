"use server"

import { createClient } from "@/lib/supabase/server"

export async function getHotels(searchTerm?: string) {
    const supabase = await createClient()
    let query = supabase.from('hotels').select('*').eq('is_active', true)

    if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
}

export async function getHotelBySlug(slug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('hotels')
        .select('*, room_types(*)')
        .eq('slug', slug)
        .single()

    if (error) return null
    return data
}

export async function createHotel(data: any) {
    const supabase = await createClient()
    const { data: hotel, error } = await supabase.from('hotels').insert(data).select().single()
    if (error) throw new Error(error.message)
    return hotel
}
