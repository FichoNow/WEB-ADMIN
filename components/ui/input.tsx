import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-white/10 bg-white/7 px-3.5 py-2 text-sm text-text-primary transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary placeholder:text-text-hint hover:bg-white/10 hover:border-white/15 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:bg-white/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-error/20 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
