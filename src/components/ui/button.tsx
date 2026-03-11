import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-blue-700 text-primary-foreground hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-destructive-foreground hover:from-red-400 hover:to-red-500 shadow-lg hover:shadow-xl hover:shadow-red-500/30",
        outline:
          "border-2 border-blue-200 bg-background hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-purple-500 to-purple-600 text-secondary-foreground hover:from-purple-400 hover:to-purple-500 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        link: "text-primary underline-offset-4 hover:underline hover:text-blue-500",
        primaryGradient: "text-white font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5",
        softOutline: "border-2 border-blue-200 bg-white text-slate-800 hover:bg-blue-50 hover:border-blue-300 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-11 rounded-md px-7 text-base",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
