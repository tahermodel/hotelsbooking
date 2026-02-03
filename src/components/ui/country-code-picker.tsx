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
        <div className="flex gap-1.5 items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex h-12 w-16 items-center justify-center gap-1 rounded-2xl border border-white/20 bg-white/10 px-2 py-2 text-sm text-white hover:bg-white/20 transition-all outline-none"
                    >
                        {selectedCountry ? (
                            <Image
                                src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                                alt={selectedCountry.name}
                                width={20}
                                height={14}
                                className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                            />
                        ) : (
                            <Search className="h-4 w-4 opacity-50" />
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0 bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl z-[100]" align="start">
                    <div className="flex items-center border-b border-black/5 px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-10 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="Search country or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
                        {filteredCountries.length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">No country found.</div>
                        )}
                        {filteredCountries.map((country) => (
                            <div
                                key={country.code}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm outline-none hover:bg-black/5 transition-colors",
                                    value === country.prefix && "bg-black/5 font-bold"
                                )}
                                onClick={() => {
                                    onChange(country.prefix)
                                    setOpen(false)
                                    setSearch("")
                                }}
                            >
                                <Image
                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                    alt={country.name}
                                    width={20}
                                    height={14}
                                    className="mr-3 w-5 h-3.5 object-cover rounded-sm border border-black/5 shadow-sm"
                                />
                                <span className="flex-1 truncate">
                                    {country.name}
                                </span>
                                <span className="ml-2 font-mono text-black/40 font-bold">
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
                    className="flex h-12 w-20 rounded-2xl border border-white/20 bg-white/10 px-2 py-2 text-sm text-center text-white font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all transition-all"
                />
            </div>
        </div>
    )
}
