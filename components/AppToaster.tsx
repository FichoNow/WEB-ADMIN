'use client'

import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'

export default function AppToaster() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'light' ? 'light' : resolvedTheme === 'dark' ? 'dark' : undefined
  return (
    <Toaster
      position="bottom-right"
      theme={theme}
      richColors
      closeButton
    />
  )
}
