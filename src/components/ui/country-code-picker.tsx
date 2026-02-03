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
        <div className="flex gap-1.5 sm:gap-2 items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="flex h-10 w-12 sm:w-14 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-1 sm:px-2 py-2 text-sm hover:bg-slate-50 focus:outline-none focus:border-[#5AA9E6] focus:ring-1 focus:ring-[#5AA9E6] transition-all"
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
                        <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50 hidden sm:block" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0 bg-white shadow-xl border border-slate-200 rounded-lg z-[100]" align="start">
                    <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-9 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="Search country or code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden bg-white">
                        {filteredCountries.length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">No country found.</div>
                        )}
                        {filteredCountries.map((country) => (
                            <div
                                key={country.code}
                                className={cn(
                                    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none hover:bg-slate-50 transition-colors",
                                    value === country.prefix && "bg-slate-100 font-medium"
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
                                    className="mr-3 w-5 h-3.5 object-cover rounded-sm border border-slate-100 shadow-sm"
                                />
                                <span className="flex-1 truncate">
                                    {country.name}
                                </span>
                                <span className="ml-2 font-mono text-muted-foreground">
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
                    className="flex h-10 w-[60px] sm:w-[70px] rounded-md border border-slate-200 bg-white px-2 py-2 text-sm text-center ring-offset-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5AA9E6] focus:ring-offset-2 transition-all shadow-sm"
                />
            </div>
        </div>
    )
}
