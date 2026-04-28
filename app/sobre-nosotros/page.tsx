'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoginModal from '@/components/LoginModal'

export default function SobreNosotros() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30 flex flex-col">
      
      {/* Top Navbar */}
      <nav className="border-b border-divider bg-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Ficho<span className="text-primary">Now</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:block mr-4"
            >
              Volver al inicio
            </Link>
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Gestionar empresa
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <section className="pt-24 lg:pt-32 pb-16 px-6 relative overflow-hidden">
          {/* Decorative Grid Background */}
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
              Nuestro Proyecto
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.1] mb-8">
              Conoce a los creadores de <span className="text-primary">FichoNow</span>
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none text-text-secondary">
              <p className="text-xl leading-relaxed text-text-primary mb-8">
                FichoNow no es solo una plataforma de control horario; es el resultado de meses de trabajo, aprendizaje y pasión por el desarrollo de software. Este proyecto nace como nuestro <strong>Trabajo de Final de Grado</strong>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mb-4 border-2 border-divider overflow-hidden">
                    <span className="text-2xl font-bold text-text-primary">B</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">Banlles</h3>
                  <p className="text-sm text-primary font-medium mb-3">Co-fundador & Desarrollador</p>
                  <p className="text-sm text-text-hint">Especializado en la arquitectura del sistema, backend y la interfaz web de administración.</p>
                </div>
                
                <div className="bg-surface border border-divider rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mb-4 border-2 border-divider overflow-hidden">
                    <span className="text-2xl font-bold text-text-primary">F</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">Fran</h3>
                  <p className="text-sm text-primary font-medium mb-3">Co-fundador & Desarrollador</p>
                  <p className="text-sm text-text-hint">Especializado en el desarrollo de la aplicación móvil nativa y experiencia de usuario (UX).</p>
                </div>
              </div>

              <div className="bg-[#151515] rounded-3xl p-8 md:p-10 border border-divider relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <h2 className="text-2xl font-bold text-text-primary mb-4">Estudiantes de DAM en Gimbernat</h2>
                <p className="mb-6">
                  Somos estudiantes del <strong>Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)</strong> en las <em>Escoles Universitàries Gimbernat</em>.
                </p>
                <p className="mb-6">
                  Nuestra misión con FichoNow ha sido crear una plataforma intuitiva y moderna para resolver un problema real: la gestión del control horario de forma sencilla, evitando la burocracia y la complejidad de los sistemas tradicionales.
                </p>
                <p>
                  Hemos aplicado todos los conocimientos adquiridos durante el ciclo formativo, desde el diseño de la interfaz y experiencia de usuario (UI/UX), hasta la creación de APIs, gestión de bases de datos y el desarrollo paralelo de aplicaciones web y móviles nativas para Android.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-divider bg-bg pt-16 pb-8 px-6 mt-auto">
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
                <li><Link href="/#funcionalidades" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
                <li><Link href="/#precios" className="hover:text-primary transition-colors">Precios</Link></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="text-sm font-bold text-text-primary mb-5">Compañía</h4>
              <ul className="flex flex-col gap-3.5 text-sm text-text-secondary">
                <li><Link href="/sobre-nosotros" className="hover:text-primary transition-colors">Sobre nosotros</Link></li>
                <li><Link href="/#contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
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
    </div>
  )
}
