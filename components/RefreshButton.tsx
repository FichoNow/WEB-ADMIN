'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function RefreshButton() {
  const t = useTranslations('navbar')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      aria-label={t('refresh')}
      className="border-divider bg-surface/60 text-text-secondary hover:text-text-primary hover:bg-surface gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">{t('refresh')}</span>
    </Button>
  )
}
