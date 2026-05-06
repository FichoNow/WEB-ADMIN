'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import LoginModal from '@/components/LoginForm'
import Footer from '@/components/Footer'

export default function SobreNosotros() {
  const [showLogin, setShowLogin] = useState(false)
  const t = useTranslations('about')
  const tNav = useTranslations('navbar')

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30 flex flex-col">

      <nav className="border-b border-divider bg-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Ficho<span className="text-primary">Now</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:block mr-4"
            >
              {t('backToHome')}
            </Link>
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {tNav('manageCompany')}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="pt-24 lg:pt-32 pb-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
              {t('tag')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.1] mb-8">
              {t('title1')} <span className="text-primary">FichoNow</span>
            </h1>

            <div className="prose prose-invert prose-lg max-w-none text-text-secondary">
              <p
                className="text-xl leading-relaxed text-text-primary mb-8"
                dangerouslySetInnerHTML={{ __html: t.raw('intro') as string }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mb-4 border-2 border-divider overflow-hidden">
                    <span className="text-2xl font-bold text-text-primary">B</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">Banlles</h3>
                  <p className="text-sm text-primary font-medium mb-3">{t('banllesRole')}</p>
                  <p className="text-sm text-text-hint">{t('banllesDesc')}</p>
                </div>

                <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mb-4 border-2 border-divider overflow-hidden">
                    <span className="text-2xl font-bold text-text-primary">F</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">Fran</h3>
                  <p className="text-sm text-primary font-medium mb-3">{t('franRole')}</p>
                  <p className="text-sm text-text-hint">{t('franDesc')}</p>
                </div>
              </div>

              <div className="bg-[#151515] rounded-3xl p-8 md:p-10 border border-divider relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <h2 className="text-2xl font-bold text-text-primary mb-4">{t('schoolTitle')}</h2>
                <p className="mb-6" dangerouslySetInnerHTML={{ __html: t.raw('school1') as string }} />
                <p className="mb-6">{t('school2')}</p>
                <p>{t('school3')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
