import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '../features/auth/LoginPage'
import AppLayout from '../components/layout/AppLayout'
import DashboardPage from '../features/dashboard/DashboardPage'
import ClientesPage from '../features/clientes/ClientesPage'
import ServiciosPage from '../features/servicios/ServiciosPage'
import ReservasPage from '../features/reservas/ReservasPage'
import BloqueosPage from '../features/bloqueos/BloqueosPage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/bloqueos" element={<BloqueosPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes