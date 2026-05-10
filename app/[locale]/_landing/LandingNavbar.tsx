'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Button } from '@/components/ui/button'

interface Props {
  onShowLogin: () => void
}

export default function LandingNavbar({ onShowLogin }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const tNav = useTranslations('navbar')
  const tCommon = useTranslations('common')

  return (
    <>
      <Navbar>
        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button onClick={onShowLogin} className="text-white">
            {tNav('manageCompany')}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label={tCommon('openMenu')}
          aria-expanded={mobileMenuOpen}
          className="sm:hidden w-10 h-10 rounded-xl flex items-center justify-center text-text-primary hover:bg-surface-variant transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </Navbar>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden sticky top-16 z-40 overflow-hidden border-b border-divider bg-surface/95 backdrop-blur-xl shadow-sm"
          >
            <div className="flex flex-col gap-2 px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold tracking-wider uppercase text-text-hint">{tNav('settings')}</span>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
              <Button onClick={() => { setMobileMenuOpen(false); onShowLogin() }} className="w-full text-white">
                {tNav('manageCompany')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
