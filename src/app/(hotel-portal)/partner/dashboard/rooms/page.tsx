import { Header } from "@/components/layout/header"
import { auth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function PartnerRoomsPage() {
    const session = await auth()
    if (!session) redirect("/login")

    const supabase = await createClient()
    const { data: hotels } = await supabase
        .from('hotels')
        .select('id')
        .eq('owner_id', session.user.id)

    const hotelIds = hotels?.map(h => h.id) || []

    const { data: rooms } = await supabase
        .from('room_types')
        .select('*, hotels(name)')
        .in('hotel_id', hotelIds)

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
                                <p className="text-sm text-muted-foreground">{room.hotels.name}</p>
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
