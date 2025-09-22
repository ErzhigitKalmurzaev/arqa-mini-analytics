import { Outlet, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'
import DashboardPage from './pages/Dashboard.tsx'
import OrdersPage from './pages/Orders.tsx'
import CustomersPage from './pages/Customers.tsx'
import Layout from './components/layout/Layout.tsx'

export default function App() {
  useTranslation()
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
      <Outlet />
    </Layout>
  )
}
