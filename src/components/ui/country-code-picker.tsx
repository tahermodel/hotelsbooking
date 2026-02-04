"use client"

import * as React from "react"
import { ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getCountries, getCountryCallingCode } from "libphonenumber-js"
import en from "react-phone-number-input/locale/en.json"
import Image from "next/image"

interface CountryCodePickerProps {
    value: string
    onChange: (value: string) => void
}

const countries = getCountries().map((country) => ({
    code: country,
    name: (en as any)[country] || country,
    prefix: `+${getCountryCallingCode(country)}`,
}))

export function CountryCodePicker({ value, onChange }: CountryCodePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const selectedCountry = countries.find((c) => c.prefix === (value.startsWith('+') ? value : '+' + value))

    const filteredCountries = countries.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.prefix.includes(search)
    )

    return (
        <div className="flex gap-2 items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex h-14 w-20 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 text-sm text-white hover:bg-white/10 transition-all outline-none active:scale-95 shadow-xl shadow-black/20"
                    >
                        {selectedCountry ? (
                            <div className="relative w-6 h-4 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10">
                                <Image
                                    src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                                    alt={selectedCountry.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <Search className="h-4 w-4 text-white/40" />
                        )}
                        <ChevronsUpDown className="h-3 w-3 text-white/20" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-neutral-900/95 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl z-[100] animate-in fade-in zoom-in-95 duration-200" align="start">
                    <div className="flex items-center border-b border-white/5 px-4 py-3">
                        <Search className="mr-3 h-4 w-4 shrink-0 text-white/20" />
                        <input
                            className="flex h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20 font-medium"
                            placeholder="Search country or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                        {filteredCountries.length === 0 && (
                            <div className="py-10 text-center text-sm text-white/20 font-medium">No destinations found.</div>
                        )}
                        {filteredCountries.map((country) => (
                            <div
                                key={country.code}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm outline-none hover:bg-white/5 transition-all group",
                                    value === country.prefix && "bg-white/5 font-black text-white"
                                )}
                                onClick={() => {
                                    onChange(country.prefix)
                                    setOpen(false)
                                    setSearch("")
                                }}
                            >
                                <div className="relative w-6 h-4 mr-3 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10">
                                    <Image
                                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                        alt={country.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform"
                                        unoptimized
                                    />
                                </div>
                                <span className={`flex-1 truncate ${value === country.prefix ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                    {country.name}
                                </span>
                                <span className={`ml-2 text-[10px] font-black tracking-widest ${value === country.prefix ? 'text-accent' : 'text-white/20 group-hover:text-white/40'}`}>
                                    {country.prefix}
                                </span>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        let val = e.target.value
                        if (val && !val.startsWith('+')) val = '+' + val
                        onChange(val)
                    }}
                    placeholder="+1"
                    className="flex h-14 w-24 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-center text-white font-black tracking-widest placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.08] transition-all shadow-xl shadow-black/20"
                />
            </div>
        </div>
    )
}
