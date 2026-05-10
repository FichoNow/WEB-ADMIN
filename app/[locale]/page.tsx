'use client'

import { useState } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import Footer from '@/components/Footer'
import LandingNavbar from './_landing/LandingNavbar'
import HeroSection from './_landing/HeroSection'
import FichajeSection from './_landing/FichajeSection'
import CalendarSection from './_landing/CalendarSection'
import AdminPanelSection from './_landing/AdminPanelSection'
import FeaturesSection from './_landing/FeaturesSection'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-primary/30">
      <LandingNavbar onShowLogin={() => setShowLogin(true)} />

      <HeroSection onShowRegister={() => setShowRegister(true)} />
      <FichajeSection />
      <CalendarSection />
      <AdminPanelSection />
      <FeaturesSection />

      <Footer />

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} onShowLogin={() => { setShowRegister(false); setShowLogin(true) }} />}
    </div>
  )
}
