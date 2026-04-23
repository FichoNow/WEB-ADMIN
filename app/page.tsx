'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30">
      
      {/* Top Navbar */}
      <nav className="border-b border-divider bg-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Ficho<span className="text-primary">Now</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Centered with Abstract UI) */}
      <section className="pt-24 lg:pt-32 px-6 border-b border-divider bg-surface/30 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-16">

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6">
            Control horario<br />
            <span className="text-text-secondary">sin fricciones.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            La plataforma definitiva para gestionar fichajes, ausencias y horarios de tu equipo. Rápida, intuitiva y cumpliendo con la normativa actual.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="w-full sm:w-auto px-8 py-3.5 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Solicitar demostración
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md text-sm font-medium border-2 border-text-secondary/50 text-text-primary hover:border-text-primary transition-colors"
            >
              Crea tu empresa
            </button>
          </div>
        </div>

        {/* Temporary Abstract Dashboard Presentation */}
        <div className="max-w-5xl mx-auto relative z-10 pt-8">
          <div className="w-full h-[300px] md:h-[400px] bg-[#111] rounded-t-3xl border-t border-x border-divider shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
            {/* Fake Browser Top */}
            <div className="h-12 border-b border-divider flex items-center px-6 gap-2 bg-[#151515]">
              <div className="w-3 h-3 rounded-full bg-divider"></div>
              <div className="w-3 h-3 rounded-full bg-divider"></div>
              <div className="w-3 h-3 rounded-full bg-divider"></div>
            </div>
            {/* Fake Dashboard Content */}
            <div className="flex-1 p-6 md:p-10 flex gap-6 opacity-30">
              <div className="w-48 hidden md:flex flex-col gap-4 border-r border-divider pr-6">
                <div className="h-4 w-24 bg-surface-variant rounded"></div>
                <div className="h-4 w-full bg-surface-variant rounded mt-4"></div>
                <div className="h-4 w-full bg-surface-variant rounded"></div>
                <div className="h-4 w-3/4 bg-surface-variant rounded"></div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="h-8 w-48 bg-surface-variant rounded"></div>
                <div className="flex gap-4">
                  <div className="flex-1 h-32 bg-surface-variant rounded-xl border border-divider"></div>
                  <div className="flex-1 h-32 bg-surface-variant rounded-xl border border-divider"></div>
                  <div className="flex-1 h-32 bg-surface-variant rounded-xl border border-divider"></div>
                </div>
                <div className="flex-1 w-full bg-surface-variant rounded-xl border border-divider"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase: Clock In (Fichaje) */}
      <section className="py-24 px-6 border-b border-divider bg-bg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Imputación directa de horas a proyectos.</span>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Registro de descansos remunerados.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Cronómetro exacto al segundo.</span>
              </div>
            </div>
          </div>

          {/* Minimalist Mobile Device Frame */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-[340px] h-[720px] border-[8px] border-surface-variant bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
              
              {/* Minimalist Camera/Notch area */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-28 h-6 bg-surface-variant rounded-b-2xl"></div>
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
                    <span className="text-5xl font-light text-text-primary tabular-nums tracking-tighter">
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
          </div>
        </div>
      </section>

      {/* Feature Showcase: Calendar */}
      <section className="py-24 px-6 border-b border-divider bg-surface/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Aprobación en un solo clic para managers.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Todo el equipo alineado en una vista única.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Tipos de ausencia totalmente personalizables.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Cálculo automático de días disponibles.</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-start">
            <div className="relative w-[340px] h-[720px] border-[8px] border-surface-variant bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">

              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                <div className="w-28 h-6 bg-surface-variant rounded-b-2xl"></div>
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
          </div>
        </div>
      </section>

      {/* Feature Showcase: Admin Panel */}
      <section className="py-24 px-6 border-b border-divider bg-bg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Vista global de todos los departamentos.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Aprobación de solicitudes en un clic.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Gestión de usuarios y permisos.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm text-text-secondary">Reportes en tiempo real exportables.</span>
              </div>
            </div>
          </div>

          {/* Fake Admin Dashboard UI */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-[#151515] rounded-2xl border border-divider shadow-2xl overflow-hidden shrink-0">
              <div className="h-10 bg-[#111] border-b border-divider flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-divider"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-divider"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-divider"></div>
                <div className="ml-3 flex-1 h-5 bg-surface-variant rounded-md max-w-xs"></div>
              </div>
              <div className="flex h-64">
                <div className="w-40 border-r border-divider p-4 flex flex-col gap-3 shrink-0">
                  <div className="h-3 w-20 bg-primary/40 rounded mb-2"></div>
                  <div className="h-7 w-full bg-primary/20 rounded-lg flex items-center px-2 gap-2">
                    <div className="w-3 h-3 rounded bg-primary/50"></div>
                    <div className="h-2 w-12 bg-primary/50 rounded"></div>
                  </div>
                  <div className="h-7 w-full bg-surface-variant/50 rounded-lg flex items-center px-2 gap-2">
                    <div className="w-3 h-3 rounded bg-surface-variant"></div>
                    <div className="h-2 w-14 bg-surface-variant rounded"></div>
                  </div>
                  <div className="h-7 w-full bg-surface-variant/50 rounded-lg flex items-center px-2 gap-2">
                    <div className="w-3 h-3 rounded bg-surface-variant"></div>
                    <div className="h-2 w-10 bg-surface-variant rounded"></div>
                  </div>
                  <div className="h-7 w-full bg-surface-variant/50 rounded-lg flex items-center px-2 gap-2">
                    <div className="w-3 h-3 rounded bg-surface-variant"></div>
                    <div className="h-2 w-16 bg-surface-variant rounded"></div>
                  </div>
                </div>
                <div className="flex-1 p-5 flex flex-col gap-4">
                  <div className="h-4 w-32 bg-surface-variant rounded"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-surface rounded-xl p-3 border border-divider">
                      <div className="h-2 w-10 bg-surface-variant rounded mb-2"></div>
                      <div className="h-4 w-8 bg-primary/40 rounded"></div>
                    </div>
                    <div className="bg-surface rounded-xl p-3 border border-divider">
                      <div className="h-2 w-12 bg-surface-variant rounded mb-2"></div>
                      <div className="h-4 w-6 bg-success/40 rounded"></div>
                    </div>
                    <div className="bg-surface rounded-xl p-3 border border-divider">
                      <div className="h-2 w-8 bg-surface-variant rounded mb-2"></div>
                      <div className="h-4 w-10 bg-warning/40 rounded"></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-surface rounded-xl border border-divider p-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="h-2 w-16 bg-surface-variant rounded"></div>
                      <div className="h-2 w-12 bg-surface-variant rounded ml-auto"></div>
                    </div>
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center gap-3 py-1.5 border-t border-divider/50">
                        <div className="w-5 h-5 rounded-full bg-surface-variant shrink-0"></div>
                        <div className="h-2 w-20 bg-surface-variant rounded"></div>
                        <div className="h-2 w-12 bg-surface-variant/60 rounded ml-auto"></div>
                        <div className="h-4 w-10 bg-primary/20 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="py-24 px-6 border-b border-divider bg-surface/30">
        <div className="max-w-7xl mx-auto">
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
            <div className="card-border rounded-3xl p-8 flex flex-col hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-surface border border-divider flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Organización de plantilla</h3>
              <p className="text-text-secondary leading-relaxed">
                Cree departamentos, grupos de trabajo y asigne roles específicos para cada mánager de su organización.
              </p>
            </div>

            {/* Feature: Cumplimiento */}
            <div className="card-border rounded-3xl p-8 flex flex-col hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-surface border border-divider flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Cumplimiento normativo</h3>
              <p className="text-text-secondary leading-relaxed">
                Registros inmutables y generación automática de reportes legales listos para cualquier inspección de trabajo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-divider bg-[#111] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold tracking-tight text-text-primary">
                  Ficho<span className="text-primary">Now</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-[10px] font-medium text-text-secondary border border-divider">
                  Enterprise
                </span>
              </div>
              <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
                La plataforma definitiva para gestionar fichajes, ausencias y horarios de tu equipo. Rápida, intuitiva y cumpliendo con la normativa actual.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/FichajeApp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/50 transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-sm font-bold text-text-primary mb-5">Producto</h4>
              <ul className="flex flex-col gap-3.5 text-sm text-text-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Precios</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-sm font-bold text-text-primary mb-5">Compañía</h4>
              <ul className="flex flex-col gap-3.5 text-sm text-text-secondary">
                <li><Link href="/sobre-nosotros" className="hover:text-primary transition-colors">Sobre nosotros</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-divider/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-hint">
              &copy; {new Date().getFullYear()} Ficho<span className="text-primary">Now</span>. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-text-hint">
              <a href="#" className="hover:text-text-primary transition-colors">Términos legales</a>
              <a href="#" className="hover:text-text-primary transition-colors">Política de privacidad</a>
              <a href="#" className="hover:text-text-primary transition-colors">Seguridad</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Register Modal */}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  )
}
