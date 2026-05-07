'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

const subscribe = () => () => {}
const getServerSnapshot = () => false
const getClientSnapshot = () => true

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const t = useTranslations('theme')

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isDark ? t('toLight') : t('toDark')}
      onClick={() => {
        const next = isDark ? 'light' : 'dark'
        document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`
        setTheme(next)
      }}
      className="h-9 w-9 border-divider bg-surface/60 text-text-secondary hover:text-text-primary hover:bg-surface"
    >
      {mounted ? (
        isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4 opacity-0" />
      )}
    </Button>
  )
}
