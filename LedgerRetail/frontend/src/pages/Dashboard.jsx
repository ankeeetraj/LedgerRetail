import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import orderService from '../services/orderService'

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

const chartMonths = ['Jan','Feb','Mar','Apr','May','Jun']
const chartHeights = ['60%','75%','65%','90%','85%','95%']

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getDashboard()
      .then(setStats)
      .catch(() => setStats({
        totalSales: 0, totalOrders: 0, totalCustomers: 0,
        lowStockCount: 0, activeOrders: 0, fulfilledOrders: 0, salesThisMonth: 0
      }))
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total Sales',      value: fmt(stats.totalSales),      icon: 'payments',     iconBg: 'bg-primary-fixed',      iconColor: 'text-primary-container', badge: `+12.5%`, badgeColor: 'text-teal-700 bg-primary-fixed/30', sub: 'vs last month', trend: 'trending_up' },
    { label: 'Total Orders',     value: stats.totalOrders,           icon: 'shopping_cart', iconBg: 'bg-tertiary-fixed',    iconColor: 'text-tertiary-container', badge: `${stats.activeOrders} active`, badgeColor: 'text-teal-700 bg-primary-fixed/30', sub: 'orders', trend: 'trending_up' },
    { label: 'Low Stock',        value: stats.lowStockCount,         icon: 'warning',      iconBg: 'bg-error-container',    iconColor: 'text-error', badge: 'Alert', badgeColor: 'text-error bg-error-container/50', sub: 'Items needing restock', trend: null },
    { label: 'Total Customers',  value: stats.totalCustomers,        icon: 'person_add',   iconBg: 'bg-secondary-container',iconColor: 'text-secondary-fixed-dim', badge: `This month`, badgeColor: 'text-teal-700 bg-primary-fixed/30', sub: 'registered', trend: 'trending_up' },
  ] : []

  return (
    <Layout>
      <section className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-[2.75rem] font-bold tracking-tight text-on-surface leading-none">Dashboard</h2>
            <p className="micro-caps text-on-secondary-container mt-2">Operational Overview & KPI Performance</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-highest text-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity">Export PDF</button>
            <button onClick={() => navigate('/new-bill')} className="teal-gradient text-on-primary px-6 py-2.5 rounded-full text-sm font-semibold shadow-md active:scale-95 transition-transform">New Bill</button>
          </div>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest p-8 rounded-lg shadow-sm h-36 animate-pulse bg-surface-container" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(card => (
              <div key={card.label} className="bg-surface-container-lowest p-8 rounded-lg shadow-sm group hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="micro-caps text-outline font-bold">{card.label}</span>
                  <span className={`material-symbols-outlined ${card.iconColor} p-2 ${card.iconBg} rounded-xl`}>{card.icon}</span>
                </div>
                <div className="text-3xl font-bold text-on-secondary-fixed">{card.value}</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.trend && <span className="material-symbols-outlined text-xs mr-1">{card.trend}</span>}
                    {card.badge}
                  </span>
                  <span className="text-[10px] text-outline uppercase tracking-wider">{card.sub}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold text-on-surface">Monthly Recurring Revenue</h3>
                <p className="micro-caps text-outline mt-1">FY 2024 Revenue Projection</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full">₹ INR</span>
            </div>
            <div className="relative h-[280px] w-full flex items-end justify-between gap-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, i) => <div key={i} className="w-full border-b border-surface-variant/50 h-0" />)}
              </div>
              {chartMonths.map((m, i) => (
                <div key={m} className="flex-1 flex flex-col justify-end group cursor-pointer h-full">
                  <div className={`w-full rounded-t-lg transition-all group-hover:opacity-80 ${i === 5 ? 'bg-primary-fixed' : 'teal-gradient'}`} style={{ height: chartHeights[i] }} />
                  <span className={`micro-caps text-[10px] text-center mt-3 ${i === 5 ? 'text-primary font-bold' : 'text-outline'}`}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-bold text-on-surface mb-2">Quick Stats</h3>
            <p className="micro-caps text-outline mb-6">Live metrics</p>
            <div className="space-y-4">
              {[
                { label: 'Sales This Month', value: fmt(stats?.salesThisMonth), icon: 'payments', color: 'text-primary' },
                { label: 'Active Orders', value: stats?.activeOrders || 0, icon: 'pending_actions', color: 'text-amber-600' },
                { label: 'Fulfilled Orders', value: stats?.fulfilledOrders || 0, icon: 'check_circle', color: 'text-teal-600' },
                { label: 'Low Stock Items', value: stats?.lowStockCount || 0, icon: 'warning', color: 'text-error' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                  <span className={`material-symbols-outlined ${s.color} text-2xl`}>{s.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-outline">{s.label}</p>
                    <p className="font-bold text-on-surface">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/order-history')} className="w-full mt-6 py-3 bg-surface-container-high text-primary micro-caps font-bold rounded-xl hover:bg-surface-variant transition-colors">
              View All Orders
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-primary-container p-8 rounded-lg flex flex-col justify-between text-white relative overflow-hidden">
            <div className="z-10 relative">
              <span className="micro-caps text-primary-fixed opacity-70">Strategic Insight</span>
              <h4 className="text-2xl font-bold mt-4 leading-tight">Customer retention up by 18.2% this quarter.</h4>
              <p className="text-sm text-primary-fixed mt-4 leading-relaxed">Launch "Loyalty Tier 2" program to capitalise on engagement.</p>
            </div>
            <button onClick={() => navigate('/customers')} className="mt-8 bg-primary-fixed text-primary px-6 py-2.5 rounded-full text-xs font-bold self-start hover:bg-white transition-colors z-10 relative">
              View Customers
            </button>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="lg:col-span-3 bg-surface-container-lowest rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Create New Bill', icon: 'receipt_long', path: '/new-bill', color: 'teal-gradient text-white' },
                { label: 'Add Product',     icon: 'add_box',      path: '/products', color: 'bg-primary-fixed text-primary' },
                { label: 'Add Customer',    icon: 'person_add',   path: '/customers',color: 'bg-secondary-container text-primary' },
                { label: 'Order History',   icon: 'history',      path: '/order-history', color: 'bg-tertiary-fixed text-tertiary-container' },
                { label: 'All Invoices',    icon: 'description',  path: '/invoices', color: 'bg-surface-container text-primary' },
                { label: 'Manage Users',    icon: 'manage_accounts', path: '/users', color: 'bg-surface-container text-primary' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.path)}
                  className={`p-6 rounded-lg flex flex-col items-center gap-3 hover:scale-105 transition-transform active:scale-95 ${a.color}`}>
                  <span className="material-symbols-outlined text-3xl">{a.icon}</span>
                  <span className="text-xs font-bold text-center">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
