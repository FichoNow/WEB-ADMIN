'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <motion.div 
        animate={{ opacity: [0.03, 0.05, 0.03], scale: [1, 1.1, 1] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none z-0" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        <h1 className="text-[140px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-text-primary to-text-secondary/20 mb-2 tracking-tighter">
          404
        </h1>
        <div className="w-16 h-1 bg-primary rounded-full mb-8"></div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4 tracking-tight">
          Parece que te has perdido
        </h2>
        <p className="text-text-secondary mb-10 text-lg leading-relaxed">
          La página que intentas buscar no existe, ha sido movida o la ruta es incorrecta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/"
            className="w-full sm:w-auto min-w-[160px] h-12 px-8 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al inicio
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto min-w-[160px] h-12 px-8 rounded-xl border border-divider bg-surface/50 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface hover:border-text-secondary transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Página anterior
          </button>
        </div>
      </motion.div>
    </div>
  )
}
