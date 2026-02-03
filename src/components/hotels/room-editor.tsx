"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"
import { Loader2, Save, X, Plus, Image as ImageIcon, Trash2, UploadCloud, ArrowLeft, Calendar as CalendarIcon, Info } from "lucide-react"
import { createRoom, updateRoom, deleteRoom } from "@/app/actions/room"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isSameDay } from "date-fns"
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
        formData.blocked_dates.map((d: string) => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date;
        })
    )
    const [selectionMode, setSelectionMode] = useState<'range' | 'blocks'>('range')
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 gap-4">
                        <h3 className="section-title text-lg border-b-0 pb-0">Room Availability</h3>
                        <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
                            <button
                                type="button"
                                onClick={() => setSelectionMode('range')}
                                className={cn(
                                    "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                                    selectionMode === 'range' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                1. Set Range
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectionMode('blocks')}
                                className={cn(
                                    "px-4 py-2 text-sm font-bold rounded-lg transition-all",
                                    selectionMode === 'blocks' ? "bg-white text-destructive shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                2. Block Days
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start pt-2">
                        <div className="flex-1 w-full space-y-6">
                            <div className="relative group">
                                <div className={cn(
                                    "absolute inset-0 bg-primary/5 rounded-3xl -m-2 border-2 border-dashed border-primary/20 transition-opacity duration-300",
                                    selectionMode === 'range' ? "opacity-100" : "opacity-0 pointer-events-none"
                                )} />
                                <div className={cn(
                                    "absolute inset-0 bg-destructive/5 rounded-3xl -m-2 border-2 border-dashed border-destructive/20 transition-opacity duration-300",
                                    selectionMode === 'blocks' ? "opacity-100" : "opacity-0 pointer-events-none"
                                )} />

                                <Calendar
                                    mode={selectionMode === 'range' ? "range" : "multiple"}
                                    selected={selectionMode === 'range' ? (dateRange as any) : blockedDates}
                                    onSelect={(val: any) => {
                                        if (selectionMode === 'range') {
                                            const range = val as DateRange;
                                            setDateRange(range);
                                            handleChange("available_from", range?.from?.toISOString() || "");
                                            handleChange("available_until", range?.to?.toISOString() || "");

                                            if (range?.from) {
                                                const newBlocked = blockedDates.filter((d: Date) => {
                                                    const normalizedD = new Date(d).setHours(0, 0, 0, 0);
                                                    const from = new Date(range.from!).setHours(0, 0, 0, 0);
                                                    if (range.to) {
                                                        const to = new Date(range.to).setHours(0, 0, 0, 0);
                                                        return normalizedD >= from && normalizedD <= to;
                                                    }
                                                    return normalizedD >= from;
                                                });
                                                setBlockedDates(newBlocked);
                                                handleChange("blocked_dates", newBlocked.map(d => d.toISOString()));
                                            }
                                        } else {
                                            const dates = val as Date[] || [];
                                            const normalized = dates.map(d => {
                                                const date = new Date(d);
                                                date.setHours(0, 0, 0, 0);
                                                return date;
                                            });
                                            setBlockedDates(normalized);
                                            handleChange("blocked_dates", normalized.map(d => d.toISOString()));
                                        }
                                    }}
                                    disabled={selectionMode === 'blocks' ? (date) => {
                                        if (!dateRange?.from) return true;
                                        if (dateRange.to && (date < dateRange.from || date > dateRange.to)) return true;
                                        if (!dateRange.to && date < dateRange.from) return true;
                                        return false;
                                    } : undefined}
                                    modifiers={{
                                        blocked: (date) => blockedDates.some(d => isSameDay(d, date)),
                                        inRange: (date) => {
                                            if (!dateRange?.from || !dateRange?.to) return false;
                                            const normalizedDate = new Date(date).setHours(0, 0, 0, 0);
                                            const from = new Date(dateRange.from).setHours(0, 0, 0, 0);
                                            const to = new Date(dateRange.to).setHours(0, 0, 0, 0);
                                            return normalizedDate >= from && normalizedDate <= to;
                                        }
                                    }}
                                    modifiersClassNames={{
                                        blocked: "blocked-day-red",
                                        inRange: selectionMode === 'blocks' ? "bg-primary/10 text-primary font-bold" : ""
                                    }}
                                    numberOfMonths={2}
                                    className="p-4 border-0 shadow-none bg-white rounded-2xl w-full"
                                    classNames={{
                                        months: "flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0 w-full justify-center",
                                        month: "space-y-4 w-full flex-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex w-full justify-between",
                                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
                                        row: "flex w-full mt-2 justify-between",
                                        cell: "flex-1 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 mx-auto rounded-md flex items-center justify-center transition-colors hover:bg-muted/50",
                                        day_selected: cn(
                                            "aria-selected:opacity-100",
                                            selectionMode === 'blocks'
                                                ? "!bg-destructive !text-destructive-foreground"
                                                : "bg-primary text-primary-foreground"
                                        ),
                                        day_range_start: "day-range-start bg-primary text-primary-foreground",
                                        day_range_end: "day-range-end bg-primary text-primary-foreground",
                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                    }}
                                />
                                <style jsx global>{`
                                    .blocked-day-red {
                                        background-color: rgb(239 68 68) !important;
                                        color: white !important;
                                        border-radius: 0.5rem !important;
                                    }
                                    .blocked-day-red:hover {
                                        background-color: rgb(220 38 38) !important;
                                    }
                                `}</style>
                            </div>
                        </div>

                        <div className="w-full lg:w-72 space-y-6">
                            <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    How to use
                                </h4>
                                <ul className="text-xs space-y-3 text-muted-foreground font-medium">
                                    <li className={cn("transition-colors", selectionMode === 'range' ? "text-primary font-bold" : "")}>
                                        <span className="inline-flex h-4 w-4 bg-primary text-white items-center justify-center rounded-full text-[10px] mr-2">1</span>
                                        First, set the general dates your room is open.
                                    </li>
                                    <li className={cn("transition-colors", selectionMode === 'blocks' ? "text-destructive font-bold" : "")}>
                                        <span className="inline-flex h-4 w-4 bg-destructive text-white items-center justify-center rounded-full text-[10px] mr-2">2</span>
                                        Then, highlight specific days within that range to mark as unavailable (shown in red).
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm p-3 bg-white border border-border/50 rounded-xl">
                                        <span className="text-muted-foreground">Range</span>
                                        <span className="font-bold">
                                            {dateRange?.from ? (
                                                dateRange.to ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}` : format(dateRange.from, "MMM d")
                                            ) : "Not set"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-3 bg-white border border-border/50 rounded-xl text-destructive font-bold">
                                        <span>Blocked Days</span>
                                        <span>{blockedDates.length}</span>
                                    </div>
                                </div>
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
