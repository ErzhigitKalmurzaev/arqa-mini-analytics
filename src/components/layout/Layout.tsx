import Header from '../common/Header'
import Footer from '../common/Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          <Outlet/>
        </div>
      </main>
      <Footer />
    </div>
  )
}


