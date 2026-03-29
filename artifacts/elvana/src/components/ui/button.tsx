import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Custom cinematic luxury button styles
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 tracking-wide uppercase text-xs"
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] duration-300",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground duration-300",
      ghost: "hover:bg-accent/10 hover:text-accent duration-300",
      link: "text-primary underline-offset-4 hover:underline",
    }
    
    const sizes = {
      default: "h-12 px-8 py-2",
      sm: "h-9 px-4",
      lg: "h-14 px-10 text-sm",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
