'use client'

import { useState } from 'react'
import LoginModal from './LoginModal'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30">
      
      {/* Top Navbar */}
      <nav className="border-b border-divider bg-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              FichajeApp
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            La plataforma definitiva para RRHH
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1] mb-6">
            Control horario<br />
            <span className="text-text-secondary">diseñado para empresas.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Una plataforma integral para el registro de jornada, control de ausencias y gestión de proyectos. Cumpla con la normativa laboral sin fricción operativa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              className="w-full sm:w-auto px-8 py-3.5 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Solicitar demostración
            </button>
            <button 
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
              <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <span className="text-sm text-text-secondary">Validación por geolocalización.</span>
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
            <div className="relative w-[320px] h-[650px] border-[8px] border-surface-variant bg-[#1A1A1A] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col shrink-0">
              
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
              <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          {/* Calendar UI Widget */}
          <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none flex justify-center lg:justify-start">
            <div className="bg-[#151515] rounded-3xl p-6 md:p-8 border border-divider shadow-2xl w-full max-w-sm shrink-0">
              <div className="flex justify-between items-center mb-8">
                <svg className="w-5 h-5 text-text-secondary cursor-pointer hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                <h3 className="text-lg font-bold text-text-primary">Abril 2026</h3>
                <svg className="w-5 h-5 text-text-secondary cursor-pointer hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-6 text-center text-xs font-semibold text-text-secondary">
                <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
              </div>
              
              <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-sm font-medium">
                {/* Week 1 */}
                <div></div><div></div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">1</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">2</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">3</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">4</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">5</div>
                
                {/* Week 2 */}
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">6</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">7</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-[#3A1D1D] text-[#FF8A8A] flex items-center justify-center">8</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-[#3A1D1D] text-[#FF8A8A] flex items-center justify-center">9</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">10</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">11</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">12</div>

                {/* Week 3 */}
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">13</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">14</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">15</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">16</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">17</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">18</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">19</div>

                {/* Week 4 */}
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">20</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">21</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">22</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary text-white flex items-center justify-center">23</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-[#1A3A36] text-[#4ADE80] flex items-center justify-center">24</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">25</div>
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-text-primary">26</div>

                {/* Week 5 */}
                <div className="w-8 h-8 mx-auto rounded-full bg-[#1A3A36] text-[#4ADE80] flex items-center justify-center">27</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-[#1A3A36] text-[#4ADE80] flex items-center justify-center">28</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-[#1A3A36] text-[#4ADE80] flex items-center justify-center">29</div>
                <div className="w-8 h-8 mx-auto rounded-full bg-[#1A3A36] text-[#4ADE80] flex items-center justify-center">30</div>
              </div>

              <div className="h-px bg-divider w-full my-8"></div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-4 text-xs text-text-secondary px-2">
                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]"></span> Día laborable</div>
                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Trabajado</div>
                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#86EFAC]"></span> Vacaciones</div>
                <div className="flex items-center gap-3"><span className="w-2.5 h-2.5 rounded-full bg-[#FF8A8A]"></span> Ausencia</div>
              </div>
              
              <div className="mt-8 text-center">
                <button className="text-sm text-primary font-medium hover:text-primary-dark transition-colors inline-flex items-center justify-center gap-1">
                  Solicitudes de ausencia <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Features - Bento Grid */}
      <section className="py-24 px-6 border-b border-divider bg-bg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Más herramientas para su empresa
            </h2>
            <p className="text-text-secondary max-w-2xl">
              Un ecosistema completo diseñado para integrarse sin problemas en su flujo de trabajo diario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature: Organización */}
            <div className="card-border rounded-3xl p-8 flex flex-col hover:border-text-secondary transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-surface border border-divider flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Organización de plantilla</h3>
              <p className="text-text-secondary leading-relaxed mb-auto">
                Estructure su empresa fácilmente creando diferentes departamentos, grupos de trabajo y asignando roles y permisos específicos para cada mánager.
              </p>
            </div>

            {/* Feature: Security / Compliance (New filler feature since we moved Fichaje up) */}
            <div className="card-border rounded-3xl p-8 flex flex-col hover:border-text-secondary transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-surface border border-divider flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Cumplimiento normativo</h3>
              <p className="text-text-secondary leading-relaxed mb-auto">
                Garantice el cumplimiento de la ley de control horario. Registros inmutables y generación automática de reportes legales ante cualquier inspección de trabajo.
              </p>
            </div>

            {/* Feature: Admin Panel */}
            <div className="md:col-span-2 card-border rounded-3xl p-8 lg:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="w-14 h-14 rounded-2xl bg-surface border border-divider flex items-center justify-center mb-6 relative z-10 shadow-lg">
                <svg className="w-7 h-7 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 relative z-10">Panel de administrador total</h3>
              <p className="text-text-secondary leading-relaxed max-w-2xl relative z-10 text-base md:text-lg">
                Todo conectado. Inicie sesión desde la web para acceder a la plataforma completa y monitorizar todo el ecosistema de su empresa en tiempo real, desde reportes avanzados hasta aprobaciones pendientes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-divider py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white font-bold text-[10px]">
              F
            </div>
            <span className="text-sm font-medium text-text-primary">FichajeApp Enterprise</span>
          </div>
          <p className="text-sm text-text-hint">
            &copy; {new Date().getFullYear()} FichajeApp. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-hint">
            <a href="#" className="hover:text-text-primary transition-colors">Términos legales</a>
            <a href="#" className="hover:text-text-primary transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-text-primary transition-colors">Seguridad</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
