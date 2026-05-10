'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function CalendarSection() {
  const t = useTranslations('landing')

  return (
    <section className="py-16 md:py-24 px-6 border-b border-divider bg-surface/30 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-10 md:gap-16">
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
          <div className="relative w-[260px] h-[520px] sm:w-[300px] sm:h-[600px] border-[8px] border-surface-variant bg-bg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
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
  )
}
