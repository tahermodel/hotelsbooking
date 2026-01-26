"use server"

import { createClient } from "@/lib/supabase/server"
import { auth } from "@/lib/auth"
import { addMinutes } from "date-fns"

export async function lockRoom(roomId: string, dates: string[]) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const supabase = await createClient()
    const lockExpiresAt = addMinutes(new Date(), 10).toISOString()

    const { data, error } = await supabase.rpc('acquire_room_lock', {
        p_room_id: roomId,
        p_dates: dates,
        p_user_id: session.user.id,
        p_expires_at: lockExpiresAt
    })

    if (error) throw new Error(error.message)
    return data
}

export async function releaseRoomLock(roomId: string, dates: string[]) {
    const session = await auth()
    if (!session?.user?.id) return

    const supabase = await createClient()

    const { error } = await supabase
        .from('room_availability')
        .update({ locked_until: null, locked_by: null })
        .match({ room_id: roomId, locked_by: session.user.id })
        .in('date', dates)

    if (error) throw new Error(error.message)
}
