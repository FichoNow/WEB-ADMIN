'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function FeaturesSection() {
  const t = useTranslations('landing')

  return (
    <section className="py-16 md:py-24 px-6 border-b border-divider bg-surface/30">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{t('features.title')}</h2>
          <p className="text-text-secondary max-w-2xl">{t('features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group card-border rounded-3xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden bg-surface/50 hover:bg-surface">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="relative z-10 flex items-center gap-3 text-xl font-bold text-text-primary mb-3">
              <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {t('features.orgTitle')}
            </h3>
            <p className="relative z-10 text-text-secondary leading-relaxed">{t('features.orgDesc')}</p>
          </div>

          <div className="group card-border rounded-3xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden bg-surface/50 hover:bg-surface">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="relative z-10 flex items-center gap-3 text-xl font-bold text-text-primary mb-3">
              <svg className="w-6 h-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              {t('features.complianceTitle')}
            </h3>
            <p className="relative z-10 text-text-secondary leading-relaxed">{t('features.complianceDesc')}</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
