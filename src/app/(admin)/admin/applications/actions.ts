"use server"

import { auth } from "@/lib/auth"
import { prisma, privilegedPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { HotelApplicationStatus } from "@prisma/client"

export async function updateApplicationStatus(id: string, status: HotelApplicationStatus) {
    const session = await auth()
    if (session?.user?.role !== 'platform_admin') {
        throw new Error("Unauthorized")
    }

    if (status === 'approved') {
        const application = await prisma.hotelApplication.findUnique({
            where: { id }
        })

        if (!application) throw new Error("Application not found")

        const slug = application.hotel_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7)

        // Use privilegedPrisma to bypass the security restriction on role updates
        await privilegedPrisma.$transaction([
            privilegedPrisma.user.update({
                where: { id: application.user_id },
                data: { role: 'hotel_admin' }
            }),
            privilegedPrisma.hotel.create({
                data: {
                    owner_id: application.user_id,
                    name: application.hotel_name,
                    slug,
                    description: application.description,
                    address: application.hotel_address,
                    contact_email: application.applicant_email,
                    contact_phone: application.contact_phone,
                    // Defaults for required fields
                    city: "Update City",
                    country: "Update Country",
                    star_rating: 0,
                    check_in_time: "15:00",
                    check_out_time: "11:00",
                    is_active: false // Require admin to activate after filling details
                }
            }),
            privilegedPrisma.hotelApplication.update({
                where: { id },
                data: { status }
            })
        ])
    } else {
        await prisma.hotelApplication.update({
            where: { id },
            data: { status }
        })
    }

    revalidatePath("/admin/applications")
}
