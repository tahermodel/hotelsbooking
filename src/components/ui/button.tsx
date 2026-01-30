import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LiquidGlass } from "./liquid-glass"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                glass: "relative border-none shadow-none text-foreground overflow-hidden group/btn px-1",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-10 text-base font-bold",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glass"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const buttonContent = (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref as any}
                {...props}
            >
                {children}
            </Comp>
        )

        if (variant === "glass") {
            return (
                <LiquidGlass
                    animate={true}
                    className={cn(
                        "inline-flex items-center justify-center p-0 overflow-hidden rounded-full transition-transform active:scale-95",
                        size === "sm" ? "h-8 min-w-20" : size === "lg" ? "h-12 min-w-40" : "h-10 min-w-32",
                        className
                    )}
                >
                    <Comp
                        className={cn(
                            buttonVariants({ variant, size, className: "w-full h-full bg-transparent hover:bg-white/10 border-none shadow-none" })
                        )}
                        ref={ref as any}
                        {...props}
                    >
                        <span className="relative z-10">{children}</span>
                    </Comp>
                </LiquidGlass>
            )
        }

        return buttonContent
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
