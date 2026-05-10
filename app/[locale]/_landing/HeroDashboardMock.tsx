'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function HeroDashboardMock() {
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="max-w-5xl mx-auto relative z-10 pt-8">
      <div className="w-full md:h-[450px] bg-bg rounded-t-3xl border-t border-x border-divider shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative text-[10px] md:text-xs">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

        <div className="h-12 border-b border-divider flex items-center px-4 md:px-6 justify-between bg-surface shrink-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-error/80"></div>
              <div className="w-3 h-3 rounded-full bg-warning/80"></div>
              <div className="w-3 h-3 rounded-full bg-success/80"></div>
            </div>
            <div className="font-bold text-text-primary text-sm ml-4 hidden sm:block">
              Ficho<span className="text-primary">Now</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full border border-surface"></span>
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-bold text-[9px] shadow-sm">JF</div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-48 border-r border-divider bg-surface/50 flex-col shrink-0 hidden md:flex">
            <div className="px-4 py-4 border-b border-divider/50 flex flex-col gap-2">
              <div>
                <p className="text-[8px] font-medium tracking-widest text-text-hint uppercase mb-0.5">{tCommon('company')}</p>
                <p className="text-xs font-semibold text-text-primary truncate">{t('mockDashboard.company')}</p>
              </div>
            </div>
            <nav className="flex-1 px-2 py-3 flex flex-col gap-1">
              <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                {t('mockDashboard.menuHome')}
              </div>
              <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {t('mockDashboard.menuEmployees')}
              </div>
              <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                {t('mockDashboard.menuProjects')}
              </div>
              <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {t('mockDashboard.menuRequests')}
              </div>
              <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t('mockDashboard.menuSchedules')}
              </div>
              <div className="relative flex items-center gap-2.5 w-full rounded-lg bg-primary/10 text-primary px-3 py-2 font-semibold">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                {t('mockDashboard.menuStats')}
              </div>
            </nav>
          </div>

          <div className="flex-1 bg-bg p-3 md:p-8 flex flex-col gap-3 md:gap-5 overflow-hidden min-w-0">
            <div className="flex flex-col gap-2 md:gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h1 className="text-base md:text-2xl font-light text-text-primary tracking-tight">{t('mockDashboard.title')}</h1>
                  <p className="text-text-secondary text-[9px] md:text-xs mt-0.5 md:mt-1 truncate">{t('mockDashboard.subtitle')}</p>
                </div>
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-divider bg-surface text-text-primary font-medium text-[10px] md:text-[11px] shrink-0">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0l-3-3m3 3l-3 3M5 5h6a2 2 0 012 2v0M5 5v14a2 2 0 002 2h6a2 2 0 002-2v0" /></svg>
                  {t('mockDashboard.export')}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="grid grid-cols-3 md:inline-flex md:items-center bg-surface border border-divider rounded-lg p-1 gap-1 md:self-start min-w-0">
                  <div className="px-1.5 md:px-3 py-1 md:py-1.5 rounded-md bg-primary/10 text-primary font-bold text-[9px] md:text-[11px] flex items-center justify-center gap-1 md:gap-1.5 min-w-0">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    <span className="truncate">{t('mockDashboard.tabGeneral')}</span>
                  </div>
                  <div className="px-1.5 md:px-3 py-1 md:py-1.5 rounded-md text-text-secondary font-medium text-[9px] md:text-[11px] flex items-center justify-center gap-1 md:gap-1.5 min-w-0">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="truncate">{t('mockDashboard.tabIndividual')}</span>
                  </div>
                  <div className="px-1.5 md:px-3 py-1 md:py-1.5 rounded-md text-text-secondary font-medium text-[9px] md:text-[11px] flex items-center justify-center gap-1 md:gap-1.5 min-w-0">
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>
                    <span className="truncate">{t('mockDashboard.tabProjects')}</span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg border border-divider bg-surface text-text-primary font-medium text-[11px] flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {t('mockDashboard.month')}
                    <svg className="w-3 h-3 text-text-hint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg border border-divider bg-surface text-text-primary font-medium text-[11px] flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {t('mockDashboard.allGroups')}
                    <svg className="w-3 h-3 text-text-hint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="bg-surface rounded-xl md:rounded-2xl border border-divider/50 p-2.5 pl-3 md:p-4 md:pl-5 flex flex-col gap-1.5 md:gap-3 relative overflow-hidden min-w-0">
                <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-primary"></div>
                <div className="flex items-center gap-1 md:gap-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-text-hint min-w-0">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="leading-tight">{t('mockDashboard.kpiHours')}</span>
                </div>
                <div className="text-sm md:text-3xl font-light text-text-primary tabular-nums tracking-tight">3977h</div>
                <p className="text-[8px] md:text-[10px] text-text-hint font-medium leading-tight">{t('mockDashboard.kpiHoursDesc')}</p>
              </div>

              <div className="bg-surface rounded-xl md:rounded-2xl border border-divider/50 p-2.5 pl-3 md:p-4 md:pl-5 flex flex-col gap-1.5 md:gap-3 relative overflow-hidden min-w-0">
                <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-success"></div>
                <div className="flex items-center gap-1 md:gap-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-text-hint min-w-0">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <span className="leading-tight">{t('mockDashboard.kpiPunctuality')}</span>
                </div>
                <div className="text-sm md:text-3xl font-light text-text-primary tabular-nums tracking-tight">93%</div>
                <p className="text-[8px] md:text-[10px] text-text-hint font-medium leading-tight">{t('mockDashboard.kpiPunctualityDesc')}</p>
              </div>

              <div className="bg-surface rounded-xl md:rounded-2xl border border-divider/50 p-2.5 pl-3 md:p-4 md:pl-5 flex flex-col gap-1.5 md:gap-3 relative overflow-hidden min-w-0">
                <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-warning"></div>
                <div className="flex items-center gap-1 md:gap-1.5 text-[7px] md:text-[9px] font-black uppercase tracking-widest text-text-hint min-w-0">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="leading-tight">{t('mockDashboard.kpiOvertime')}</span>
                </div>
                <div className="text-sm md:text-3xl font-light text-text-primary tabular-nums tracking-tight">53h</div>
                <p className="text-[8px] md:text-[10px] text-text-hint font-medium leading-tight">{t('mockDashboard.kpiOvertimeDesc')}</p>
              </div>
            </div>

            <div className="bg-surface/60 rounded-xl md:rounded-2xl border border-divider/50 p-2.5 md:p-4 flex items-center justify-between gap-2 md:gap-4 relative overflow-hidden min-w-0">
              <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-primary"></div>
              <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 min-w-0">
                <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] md:text-xs font-bold text-text-primary truncate">{t('mockDashboard.insightsTitle')}</span>
                  <span className="text-[7px] md:text-[9px] text-text-hint font-medium uppercase tracking-wider mt-0.5 truncate">{t('mockDashboard.insightsCount')}</span>
                </div>
              </div>
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center bg-surface border border-divider/50 text-text-hint shrink-0">
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
