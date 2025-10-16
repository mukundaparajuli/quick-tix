import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 uppercase tracking-wide  whitespace-nowrap rounded-lg  text-md font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  cursor-pointer ",
  {
    variants: {
      variant: {
        locked: "bg-neutral-200 text-primary-foreground hover:bg-neutral-200/90 border-neutral-400 border-b-4 active:border-b-0",
        default: "bg-white text-black border border-2 border-slate-200 border-b-4 active:border-b-0 hover:bg-slate-100",
        primary: "bg-gray-600 text-primary-foreground hover:bg-gray-600/90 border-slate-200 border-b-4 active:border-b-0",
        primaryOutline: "bg-white text-gray-500 hover:bg-slate-100",
        secondary: "bg-gray-800 text-primary-foreground hover:bg-gray-800/90 border-slate-200 border-b-4 active:border-b-0",
        secondaryOutline: "bg-white text-gray-800 hover:bg-slate-100",
        danger: "bg-rose-400 text-primary-foreground hover:bg-rose-400/90 border-rose-600 border-b-4 active:border-b-0",
        dangerOutline: "bg-white text-rose-500 hover:bg-slate-100",
        super: "bg-indigo-400 text-primary-foreground hover:bg-indigo-400/90 border-indigo-600 border-b-4 active:border-b-0",
        superOutline: "bg-white text-indigo-500 hover:bg-slate-100",
        sidebar: "bg-transparent text-slate-500 border-transparent border-2  hover:bg-slate-100 transition-none",
        sidebarOutline: "bg-gray-500/15 text-gray-500 border-gray-300 border-2 hover:bg-gray-500/20 transition-none",
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-4 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
        rounded: "rounded-full"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }