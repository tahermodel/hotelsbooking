"use client"

import { Button } from "@/components/ui/button"
import { handleSignOut } from "@/actions/auth"
import { cn } from "@/lib/utils"

interface SignOutButtonProps {
    className?: string
    variant?: any
    size?: any
    children?: React.ReactNode
}

export function SignOutButton({
    className,
    variant = "ghost",
    size = "sm",
    children
}: SignOutButtonProps) {
    const onSignOut = async () => {
        if (confirm("Are you sure you want to sign out?")) {
            await handleSignOut()
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={onSignOut}
            className={cn("rounded-full font-bold text-xs md:text-sm text-white/90 hover:text-white hover:bg-white/10 border border-white/10", className)}
        >
            {children || "Sign Out"}
        </Button>
    )
}
