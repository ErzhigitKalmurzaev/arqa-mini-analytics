import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
        <div>© {new Date().getFullYear()} ARQA Mini Analytics</div>
        <div className="flex items-center gap-3">
          <a className="hover:text-gray-700" href="https://arqa.kz" target="_blank" rel="noreferrer">arqa.kz</a>
          <span>•</span>
          <span>{t('dashboard')} · {t('orders')} · {t('customers')}</span>
        </div>
      </div>
    </footer>
  )
}


