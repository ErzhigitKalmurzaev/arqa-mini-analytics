import { useSettings } from '../../context/SettingsContext'
import Navbar from './Navbar'

export default function Header() {

  const { theme, setTheme } = useSettings()
  
  return (
    <header className="w-full flex justify-between bg-white/70 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10 border-b dark:border-gray-800">
      <div className="max-w-7xl py-3 px-2 flex items-center justify-center w-full">
          <Navbar/>
        <div className="flex items-center gap-2">
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1" />
          <button
            className="h-8 px-2 rounded border text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
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


