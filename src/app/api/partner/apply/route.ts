import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { applicant_email, hotel_name, hotel_address, contact_person, contact_phone } = await req.json()

    const application = await prisma.hotelApplication.create({
        data: {
            applicant_email,
            hotel_name,
            hotel_address,
            contact_person,
            contact_phone,
            status: "pending"
        }
    })

    return NextResponse.json(application)
}

