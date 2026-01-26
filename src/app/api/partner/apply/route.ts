import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { applicant_email, hotel_name, hotel_address, contact_person, contact_phone } = await req.json()

    const supabase = await createClient()

    const { data, error } = await supabase
        .from("hotel_applications")
        .insert({
            applicant_email,
            hotel_name,
            hotel_address,
            contact_person,
            contact_phone,
            status: "pending"
        })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
}
