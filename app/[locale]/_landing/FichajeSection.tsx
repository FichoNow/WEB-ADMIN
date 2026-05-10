'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function FichajeSection() {
  const t = useTranslations('landing')

  return (
    <section className="py-16 md:py-24 px-6 border-b border-divider bg-bg overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('fichaje.title')}</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">{t('fichaje.subtitle')}</p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0">
            {[t('fichaje.feat1'), t('fichaje.feat2'), t('fichaje.feat3')].map((feat, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div whileHover={{ y: -12, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="flex-1 w-full flex justify-center lg:justify-end cursor-default">
          <div className="relative w-[260px] h-[520px] sm:w-[300px] sm:h-[600px] border-[8px] border-surface-variant bg-bg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20"><div className="w-24 h-6 bg-surface-variant rounded-b-2xl"></div></div>
            <div className="pt-2 px-6 pb-2 flex justify-between items-center text-[10px] text-text-secondary font-medium">
              <span>09:00</span>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
              </div>
            </div>
            <div className="flex-1 px-4 sm:px-5 pt-3 sm:pt-4 pb-4 sm:pb-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 sm:mb-8">
                <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                <span className="text-xs text-primary font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t('fichaje.phoneHistory')}
                </span>
              </div>
              <div className="bg-surface rounded-2xl p-4 sm:p-5 mb-4 sm:mb-8 border border-divider">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">{t('fichaje.phoneActive')}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-variant px-2 py-1 rounded text-[10px] text-text-primary">
                    07:59
                    <svg className="w-3 h-3 ml-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-3xl sm:text-4xl font-light text-text-primary tabular-nums tracking-tighter">01:01:23</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-secondary">{t('fichaje.phoneTasks')}</h3>
                  <button className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-primary hover:bg-divider transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
                <div className="rounded-xl p-4 bg-surface border border-divider">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-secondary">{t('fichaje.phoneProject')}</span>
                    <button><svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-xs">
                    <span className="flex items-center gap-1">--:-- <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></span>
                    <span>→</span>
                    <span className="flex items-center gap-1">--:-- <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button className="py-3 px-2 rounded-xl border border-warning/50 text-warning text-xs font-medium hover:bg-warning/10 transition-colors flex justify-center items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>
                  {t('fichaje.phoneBreak')}
                </button>
                <button className="py-3 px-2 rounded-xl border border-error/50 text-error text-xs font-medium hover:bg-error/10 transition-colors">
                  {t('fichaje.phoneEnd')}
                </button>
              </div>
            </div>
            <div className="absolute bottom-2 inset-x-0 flex justify-center z-20"><div className="w-24 h-1 bg-text-hint rounded-full opacity-50"></div></div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
