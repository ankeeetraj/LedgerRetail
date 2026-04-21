import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard',     icon: 'dashboard',        label: 'Dashboard' },
  { to: '/new-bill',      icon: 'receipt_long',     label: 'New Bill' },
  { to: '/products',      icon: 'inventory_2',      label: 'Products',    adminOnly: true },
  { to: '/customers',     icon: 'group',            label: 'Customers' },
  { to: '/order-history', icon: 'history',          label: 'Order History' },
  { to: '/invoices',      icon: 'description',      label: 'Invoices' },
  { to: '/users',         icon: 'manage_accounts',  label: 'Users',       adminOnly: true },
]

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const visible = NAV.filter(n => !n.adminOnly || isAdmin())

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#f7fafa] flex flex-col h-full py-8 px-6 z-50 border-r border-surface-container">
      {/* Brand */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold tracking-tighter text-primary">Ledger Retail</h1>
        <p className="micro-caps text-on-secondary-container mt-1">Enterprise Suite v1.0</p>
      </div>

      {/* New Bill CTA */}
      <NavLink to="/new-bill"
        className="mb-8 w-full py-3 px-4 teal-gradient text-on-primary rounded-full flex items-center justify-center gap-2 font-semibold shadow-lg active:scale-95 transition-transform text-sm">
        <span className="material-symbols-outlined text-sm">receipt_long</span>
        Create New Bill
      </NavLink>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {visible.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => isActive
              ? 'flex items-center gap-3 px-4 py-3 text-primary font-bold border-r-4 border-primary bg-surface-container-low rounded-l-xl text-sm'
              : 'flex items-center gap-3 px-4 py-3 rounded-xl text-[#5f6368] hover:text-primary hover:bg-surface-container-low transition-colors text-sm font-medium'
            }>
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-3 px-4 py-3 mb-1">
          <div className="w-8 h-8 rounded-full teal-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-primary truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-secondary">{user?.role || 'Staff'}</p>
          </div>
        </div>

        <NavLink to="/settings"
          className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${isActive ? 'text-primary font-bold bg-surface-container-low' : 'text-[#5f6368] hover:text-primary hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined">settings</span>
          Settings
        </NavLink>

        <button onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/30 transition-colors text-sm font-medium">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
