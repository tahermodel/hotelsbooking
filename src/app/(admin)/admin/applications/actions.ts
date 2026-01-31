"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { HotelApplicationStatus } from "@prisma/client"

export async function updateApplicationStatus(id: string, status: HotelApplicationStatus) {
    await prisma.hotelApplication.update({
        where: { id },
        data: { status }
    })

    revalidatePath("/admin/applications")
}
