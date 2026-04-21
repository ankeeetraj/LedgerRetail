import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import Login          from './pages/Login'
import Dashboard      from './pages/Dashboard'
import Products       from './pages/Products'
import Customers      from './pages/Customers'
import NewBill        from './pages/NewBill'
import OrderHistory   from './pages/OrderHistory'
import Invoice        from './pages/Invoice'
import Settings       from './pages/Settings'
import UserManagement from './pages/UserManagement'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/new-bill"      element={<PrivateRoute><NewBill /></PrivateRoute>} />
          <Route path="/customers"     element={<PrivateRoute><Customers /></PrivateRoute>} />
          <Route path="/order-history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          <Route path="/invoices"      element={<PrivateRoute><Invoice /></PrivateRoute>} />
          <Route path="/settings"      element={<PrivateRoute><Settings /></PrivateRoute>} />

          <Route path="/products"      element={<PrivateRoute adminOnly><Products /></PrivateRoute>} />
          <Route path="/users"         element={<PrivateRoute adminOnly><UserManagement /></PrivateRoute>} />

          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
