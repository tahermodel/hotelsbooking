import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function PartnerRoomsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const rooms = await prisma.roomType.findMany({
        where: {
            hotel: {
                owner_id: session.user.id
            }
        },
        include: {
            hotel: {
                select: { name: true }
            }
        }
    })

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-12">
                <h1 className="text-3xl font-bold mb-8">Manage Rooms</h1>
                <div className="grid gap-6">
                    {rooms?.map(room => (
                        <div key={room.id} className="p-6 border rounded-xl flex justify-between items-center bg-card">
                            <div>
                                <h3 className="font-bold text-lg">{room.name}</h3>
                                <p className="text-sm text-muted-foreground">{room.hotel.name}</p>
                                <p className="text-sm mt-1">${room.base_price} / night</p>
                            </div>
                            <Button variant="outline">Edit Details</Button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
