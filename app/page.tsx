'use client'

import { useState } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30">
      
      <Navbar>
        <Button onClick={() => setShowLogin(true)} className="text-white">
          Gestionar empresa
        </Button>
      </Navbar>

      {/* Hero Section (Centered with Abstract UI) */}
      <section className="pt-16 lg:pt-24 px-6 border-b border-divider bg-surface/30 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        {/* Animated Spotlights */}
        <motion.div 
          animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.05, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-1/4 w-[800px] h-[600px] bg-primary/40 blur-[160px] rounded-full pointer-events-none z-0" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] right-1/4 w-[600px] h-[500px] bg-brand-accent/30 blur-[160px] rounded-full pointer-events-none z-0" 
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-16">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6"
          >
            Control horario<br />
            <span className="text-text-secondary">sin fricciones.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
          >
            La plataforma definitiva para gestionar fichajes, ausencias y horarios de tu equipo. Rápida, intuitiva y cumpliendo con la normativa actual.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="w-full sm:w-auto px-10 h-11 text-base text-white shadow-[0_0_24px_rgba(var(--primary),0.4)] hover:shadow-[0_0_32px_rgba(var(--primary),0.6)] transition-all">
              Solicitar demostración
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowRegister(true)}
              className="w-full sm:w-auto px-10 h-11 text-base border-2 hover:bg-primary/5 transition-colors"
            >
              Crea tu empresa
            </Button>
          </motion.div>
        </div>

        {/* Real Dashboard Presentation (Hero) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto relative z-10 pt-8"
        >
          <div className="w-full h-[300px] md:h-[450px] bg-bg rounded-t-3xl border-t border-x border-divider shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative text-[10px] md:text-xs">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
            
            {/* App Topbar */}
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
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-bold text-[9px] shadow-sm">
                  JF
                </div>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-divider bg-surface/50 flex-col shrink-0 hidden md:flex">
                <div className="px-4 py-4 border-b border-divider/50 flex flex-col gap-2">
                  <div>
                    <p className="text-[8px] font-medium tracking-widest text-text-hint uppercase mb-0.5">Empresa</p>
                    <p className="text-xs font-semibold text-text-primary truncate">TechCorp S.L.</p>
                  </div>
                </div>
                <nav className="flex-1 px-2 py-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2.5 w-full rounded-lg bg-primary/10 text-primary px-3 py-2 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Estadísticas
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary hover:bg-surface-variant/50 px-3 py-2 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Empleados
                  </div>
                  <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary hover:bg-surface-variant/50 px-3 py-2 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Horarios
                  </div>
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 bg-bg p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                <div className="flex justify-between items-end md:items-center">
                  <div>
                    <h1 className="text-xl md:text-2xl font-light text-text-primary tracking-tight">Rendimiento semanal</h1>
                    <p className="text-text-secondary text-[10px] md:text-xs mt-1">Visión general del estado de la plantilla (12 - 18 Abril).</p>
                  </div>
                  <div className="hidden md:flex gap-3 items-center">
                    <div className="flex items-center gap-2 bg-bg px-3 py-1.5 rounded-lg border border-divider text-text-hint w-64">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Buscar empleados o proyectos...
                    </div>
                    <div className="px-3 py-1.5 rounded-lg border border-divider bg-surface text-text-primary font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(129,199,132,0.6)]"></span> 142 Online
                    </div>
                    <div className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-medium flex items-center gap-2 shadow-lg shadow-primary/20">
                      Descargar CSV
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">Horas trabajadas</span>
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-text-primary mt-1 tabular-nums">4,248<span className="text-sm text-text-hint ml-1">h</span></div>
                    <div className="flex items-center gap-1 text-[10px] text-success font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      +12.5% vs anterior
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">Ausencias activas</span>
                      <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-text-primary mt-1 tabular-nums">8</div>
                    <div className="flex items-center gap-1 text-[10px] text-text-secondary font-medium">
                      5 médicas, 3 vacaciones
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">Puntualidad</span>
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-text-primary mt-1 tabular-nums">96.4%</div>
                    <div className="flex items-center gap-1 text-[10px] text-warning font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                      -1.2% vs media
                    </div>
                  </div>
                  <div className="bg-surface rounded-xl border border-divider p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start text-text-secondary">
                      <span className="font-medium">Horas extras</span>
                      <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-2xl md:text-3xl font-light text-warning mt-1 tabular-nums">142<span className="text-sm text-warning/50 ml-1">h</span></div>
                    <div className="flex items-center gap-1 text-[10px] text-error font-medium">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                      Excede límite
                    </div>
                  </div>
                </div>

                {/* Nice Chart Section */}
                <div className="flex-1 bg-surface rounded-xl border border-divider p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="flex justify-between items-center z-10">
                    <h3 className="font-medium text-text-primary">Evolución de horas semanales</h3>
                    <div className="flex gap-4 text-[10px]">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span> Horas regulares</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning"></span> Extras</div>
                    </div>
                  </div>
                  
                  {/* Decorative Chart SVG */}
                  <div className="flex-1 w-full relative z-10 mt-2 flex items-end justify-between px-2 gap-2">
                    {/* Background grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between border-t border-divider/50 pt-2 pointer-events-none">
                      <div className="h-px w-full bg-divider/30"></div>
                      <div className="h-px w-full bg-divider/30"></div>
                      <div className="h-px w-full bg-divider/30"></div>
                      <div className="h-px w-full bg-divider/30"></div>
                    </div>

                    {/* Bars */}
                    {[
                      { height: '60%', extra: '5%', label: 'Lun' },
                      { height: '80%', extra: '15%', label: 'Mar' },
                      { height: '75%', extra: '10%', label: 'Mié' },
                      { height: '90%', extra: '20%', label: 'Jue' },
                      { height: '85%', extra: '10%', label: 'Vie' },
                      { height: '30%', extra: '20%', label: 'Sáb' },
                      { height: '10%', extra: '5%', label: 'Dom' },
                    ].map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 group h-full z-10">
                        <div className="w-full max-w-[32px] md:max-w-[48px] flex flex-col justify-end gap-0.5 h-full relative">
                          <motion.div 
                            initial={{ height: 0 }} animate={{ height: day.extra }} transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                            className="w-full bg-gradient-to-t from-warning/80 to-warning rounded-t-sm" 
                          />
                          <motion.div 
                            initial={{ height: 0 }} animate={{ height: day.height }} transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                            className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-sm relative group-hover:brightness-125 transition-all" 
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-divider px-2 py-1 rounded text-[9px] text-text-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap pointer-events-none">
                              {day.label}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* X Axis Labels */}
                  <div className="w-full flex justify-between px-2 text-text-hint text-[9px] z-10 pt-2">
                    <span className="flex-1 text-center">Lun</span>
                    <span className="flex-1 text-center">Mar</span>
                    <span className="flex-1 text-center">Mié</span>
                    <span className="flex-1 text-center">Jue</span>
                    <span className="flex-1 text-center">Vie</span>
                    <span className="flex-1 text-center">Sáb</span>
                    <span className="flex-1 text-center">Dom</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase: Clock In (Fichaje) */}
      <section className="py-24 px-6 border-b border-divider bg-bg overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16"
        >
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-divider mb-6">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Fichaje profesional y avanzado
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Una experiencia móvil diseñada para que los empleados registren su tiempo sin fricciones. Imputación de horas por proyectos, registro de pausas y gestión inteligente de la jornada.
            </p>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0"
            >
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Imputación directa de horas a proyectos.</span>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Registro de descansos remunerados.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Cronómetro exacto al segundo.</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Minimalist Mobile Device Frame */}
          <motion.div 
            whileHover={{ y: -12, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex-1 w-full flex justify-center lg:justify-end cursor-default"
          >
            <div className="relative w-[300px] h-[600px] border-[8px] border-surface-variant bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
              
              {/* Minimalist Camera/Notch area */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-24 h-6 bg-surface-variant rounded-b-2xl"></div>
              </div>

              {/* Status Bar Fake */}
              <div className="pt-2 px-6 pb-2 flex justify-between items-center text-[10px] text-text-secondary font-medium">
                <span>09:00</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                </div>
              </div>
              
              {/* UI Content */}
              <div className="flex-1 px-5 pt-4 pb-6 overflow-hidden flex flex-col">
                {/* Header Navbar */}
                <div className="flex items-center justify-between mb-8">
                  <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Historial
                  </span>
                </div>

                <div className="bg-[#222222] rounded-2xl p-5 mb-8 border border-divider">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">Jornada Activa</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#333] px-2 py-1 rounded text-[10px] text-text-primary">
                      07:59
                      <svg className="w-3 h-3 ml-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-4xl font-light text-text-primary tabular-nums tracking-tighter">
                      01:01:23
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-text-secondary">Tareas de hoy</h3>
                    <button className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center text-primary hover:bg-divider transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <div className="rounded-xl p-4 bg-[#222222] border border-divider">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-secondary">¿En qué proyecto?</span>
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
                    Descanso
                  </button>
                  <button className="py-3 px-2 rounded-xl border border-error/50 text-error text-xs font-medium hover:bg-error/10 transition-colors">
                    Finalizar jornada
                  </button>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center z-20">
                <div className="w-24 h-1 bg-text-hint rounded-full opacity-50"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase: Calendar */}
      <section className="py-24 px-6 border-b border-divider bg-surface/30 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16"
        >
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-divider mb-6">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Gestión de ausencias simplificada
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Despídase de los correos interminables y las hojas de cálculo. Nuestro calendario integrado permite a los empleados solicitar vacaciones y reportar bajas médicas en segundos.
            </p>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0"
            >
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Aprobación en un solo clic para managers.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Todo el equipo alineado en una vista única.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Tipos de ausencia totalmente personalizables.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Cálculo automático de días disponibles.</span>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            whileHover={{ y: -12, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex-1 w-full flex justify-center lg:justify-start cursor-default"
          >
            <div className="relative w-[300px] h-[600px] border-[8px] border-surface-variant bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">

              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-24 h-6 bg-surface-variant rounded-b-2xl"></div>
              </div>

              {/* Status Bar */}
              <div className="pt-2 px-6 pb-2 flex justify-between items-center text-[10px] text-text-secondary font-medium">
                <span>09:00</span>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 px-4 pt-1 pb-4 overflow-hidden flex flex-col gap-3">

                {/* Hamburger */}
                <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>

                {/* Calendar card */}
                <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3 border border-divider">

                  {/* Month header */}
                  <div className="flex justify-between items-center">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span className="text-sm font-bold text-text-primary">Abril 2026</span>
                    <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>

                  {/* Day labels */}
                  <div className="grid grid-cols-7 text-center text-[9px] font-semibold text-text-secondary">
                    <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
                  </div>

                  {/* Days — laborables en azul, 8 y 9 en rojo (ausencia), fines de semana sin círculo */}
                  <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-medium">
                    <div></div><div></div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">1</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">2</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">3</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">4</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">5</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">6</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">7</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">8</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">9</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">10</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">11</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">12</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">13</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">14</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">15</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">16</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 text-primary flex items-center justify-center">17</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">18</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">19</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-error/20 text-error flex items-center justify-center">20</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-error/20 text-error flex items-center justify-center">21</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-error/20 text-error flex items-center justify-center">22</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/30">23</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">24</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">25</div>
                    <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-secondary">26</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">27</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">28</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">29</div>
                    <div className="w-8 h-8 mx-auto rounded-full bg-success/20 text-success flex items-center justify-center">30</div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-divider w-full"></div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-y-1 text-[9px] text-text-secondary">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success shrink-0"></span>Día laborable</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>Trabajado</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success/50 shrink-0"></span>Vacaciones</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-error shrink-0"></span>Ausencia</div>
                  </div>

                  {/* Solicitudes link */}
                  <button className="text-[10px] text-primary font-medium inline-flex items-center gap-1">
                    Solicitudes de ausencia
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>

                </div>

                {/* Horario laboral card */}
                <div className="bg-surface rounded-2xl px-4 py-4 border border-divider flex flex-col gap-2 relative mb-6">
                  <h3 className="text-sm font-bold text-text-primary mb-1">Horario laboral</h3>
                  <span className="text-xs text-text-secondary mb-2">60 min de descanso diario</span>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Lun</span>
                    <span className="text-text-secondary">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Mar</span>
                    <span className="text-text-secondary">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Mié</span>
                    <span className="text-text-secondary">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Jue</span>
                    <span className="text-text-secondary">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Vie</span>
                    <span className="text-text-secondary">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Sáb</span>
                    <span className="text-text-hint">Descanso</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-primary">Dom</span>
                    <span className="text-text-hint">Descanso</span>
                  </div>
                </div>

              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center z-20">
                <div className="w-24 h-1 bg-text-hint rounded-full opacity-50"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase: Admin Panel */}
      <section className="py-24 px-6 border-b border-divider bg-bg overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16"
        >
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-divider mb-6">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Panel de administración completo
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Acceda desde la web a una plataforma centralizada para monitorizar toda su empresa en tiempo real. Gestione usuarios, apruebe solicitudes y consulte reportes sin salir del panel.
            </p>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0"
            >
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Vista global de todos los departamentos.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Aprobación de solicitudes en un clic.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Gestión de usuarios y permisos.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Reportes en tiempo real exportables.</span>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Estadísticas y gráficas de rendimiento.</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Fake Admin Dashboard UI */}
          <motion.div 
            whileHover={{ y: -8, scale: 1.02, rotateX: 4, rotateY: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex-1 w-full flex justify-center lg:justify-end cursor-default"
            style={{ perspective: 1200 }}
          >
            <div className="w-full max-w-2xl bg-bg rounded-2xl border border-divider shadow-2xl overflow-hidden shrink-0 flex flex-col text-[10px]">
              {/* Fake Topbar */}
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
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-bold text-[9px] shadow-sm">
                    JF
                  </div>
                </div>
              </div>

              {/* Main App Area */}
              <div className="flex h-[380px] sm:h-[480px]">
                {/* Fake Sidebar */}
                <div className="w-48 border-r border-divider bg-surface flex-col shrink-0 hidden sm:flex">
                  <div className="px-4 py-4 border-b border-divider flex flex-col gap-3">
                    <div>
                      <p className="text-[8px] font-medium tracking-widest text-text-hint uppercase mb-0.5">Empresa</p>
                      <p className="text-xs font-semibold text-text-primary truncate">TechCorp S.L.</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-medium tracking-widest text-text-hint uppercase mb-0.5">Departamento</p>
                      <p className="text-xs font-semibold text-text-secondary truncate">Operaciones</p>
                    </div>
                  </div>
                  <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2.5 w-full rounded-lg bg-primary/15 text-primary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      Inicio
                    </div>
                    <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Empleados
                    </div>
                    <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      Proyectos
                    </div>
                    <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Fichajes
                    </div>
                    <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Solicitudes
                    </div>
                    <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56" /></svg>
                      Horarios
                    </div>
                    <div className="flex items-center gap-2.5 w-full rounded-lg text-text-secondary px-3 py-2 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      Estadísticas
                    </div>
                  </nav>
                </div>

                {/* Fake Content Area */}
                <div className="flex-1 p-6 bg-bg flex flex-col gap-6 overflow-hidden">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-medium tracking-widest text-primary uppercase">Inicio</p>
                    <h1 className="text-2xl font-light tracking-tight text-text-primary">Vista general</h1>
                    <p className="text-xs text-text-secondary">Selecciona un módulo para gestionar tu departamento.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pb-4 pr-1">
                    {/* Empleados */}
                    <div className="flex flex-col p-4 rounded-xl bg-surface border border-divider">
                      <svg className="w-4 h-4 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <h3 className="text-xs font-semibold text-text-primary mb-1">Empleados</h3>
                      <p className="text-[10px] text-text-secondary">Gestiona la plantilla, altas y bajas del equipo.</p>
                    </div>
                    {/* Proyectos */}
                    <div className="flex flex-col p-4 rounded-xl bg-surface border border-divider">
                      <svg className="w-4 h-4 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <h3 className="text-xs font-semibold text-text-primary mb-1">Proyectos</h3>
                      <p className="text-[10px] text-text-secondary">Administra proyectos y la imputación de horas.</p>
                    </div>
                    {/* Fichajes */}
                    <div className="flex flex-col p-4 rounded-xl bg-surface border border-divider">
                      <svg className="w-4 h-4 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h3 className="text-xs font-semibold text-text-primary mb-1">Fichajes</h3>
                      <p className="text-[10px] text-text-secondary">Revisa y ajusta los registros de jornada.</p>
                    </div>
                    {/* Solicitudes */}
                    <div className="flex flex-col p-4 rounded-xl bg-surface border border-divider">
                      <svg className="w-4 h-4 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <h3 className="text-xs font-semibold text-text-primary mb-1">Solicitudes</h3>
                      <p className="text-[10px] text-text-secondary">Aprueba vacaciones y ausencias del personal.</p>
                    </div>
                    {/* Horarios */}
                    <div className="flex flex-col p-4 rounded-xl bg-surface border border-divider">
                      <svg className="w-4 h-4 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z M4.22 4.22l15.56 15.56" /></svg>
                      <h3 className="text-xs font-semibold text-text-primary mb-1">Horarios</h3>
                      <p className="text-[10px] text-text-secondary">Configura horarios y turnos de trabajo.</p>
                    </div>
                    {/* Estadísticas */}
                    <div className="flex flex-col p-4 rounded-xl bg-surface border border-divider">
                      <svg className="w-4 h-4 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      <h3 className="text-xs font-semibold text-text-primary mb-1">Estadísticas</h3>
                      <p className="text-[10px] text-text-secondary">Analiza datos y rendimiento del equipo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Pills */}
      <section className="py-24 px-6 border-b border-divider bg-surface/30">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Todo lo que necesita su empresa
            </h2>
            <p className="text-text-secondary max-w-2xl">
              Un ecosistema completo diseñado para integrarse sin problemas en su flujo de trabajo diario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature: Organización */}
            <div className="group card-border rounded-3xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden bg-surface/50 hover:bg-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-12 h-12 rounded-xl bg-bg border border-divider flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-xl font-bold text-text-primary mb-3">Organización de plantilla</h3>
              <p className="relative z-10 text-text-secondary leading-relaxed">
                Cree departamentos, grupos de trabajo y asigne roles específicos para cada mánager de su organización.
              </p>
            </div>

            {/* Feature: Cumplimiento */}
            <div className="group card-border rounded-3xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden bg-surface/50 hover:bg-surface">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 w-12 h-12 rounded-xl bg-bg border border-divider flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-xl font-bold text-text-primary mb-3">Cumplimiento normativo</h3>
              <p className="relative z-10 text-text-secondary leading-relaxed">
                Registros inmutables y generación automática de reportes legales listos para cualquier inspección de trabajo.
              </p>
            </div>
          </div>
        </motion.div>
      </section>


      <Footer />

      {/* Login Modal */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}

      {/* Register Modal */}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onShowLogin={() => { setShowRegister(false); setShowLogin(true) }} />}
    </div>
  )
}
