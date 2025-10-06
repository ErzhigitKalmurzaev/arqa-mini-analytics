import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import { Provider } from 'react-redux';
import { SettingsProvider } from './context/SettingsContext.tsx'
import { store } from './store/store.ts'


// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ Service Worker зарегистрирован:', registration.scope)
        
        // Проверка обновлений каждые 60 секунд
        setInterval(() => {
          registration.update()
        }, 60000)
      })
      .catch((error) => {
        console.error('❌ Ошибка регистрации Service Worker:', error)
      })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          <SettingsProvider>
            <App />
          </SettingsProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)