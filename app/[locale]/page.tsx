'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Navbar from '@/components/Navbar'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const t = useTranslations('landing')
  const tNav = useTranslations('navbar')
  const tCommon = useTranslations('common')

  const days = [
    { height: '60%', extra: '5%', label: t('days.mon') },
    { height: '80%', extra: '15%', label: t('days.tue') },
    { height: '75%', extra: '10%', label: t('days.wed') },
    { height: '90%', extra: '20%', label: t('days.thu') },
    { height: '85%', extra: '10%', label: t('days.fri') },
    { height: '30%', extra: '20%', label: t('days.sat') },
    { height: '10%', extra: '5%', label: t('days.sun') },
  ]

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30">

      <Navbar>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button onClick={() => setShowLogin(true)} className="text-white">
            {tNav('manageCompany')}
          </Button>
        </div>
      </Navbar>

      {/* Hero */}
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
            <Button size="lg" className="w-full sm:w-auto px-10 h-11 text-base text-white shadow-[0_0_24px_rgba(var(--primary),0.4)] hover:shadow-[0_0_32px_rgba(var(--primary),0.6)] transition-all">
              {t('hero.ctaDemo')}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowRegister(true)} className="w-full sm:w-auto px-10 h-11 text-base border-2 hover:bg-primary/5 transition-colors">
              {t('hero.ctaCreate')}
            </Button>
          </motion.div>
        </div>

        {/* Mock dashboard */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="max-w-5xl mx-auto relative z-10 pt-8">
          <div className="w-full h-[300px] md:h-[450px] bg-bg rounded-t-3xl border-t border-x border-divider shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative text-[10px] md:text-xs">
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
                  <div className="flex items-center gap-2.5 w-full rounded-lg bg-primary/10 text-primary px-3 py-2 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    {t('mockDashboard.menuStats')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary hover:bg-surface-variant/50 px-3 py-2 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {t('mockDashboard.menuEmployees')}
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary hover:bg-surface-variant/50 px-3 py-2 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t('mockDashboard.menuSchedules')}
                  </div>
                </nav>
              </div>

              <div className="flex-1 bg-bg p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-end md:items-center">
                  <div>
                    <h1 className="text-xl md:text-2xl font-light text-text-primary tracking-tight">{t('mockDashboard.title')}</h1>
                    <p className="text-text-secondary text-[10px] md:text-xs mt-1">{t('mockDashboard.subtitle')}</p>
                  </div>
                  <div className="hidden md:flex gap-3 items-center">
                    <div className="flex items-center gap-2 bg-bg px-3 py-1.5 rounded-lg border border-divider text-text-hint w-64">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      {t('mockDashboard.search')}
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border border-divider bg-surface text-text-primary font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(129,199,132,0.6)]"></span> {t('mockDashboard.online')}
                    </div>
                    <div className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-medium flex items-center gap-2">
                      {t('mockDashboard.download')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">{t('mockDashboard.metricHours')}</span>
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-text-primary mt-1 tabular-nums">4,248<span className="text-sm text-text-hint ml-1">h</span></div>
                    <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      {t('mockDashboard.metricHoursDelta')}
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">{t('mockDashboard.metricAbsences')}</span>
                      <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-text-primary mt-1 tabular-nums">8</div>
                    <div className="flex items-center gap-1 text-[10px] text-text-secondary font-medium">
                      {t('mockDashboard.metricAbsencesDetail')}
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">{t('mockDashboard.metricPunctuality')}</span>
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-text-primary mt-1 tabular-nums">96.4%</div>
                    <div className="flex items-center gap-1 text-[10px] text-warning font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                      {t('mockDashboard.metricPunctualityDelta')}
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">{t('mockDashboard.metricOvertime')}</span>
                      <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-warning mt-1 tabular-nums">142<span className="text-sm text-warning/50 ml-1">h</span></div>
                    <div className="flex items-center gap-1 text-[10px] text-error font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                      {t('mockDashboard.metricOvertimeDelta')}
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-surface rounded-xl border border-divider p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex justify-between items-center z-10">
                    <h3 className="font-medium text-text-primary">{t('mockDashboard.chartTitle')}</h3>
                    <div className="flex gap-4 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> {t('mockDashboard.chartLegendRegular')}</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning"></span> {t('mockDashboard.chartLegendExtra')}</div>
                    </div>
                  </div>

                  <div className="flex-1 w-full relative z-10 mt-2 flex items-end justify-between px-2 gap-2">
                    <div className="absolute inset-0 flex flex-col justify-between border-t border-divider/50 pt-2 pointer-events-none">
                      <div className="h-px w-full bg-divider/30"></div>
                      <div className="h-px w-full bg-divider/30"></div>
                      <div className="h-px w-full bg-divider/30"></div>
                      <div className="h-px w-full bg-divider/30"></div>
                    </div>

                    {days.map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group h-full z-10">
                        <div className="w-full max-w-[32px] md:max-w-[48px] flex flex-col justify-end gap-0.5 h-full relative">
                          <motion.div initial={{ height: 0 }} animate={{ height: day.extra }} transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }} className="w-full bg-gradient-to-t from-warning/80 to-warning rounded-t-sm" />
                          <motion.div initial={{ height: 0 }} animate={{ height: day.height }} transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }} className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-sm relative group-hover:brightness-125 transition-all">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-divider px-2 py-1 rounded text-[9px] text-text-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap pointer-events-none">
                              {day.label}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex justify-between px-2 text-text-hint text-[9px] z-10 pt-2">
                    {days.map((d, i) => (
                      <span key={i} className="flex-1 text-center">{d.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Fichaje */}
      <section className="py-24 px-6 border-b border-divider bg-bg overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
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
            <div className="relative w-[300px] h-[600px] border-[8px] border-surface-variant bg-bg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20"><div className="w-24 h-6 bg-surface-variant rounded-b-2xl"></div></div>
              <div className="pt-2 px-6 pb-2 flex justify-between items-center text-[10px] text-text-secondary font-medium">
                <span>09:00</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                </div>
              </div>
              <div className="flex-1 px-5 pt-4 pb-6 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {t('fichaje.phoneHistory')}
                  </span>
                </div>
                <div className="bg-surface rounded-2xl p-5 mb-8 border border-divider">
                  <div className="flex items-center justify-between mb-6">
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
                    <span className="text-4xl font-light text-text-primary tabular-nums tracking-tighter">01:01:23</span>
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

      {/* Calendar */}
      <section className="py-24 px-6 border-b border-divider bg-surface/30 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{t('calendar.title')}</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">{t('calendar.subtitle')}</p>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0">
              {[t('calendar.feat1'), t('calendar.feat2'), t('calendar.feat3'), t('calendar.feat4')].map((feat, i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm text-text-secondary">{feat}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div whileHover={{ y: -12, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="flex-1 w-full flex justify-center lg:justify-start cursor-default">
            <div className="relative w-[300px] h-[600px] border-[8px] border-surface-variant bg-bg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20"><div className="w-24 h-6 bg-surface-variant rounded-b-2xl"></div></div>
              <div className="pt-2 px-6 pb-2 flex justify-between items-center text-[10px] text-text-secondary font-medium">
                <span>09:00</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                </div>
              </div>

              <div className="flex-1 px-4 pt-1 pb-4 overflow-hidden flex flex-col gap-2">
                <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>

                <div className="bg-surface rounded-2xl p-3 flex flex-col gap-2 border border-divider">
                  <div className="flex justify-between items-center">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-sm font-bold text-text-primary">{t('calendar.month')}</span>
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>

                  <div className="grid grid-cols-7 text-center text-[9px] font-semibold text-text-secondary">
                    <div>{t('days.monShort')}</div><div>{t('days.tueShort')}</div><div>{t('days.wedShort')}</div><div>{t('days.thuShort')}</div><div>{t('days.friShort')}</div><div>{t('days.satShort')}</div><div>{t('days.sunShort')}</div>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-medium">
                    <div></div><div></div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">1</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">2</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">3</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">4</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">5</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">6</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">7</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">8</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">9</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">10</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">11</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">12</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">13</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">14</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">15</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">16</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">17</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">18</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">19</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-error/20 text-error flex items-center justify-center">20</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-error/20 text-error flex items-center justify-center">21</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-error/20 text-error flex items-center justify-center">22</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/30">23</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">24</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">25</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">26</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">27</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">28</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">29</div>
                    <div className="w-6 h-6 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">30</div>
                  </div>

                  <div className="h-px bg-divider w-full"></div>

                  <div className="grid grid-cols-2 gap-y-1 text-[9px] text-text-secondary">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success shrink-0"></span>{t('calendar.legendWorkday')}</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>{t('calendar.legendWorked')}</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success/50 shrink-0"></span>{t('calendar.legendVacation')}</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-error shrink-0"></span>{t('calendar.legendAbsence')}</div>
                  </div>

                  <button className="text-[10px] text-primary font-medium inline-flex items-center gap-1">
                    {t('calendar.absenceRequests')}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <div className="bg-surface rounded-2xl px-3 py-3 border border-divider flex flex-col gap-1 relative">
                  <h3 className="text-sm font-bold text-text-primary">{t('calendar.scheduleTitle')}</h3>
                  <span className="text-[10px] text-text-secondary mb-1">{t('calendar.scheduleBreak')}</span>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-text-primary">{t('calendar.scheduleWeekdays')}</span>
                    <span className="text-text-secondary">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-text-primary">{t('calendar.scheduleWeekend')}</span>
                    <span className="text-text-hint">{t('calendar.scheduleRest')}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 inset-x-0 flex justify-center z-20"><div className="w-24 h-1 bg-text-hint rounded-full opacity-50"></div></div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Admin Panel */}
      <section className="py-24 px-6 border-b border-divider bg-bg overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
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

                <div className="flex-1 p-6 bg-bg flex flex-col gap-6 overflow-hidden">
                  <header className="relative flex flex-col gap-1">
                    <h1 className="text-2xl font-light tracking-tight text-text-primary">{t('admin.mockWelcome')}</h1>
                    <p className="text-[10px] text-text-secondary max-w-sm">{t('admin.mockSubtitle')}</p>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -z-10" />
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1">
                    {[
                      { color: 'blue-500', title: t('admin.mockEmployees'), desc: t('admin.mockEmployeesDesc'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                      { color: 'emerald-500', title: t('admin.mockProjects'), desc: t('admin.mockProjectsDesc'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                      { color: 'amber-500', title: t('admin.mockRequests'), desc: t('admin.mockRequestsDesc'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                      { color: 'purple-500', title: t('admin.mockSchedules'), desc: t('admin.mockSchedulesDesc'), icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56' },
                      { color: 'rose-500', title: t('admin.mockStats'), desc: t('admin.mockStatsDesc'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                    ].map((m, i) => (
                      <div key={i} className="relative flex flex-col p-4 rounded-2xl bg-surface border border-divider/50 hover:border-primary/20 hover:bg-surface-variant/40 transition-all duration-300 overflow-hidden group">
                        <div className={`absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 transition-all duration-300 bg-${m.color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                        <div className="flex items-center gap-2 mb-2">
                          <svg className={`w-4 h-4 text-${m.color} transition-all duration-300 group-hover:scale-110`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={m.icon} /></svg>
                          <h3 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">{m.title}</h3>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-normal">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Pills */}
      <section className="py-24 px-6 border-b border-divider bg-surface/30">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto">
          <div className="mb-16">
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

      <Footer />

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onShowLogin={() => { setShowRegister(false); setShowLogin(true) }} />}
    </div>
  )
}
