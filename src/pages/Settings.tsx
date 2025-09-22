import { useTranslation } from 'react-i18next'
import { useSettings } from '../context/SettingsContext'

export default function Settings() {
  const { t } = useTranslation()
  const { theme, setTheme, language, setLanguage } = useSettings()
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('settings')}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-md p-4 text-left space-y-2">
          <div className="font-medium">{t('theme')}</div>
          <div className="flex gap-2">
            <button className={`h-9 px-4 rounded border ${theme === 'light' ? 'bg-gray-100 dark:bg-gray-800' : ''}`} onClick={() => setTheme('light')}>{t('light')}</button>
            <button className={`h-9 px-4 rounded border ${theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : ''}`} onClick={() => setTheme('dark')}>{t('dark')}</button>
          </div>
        </div>
        <div className="border rounded-md p-4 text-left space-y-2">
          <div className="font-medium">{t('language')}</div>
          <div className="flex gap-2">
            <button className={`h-9 px-4 rounded border ${language === 'en' ? 'bg-gray-100 dark:bg-gray-800' : ''}`} onClick={() => setLanguage('en')}>{t('en')}</button>
            <button className={`h-9 px-4 rounded border ${language === 'ru' ? 'bg-gray-100 dark:bg-gray-800' : ''}`} onClick={() => setLanguage('ru')}>{t('ru')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}