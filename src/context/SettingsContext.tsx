import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import i18n from '../i18n'

type Theme = 'light' | 'dark'
type Language = 'en' | 'ru'

type SettingsContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  language: Language
  setLanguage: (l: Language) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light')
  const [language, setLanguageState] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    void i18n.changeLanguage(language)
    localStorage.setItem('lang', language)
  }, [language])

  const value = useMemo<SettingsContextValue>(() => ({
    theme,
    setTheme: setThemeState,
    language,
    setLanguage: setLanguageState,
  }), [theme, language])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}


