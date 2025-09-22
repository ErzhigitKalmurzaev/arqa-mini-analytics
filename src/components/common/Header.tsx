import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../../context/SettingsContext'

export default function Header() {
  const { t } = useTranslation()
  const { language, setLanguage, theme, setTheme } = useSettings()
  return (
    <header className="w-full flex justify-between bg-white/70 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10 border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">A</div>
          <div className="font-semibold tracking-tight">ARQA Mini Analytics</div>
        </div>
        <nav className="flex items-center gap-4 ml-4 text-sm">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}>
            {t('dashboard')}
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}>
            {t('orders')}
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}>
            {t('customers')}
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <button
            className={`h-8 px-3 rounded border text-sm ${language === 'en' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
          >
            {t('en', { defaultValue: 'EN' })}
          </button>
          <button
            className={`h-8 px-3 rounded border text-sm ${language === 'ru' ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
            onClick={() => setLanguage('ru')}
            aria-pressed={language === 'ru'}
          >
            {t('ru', { defaultValue: 'RU' })}
          </button>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
          <button
            className="h-8 px-3 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  )
}


