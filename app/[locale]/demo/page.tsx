'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import LoginModal from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Footer from '@/components/Footer'
import { Maximize2, X } from 'lucide-react'
import CustomVideoPlayer from './CustomVideoPlayer'

const VIDEO_SRC = '/Video_Demo_2_AUDIO.mp4'

export default function DemoPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const t = useTranslations('demo')
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
        <section className="pt-16 lg:pt-24 pb-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute top-[-10%] left-1/4 w-[600px] h-[400px] bg-primary/20 blur-[160px] rounded-full pointer-events-none z-0" />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6">
                {t('title')}
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </div>

            <div className="relative group rounded-2xl overflow-hidden ring-1 ring-divider bg-black shadow-2xl mx-auto w-full max-w-[320px] sm:max-w-[360px]">
              <CustomVideoPlayer src={VIDEO_SRC} videoClassName="w-full h-auto" />
              <button
                onClick={() => setExpanded(true)}
                aria-label={t('expand')}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-opacity backdrop-blur-sm"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-16 bg-surface border border-divider rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">{t('ctaTitle')}</h2>
              <p className="text-text-secondary mb-6 max-w-xl mx-auto">{t('ctaSubtitle')}</p>
              <Button
                size="lg"
                onClick={() => setShowRegister(true)}
                className="px-10 h-11 text-base text-white shadow-[0_0_24px_rgba(var(--primary),0.4)] hover:shadow-[0_0_32px_rgba(var(--primary),0.6)] transition-all"
              >
                {t('ctaButton')}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden bg-black ring-1 ring-white/10"
            >
              <CustomVideoPlayer src={VIDEO_SRC} autoPlay videoClassName="h-[90vh] w-auto max-w-[90vw]" />
              <button
                onClick={() => setExpanded(false)}
                aria-label={t('close')}
                className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onShowLogin={() => { setShowRegister(false); setShowLogin(true) }} />}
    </div>
  )
}
