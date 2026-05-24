'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import HeroDashboardMock from './HeroDashboardMock'

interface Props {
  onShowRegister: () => void
}

export default function HeroSection({ onShowRegister }: Props) {
  const t = useTranslations('landing')

  return (
    <section className="pt-16 lg:pt-24 px-6 border-b border-divider bg-surface/30 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <motion.div animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.05, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-1/4 w-[800px] h-[600px] bg-primary/40 blur-[160px] rounded-full pointer-events-none z-0" />
      <motion.div animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[10%] right-1/4 w-[600px] h-[500px] bg-brand-accent/30 blur-[160px] rounded-full pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto text-center relative z-10 mb-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6">
          {t('hero.title1')}<br />
          <span className="text-text-secondary">{t('hero.title2')}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button render={<Link href="/demo" />} size="lg" className="w-full sm:w-auto px-10 h-11 text-base text-white shadow-[0_0_24px_rgba(var(--primary),0.4)] hover:shadow-[0_0_32px_rgba(var(--primary),0.6)] transition-all">
            {t('hero.ctaDemo')}
          </Button>
          <Button variant="outline" size="lg" onClick={onShowRegister} className="w-full sm:w-auto px-10 h-11 text-base border-2 hover:bg-primary/5 transition-colors">
            {t('hero.ctaCreate')}
          </Button>
        </motion.div>
      </div>

      <HeroDashboardMock />
    </section>
  )
}
