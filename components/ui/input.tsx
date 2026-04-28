import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border border-divider bg-bg/50 px-3.5 py-2 text-sm text-text-primary transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-primary placeholder:text-text-hint hover:bg-bg hover:border-divider/80 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:bg-bg disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-error/20 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
