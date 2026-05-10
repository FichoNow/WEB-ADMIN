'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function AdminPanelSection() {
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')

  const modules = [
    { color: 'blue-500', title: t('admin.mockEmployees'), desc: t('admin.mockEmployeesDesc'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { color: 'emerald-500', title: t('admin.mockProjects'), desc: t('admin.mockProjectsDesc'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { color: 'amber-500', title: t('admin.mockRequests'), desc: t('admin.mockRequestsDesc'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { color: 'purple-500', title: t('admin.mockSchedules'), desc: t('admin.mockSchedulesDesc'), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56' },
    { color: 'rose-500', title: t('admin.mockStats'), desc: t('admin.mockStatsDesc'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ]

  return (
    <section className="py-16 md:py-24 px-6 border-b border-divider bg-bg overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('admin.title')}</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">{t('admin.subtitle')}</p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0">
            {[t('admin.feat1'), t('admin.feat2'), t('admin.feat3'), t('admin.feat4'), t('admin.feat5')].map((feat, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">{feat}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div whileHover={{ y: -8, scale: 1.02, rotateX: 4, rotateY: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="flex-1 w-full flex justify-center lg:justify-end cursor-default" style={{ perspective: 1200 }}>
          <div className="w-full max-w-xl bg-bg rounded-2xl border border-divider shadow-2xl overflow-hidden shrink-0 flex flex-col text-[10px]">
            <div className="h-12 border-b border-divider flex items-center px-4 md:px-6 justify-between bg-surface shrink-0 z-10">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/80"></div>
                  <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80"></div>
                </div>
                <div className="font-bold text-text-primary text-sm ml-4 hidden sm:block">Ficho<span className="text-primary">Now</span></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full border border-surface"></span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-bold text-[9px] shadow-sm">JF</div>
              </div>
            </div>

            <div className="flex h-[340px] sm:h-[420px]">
              <div className="w-48 border-r border-divider bg-surface flex-col shrink-0 hidden sm:flex">
                <div className="px-4 py-4 border-b border-divider flex flex-col gap-3">
                  <div>
                    <p className="text-[8px] font-medium tracking-widest text-text-hint uppercase mb-0.5">{tCommon('company')}</p>
                    <p className="text-xs font-semibold text-text-primary truncate">{t('mockDashboard.company')}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-medium tracking-widest text-text-hint uppercase mb-0.5">{tCommon('department')}</p>
                    <p className="text-xs font-semibold text-text-secondary truncate">{t('mockDashboard.department')}</p>
                  </div>
                </div>
                <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2.5 w-full rounded-lg bg-primary/15 text-primary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    {t('admin.mockHome')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {t('admin.mockEmployees')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    {t('admin.mockProjects')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t('admin.mockClockings')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {t('admin.mockRequests')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56" /></svg>
                    {t('admin.mockSchedules')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    {t('admin.mockStats')}
                  </div>
                </nav>
              </div>

              <div className="flex-1 p-4 sm:p-6 bg-bg flex flex-col gap-3 sm:gap-6 overflow-hidden min-w-0">
                <header className="relative flex flex-col gap-1">
                  <h1 className="text-lg sm:text-2xl font-light tracking-tight text-text-primary">{t('admin.mockWelcome')}</h1>
                  <p className="text-[10px] text-text-secondary max-w-sm leading-snug">{t('admin.mockSubtitle')}</p>
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -z-10" />
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 overflow-y-auto pb-4 pr-1">
                  {modules.map((m, i) => (
                    <div key={i} className="relative flex flex-row sm:flex-col items-center sm:items-stretch gap-2.5 sm:gap-0 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-surface border border-divider/50 hover:border-primary/20 hover:bg-surface-variant/40 transition-all duration-300 overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 transition-all duration-300 bg-${m.color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                      <svg className={`w-4 h-4 sm:hidden text-${m.color} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} /></svg>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="hidden sm:flex items-center gap-2 mb-2">
                          <svg className={`w-4 h-4 text-${m.color} transition-all duration-300 group-hover:scale-110`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} /></svg>
                          <h3 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{m.title}</h3>
                        </div>
                        <h3 className="sm:hidden text-xs font-bold text-text-primary truncate">{m.title}</h3>
                        <p className="text-[9px] sm:text-[10px] text-text-secondary leading-snug truncate sm:whitespace-normal sm:overflow-visible">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
