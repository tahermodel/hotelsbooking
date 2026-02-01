"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, Plus, Image as ImageIcon, Trash2 } from "lucide-react"
import { createRoom, updateRoom, deleteRoom } from "@/app/actions/room"

interface RoomEditorProps {
    room?: any
    hotelId?: string
}

export function RoomEditor({ room, hotelId }: RoomEditorProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const isEditing = !!room

    const initialData = room ? {
        name: room.name,
        description: room.description || "",
        max_guests: room.max_guests || 2,
        bed_configuration: room.bed_configuration || "",
        size_sqm: room.size_sqm || 0,
        amenities: room.amenities || [],
        images: room.images || [],
        base_price: room.base_price || 0,
    } : {
        name: "",
        description: "",
        max_guests: 2,
        bed_configuration: "",
        size_sqm: 0,
        amenities: [],
        images: [],
        base_price: 0,
    }

    const [formData, setFormData] = useState(initialData)
    const [amenityInput, setAmenityInput] = useState("")
    const [imageInput, setImageInput] = useState("")

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!hotelId && !room.hotel_id) return // Should not happen
        setLoading(true)
        try {
            if (isEditing) {
                await updateRoom(room.id, formData)
                // toast success
            } else {
                await createRoom({ ...formData, hotel_id: hotelId! })
                router.push('/partner/dashboard/rooms')
            }
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this room?")) return
        setLoading(true)
        try {
            await deleteRoom(room.id)
            router.push('/partner/dashboard/rooms')
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold">{isEditing ? "Edit Room" : "Add New Room"}</h1>
                    <p className="text-muted-foreground">{isEditing ? room.name : "Create a new room type"}</p>
                </div>
                <div className="flex gap-3">
                    {isEditing && (
                        <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEditing ? "Save Changes" : "Create Room"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Room Details</h3>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Room Name</label>
                            <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Deluxe Suite" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Describe the room..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Base Price ($)</label>
                                <Input type="number" min="0" value={formData.base_price} onChange={(e) => handleChange("base_price", parseFloat(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Max Guests</label>
                                <Input type="number" min="1" value={formData.max_guests} onChange={(e) => handleChange("max_guests", parseInt(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Bed Config</label>
                                <Input value={formData.bed_configuration} onChange={(e) => handleChange("bed_configuration", e.target.value)} placeholder="e.g. 1 King Bed" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Size (sqm)</label>
                                <Input type="number" min="0" value={formData.size_sqm} onChange={(e) => handleChange("size_sqm", parseFloat(e.target.value))} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Amenities</h3>
                    <div className="flex gap-2">
                        <Input
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            placeholder="Add amenity (e.g. Mini Bar, Ocean View)..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (amenityInput) {
                                        handleChange("amenities", [...formData.amenities, amenityInput]);
                                        setAmenityInput("");
                                    }
                                }
                            }}
                        />
                        <Button type="button" onClick={() => {
                            if (amenityInput) {
                                handleChange("amenities", [...formData.amenities, amenityInput]);
                                setAmenityInput("");
                            }
                        }}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((item: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-secondary/20">
                                {item}
                                <button onClick={() => handleChange("amenities", formData.amenities.filter((_: any, i: number) => i !== idx))} className="ml-2 hover:text-destructive">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Images</h3>
                    <div className="flex gap-2">
                        <Input
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            placeholder="Image URL..."
                        />
                        <Button type="button" onClick={() => {
                            if (imageInput) {
                                handleChange("images", [...formData.images, imageInput]);
                                setImageInput("");
                            }
                        }}><ImageIcon className="w-4 h-4" /></Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {formData.images.map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-border">
                                <img src={img} alt="Room" className="object-cover w-full h-full" />
                                <button
                                    onClick={() => handleChange("images", formData.images.filter((_: any, i: number) => i !== idx))}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
