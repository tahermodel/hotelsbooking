import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const hotelId = searchParams.get("hotelId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!hotelId || !startDate || !endDate) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from("room_availability")
        .select("*, rooms(*)")
        .eq("rooms.hotel_id", hotelId)
        .gte("date", startDate)
        .lte("date", endDate)
        .eq("is_available", true)
        .is("locked_until", null)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
}
