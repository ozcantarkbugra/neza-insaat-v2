'use client'

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'

import tr from '@/locales/tr.json'
import en from '@/locales/en.json'

export type Locale = 'tr' | 'en'

const translations: Record<Locale, Record<string, unknown>> = { tr, en }

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : undefined
}

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'neza-locale'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored === 'tr' || stored === 'en') setLocaleState(stored)
    setMounted(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale]
      const value = getNested(dict as Record<string, unknown>, key)
      return value ?? key
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  if (!mounted) {
    return (
      <I18nContext.Provider value={{ locale: 'tr', setLocale, t }}>
        {children}
      </I18nContext.Provider>
    )
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
