'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('dashboardError')
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="text-center flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-text-primary">{t('title')}</h1>
        <p className="text-sm text-text-secondary max-w-sm">
          {t('description')}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-on-primary hover:bg-primary-dark transition-colors"
        >
          {t('retry')}
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-medium border border-divider text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
        >
          {t('backToHome')}
        </Link>
      </div>
    </div>
  )
}
