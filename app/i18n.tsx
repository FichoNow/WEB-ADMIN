'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en' | 'ca';

const translations = {
  es: {
    'nav.login': 'Iniciar sesión',
    'hero.title': 'Control horario',
    'hero.title.highlight': 'sin fricciones',
    'hero.subtitle': 'La plataforma definitiva para gestionar fichajes, ausencias y horarios de tu equipo. Rápida, intuïtiva y cumpliendo con la normativa actual.',
    'hero.demo': 'Solicitar demostración',
    'hero.create': 'Crea tu empresa',
    'reg.title': 'Crea tu empresa',
    'reg.subtitle': 'Registro de empresa y administrador',
    'log.title': 'Panel de administración',
    'log.subtitle': 'Control de accesos y gestión',
    'footer.terms': 'Términos legales',
    'footer.privacy': 'Política de privacidad',
    'footer.security': 'Seguridad'
  },
  en: {
    'nav.login': 'Log in',
    'hero.title': 'Time tracking',
    'hero.title.highlight': 'without friction',
    'hero.subtitle': 'The ultimate platform to manage your team\'s time tracking, absences, and schedules. Fast, intuitive, and compliant with current regulations.',
    'hero.demo': 'Request a demo',
    'hero.create': 'Create your company',
    'reg.title': 'Create your company',
    'reg.subtitle': 'Company and admin registration',
    'log.title': 'Administration panel',
    'log.subtitle': 'Access control and management',
    'footer.terms': 'Legal terms',
    'footer.privacy': 'Privacy policy',
    'footer.security': 'Security'
  },
  ca: {
    'nav.login': 'Iniciar sessió',
    'hero.title': 'Control horari',
    'hero.title.highlight': 'sense friccions',
    'hero.subtitle': 'La plataforma definitiva per gestionar fitxatges, absències i horaris del teu equip. Ràpida, intuïtiva i complint amb la normativa actual.',
    'hero.demo': 'Sol·licitar demostració',
    'hero.create': 'Crea la teva empresa',
    'reg.title': 'Crea la teva empresa',
    'reg.subtitle': 'Registre d\'empresa i administrador',
    'log.title': 'Panell d\'administració',
    'log.subtitle': 'Control d\'accessos i gestió',
    'footer.terms': 'Termes legals',
    'footer.privacy': 'Política de privacitat',
    'footer.security': 'Seguretat'
  }
}

type I18nContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    const stored = localStorage.getItem('app_lang') as Language;
    if (stored && ['es', 'en', 'ca'].includes(stored)) {
      setLangState(stored);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('app_lang', l);
  }

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations['es']] || key;
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
