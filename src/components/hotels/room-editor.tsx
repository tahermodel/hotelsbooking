"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, Plus, Image as ImageIcon, Trash2, UploadCloud, ArrowLeft, Calendar as CalendarIcon } from "lucide-react"
import { createRoom, updateRoom, deleteRoom } from "@/app/actions/room"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

interface RoomEditorProps {
    room?: any
    hotelId?: string
}

export function RoomEditor({ room, hotelId }: RoomEditorProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
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
        main_image: room.main_image || "",
        base_price: room.base_price || 0,
        available_from: room.available_from ? new Date(room.available_from).toISOString() : "",
        available_until: room.available_until ? new Date(room.available_until).toISOString() : "",
        blocked_dates: (room.availability || [])
            .filter((a: any) => !a.is_available)
            .map((a: any) => new Date(a.date).toISOString()),
    } : {
        name: "",
        description: "",
        max_guests: 2,
        bed_configuration: "",
        size_sqm: 0,
        amenities: [],
        images: [],
        main_image: "",
        base_price: 0,
        available_from: "",
        available_until: "",
        blocked_dates: [],
    }

    const [formData, setFormData] = useState(initialData)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: formData.available_from ? new Date(formData.available_from) : undefined,
        to: formData.available_until ? new Date(formData.available_until) : undefined
    })
    const [blockedDates, setBlockedDates] = useState<Date[]>(
        formData.blocked_dates.map((d: string) => new Date(d))
    )
    const [amenityInput, setAmenityInput] = useState("")
    const [imageInput, setImageInput] = useState("")
    const [mainImageInput, setMainImageInput] = useState("")

    const isDirty = isEditing && (
        formData.name !== (room.name || "") ||
        formData.description !== (room.description || "") ||
        formData.max_guests !== (room.max_guests || 2) ||
        formData.bed_configuration !== (room.bed_configuration || "") ||
        formData.size_sqm !== (room.size_sqm || 0) ||
        formData.base_price !== (room.base_price || 0) ||
        formData.available_from !== (room.available_from ? new Date(room.available_from).toISOString() : "") ||
        formData.available_until !== (room.available_until ? new Date(room.available_until).toISOString() : "") ||
        JSON.stringify(formData.blocked_dates.slice().sort()) !== JSON.stringify(((room.availability || []).filter((a: any) => !a.is_available).map((a: any) => new Date(a.date).toISOString())).slice().sort()) ||
        JSON.stringify(formData.amenities) !== JSON.stringify(room.amenities || []) ||
        JSON.stringify(formData.images) !== JSON.stringify(room.images || []) ||
        formData.main_image !== (room.main_image || "")
    )

    const canSubmit = !loading && (!isEditing || isDirty) && formData.name.length > 0;

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!hotelId && !room.hotel_id) return
        setLoading(true)
        try {
            if (isEditing) {
                await updateRoom(room.id, formData)
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setFormData(prev => ({ ...prev, images: [...prev.images, base64String] }))
            }
            reader.readAsDataURL(file)
        })
    }

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            handleChange("main_image", base64String)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col items-center text-center gap-4 border-b border-black/5 pb-8">
                <div className="flex items-center gap-4 w-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/partner/dashboard/rooms')}
                        className="rounded-full h-12 w-12 hover:bg-black/10 border border-black/5 transition-all active:scale-90 bg-white/50 backdrop-blur-sm shadow-sm text-black shrink-0"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1 pr-12">
                        <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Room" : "Add New Room"}</h1>
                        <p className="text-muted-foreground/80 font-medium">{isEditing ? room.name : "Create a new room type"}</p>
                    </div>
                    {isEditing && (
                        <div className="shrink-0">
                            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading} className="text-destructive hover:bg-destructive/10 rounded-full h-10 w-10">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
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
                            <Input
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
                    <h3 className="section-title text-lg border-b border-border pb-2">Availability & Blocks</h3>
                    <p className="text-sm text-muted-foreground italic">Set the general available range first, then click on specific days within that range to block them.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-4">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-primary" />
                                Availability Range
                            </label>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-12 rounded-xl border-border/50",
                                            !dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {dateRange?.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                                    {format(dateRange.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            setDateRange(range);
                                            handleChange("available_from", range?.from?.toISOString() || "");
                                            handleChange("available_until", range?.to?.toISOString() || "");
                                            // Reset blocked dates that fall outside new range
                                            if (range?.from) {
                                                const newBlocked = blockedDates.filter((d: Date) => {
                                                    if (range.to) return d >= range.from! && d <= range.to;
                                                    return d >= range.from!;
                                                });
                                                setBlockedDates(newBlocked);
                                                handleChange("blocked_dates", newBlocked.map(d => d.toISOString()));
                                            }
                                        }}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">The range your room is generally open</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <X className="w-4 h-4 text-destructive" />
                                Highlight Unavailable Days
                            </label>
                            <div className="border border-border/50 rounded-2xl p-4 bg-muted/30">
                                <Calendar
                                    mode="multiple"
                                    selected={blockedDates}
                                    onSelect={(dates) => {
                                        const newDates = dates || [];
                                        setBlockedDates(newDates);
                                        handleChange("blocked_dates", newDates.map(d => d.toISOString()));
                                    }}
                                    disabled={(date) => {
                                        if (!dateRange?.from) return true;
                                        if (dateRange.to && (date < dateRange.from || date > dateRange.to)) return true;
                                        if (!dateRange.to && date < dateRange.from) return true;
                                        return false;
                                    }}
                                    className="p-0 border-0 shadow-none bg-transparent"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Days within the range where the room is blocked</p>
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
                            <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground border border-border/50">
                                {item}
                                <button onClick={() => handleChange("amenities", formData.amenities.filter((_: any, i: number) => i !== idx))} className="ml-2 hover:text-destructive transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Main Image</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Input
                                value={mainImageInput}
                                onChange={(e) => setMainImageInput(e.target.value)}
                                placeholder="Paste Main Image URL..."
                                className="flex-1"
                            />
                            <Button type="button" onClick={() => {
                                if (mainImageInput) {
                                    handleChange("main_image", mainImageInput);
                                    setMainImageInput("");
                                }
                            }}><Plus className="w-4 h-4 mr-2" /> Set URL</Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or upload main image</span>
                            </div>
                        </div>

                        <input
                            type="file"
                            onChange={handleMainImageUpload}
                            className="hidden"
                            id="room-main-image-upload"
                            accept="image/*"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed border-2 py-8 h-auto flex-col gap-2"
                            onClick={() => document.getElementById('room-main-image-upload')?.click()}
                        >
                            <UploadCloud className="w-8 h-8 text-muted-foreground" />
                            <span>Click to upload main image</span>
                        </Button>

                        {formData.main_image && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-border mt-4 group">
                                <Image src={formData.main_image} alt="Main" fill className="object-cover" />
                                <button
                                    onClick={() => handleChange("main_image", "")}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card-section p-6 space-y-6">
                    <h3 className="section-title text-lg border-b border-border pb-2">Gallery Images</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                            <Input
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                placeholder="Paste Image URL..."
                                className="flex-1"
                            />
                            <Button type="button" onClick={() => {
                                if (imageInput) {
                                    handleChange("images", [...formData.images, imageInput]);
                                    setImageInput("");
                                }
                            }}><Plus className="w-4 h-4 mr-2" /> Add to Gallery</Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or upload to gallery</span>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed border-2 py-8 h-auto flex-col gap-2"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadCloud className="w-8 h-8 text-muted-foreground" />
                            <span>Click to upload gallery images</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                        {formData.images.map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-border shadow-sm">
                                <Image src={img} alt="Gallery" fill className="object-cover transition-transform group-hover:scale-105" />
                                <button
                                    onClick={() => handleChange("images", formData.images.filter((_: any, i: number) => i !== idx))}
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions - Styled exactly like Hotel Publish */}
            <div className="sticky bottom-8 z-50 flex justify-center mt-12 px-4 pointer-events-none">
                <button
                    disabled={!canSubmit}
                    onClick={() => { if (canSubmit) handleSave() }}
                    className="pointer-events-auto group"
                >
                    <LiquidGlass
                        animate={!loading && canSubmit}
                        className={cn(
                            "flex h-16 items-center gap-4 px-12 rounded-full shadow-2xl transition-all duration-300",
                            "border-white/60 bg-white/20 backdrop-blur-md",
                            canSubmit ? "hover:bg-white/30 cursor-pointer" : "opacity-50 cursor-not-allowed grayscale-[0.5]"
                        )}
                    >
                        <div className="flex items-center justify-center gap-3 text-primary font-bold tracking-wide min-w-[160px]">
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            ) : (
                                <>
                                    {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    <span className="text-lg">
                                        {isEditing ? "Save Changes" : "Create Room"}
                                    </span>
                                </>
                            )}
                        </div>
                    </LiquidGlass>
                </button>
            </div>
        </div>
    )
}
