import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { applicant_email, hotel_name, hotel_address, contact_person, contact_phone, property_description } = await req.json()

    try {
        const application = await prisma.hotelApplication.create({
            data: {
                user_id: session.user.id,
                applicant_email,
                hotel_name,
                hotel_address,
                contact_person,
                contact_phone,
                description: property_description,
                status: "pending"
            }
        })

        return NextResponse.json(application)
    } catch (error) {
        console.error("Error creating application:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

