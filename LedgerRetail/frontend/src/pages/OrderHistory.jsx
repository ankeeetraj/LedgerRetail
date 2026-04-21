import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import orderService from '../services/orderService'

const STATUS_STYLES = { DELIVERED: 'bg-teal-100 text-teal-800', PROCESSING: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', CANCELED: 'bg-error-container text-on-error-container', PENDING: 'bg-secondary-container text-secondary' }
const STATUS_DOTS   = { DELIVERED: 'bg-teal-600', PROCESSING: 'bg-tertiary-container', CANCELED: 'bg-error', PENDING: 'bg-outline' }
const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

export default function OrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders]         = useState([])
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading]       = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch]         = useState('')
  const [error, setError]           = useState('')
  const [stats, setStats]           = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await orderService.getAll({ status: filterStatus || undefined, page, size: 10 })
      setOrders(res?.content || [])
      setTotalPages(res?.totalPages || 1)
      setTotalItems(res?.totalElements || 0)
    } catch { setError('Failed to load orders.') }
    finally { setLoading(false) }
  }, [filterStatus, page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    orderService.getDashboard().then(setStats).catch(() => {})
  }, [])

  const filtered = orders.filter(o =>
    !search || o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.orderId?.toLowerCase().includes(search.toLowerCase())
  )

  const viewInvoice = async (orderId) => {
    try {
      const inv = await orderService.getInvoice(orderId)
      localStorage.setItem('current_invoice', JSON.stringify(inv))
      navigate('/invoices')
    } catch { alert('Invoice not available') }
  }

  return (
    <Layout>
      <main className="p-8 bg-surface-container-low min-h-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-primary uppercase">Commerce Platform</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mt-1">Order History</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {['', 'DELIVERED', 'PROCESSING', 'CANCELED', 'PENDING'].map(s => (
              <button key={s} onClick={() => { setFilterStatus(s); setPage(0) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === s ? 'teal-gradient text-white font-bold' : 'bg-surface-container-lowest text-secondary hover:bg-surface-variant'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-4 border-primary">
            <p className="text-[10px] font-bold tracking-widest text-outline uppercase mb-2">Total Revenue</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-extrabold text-on-surface">{fmt(stats?.totalSales)}</h3>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">All time</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-6">
            {[
              { label: 'Total Orders',    value: totalItems },
              { label: 'Active / Processing', value: stats?.activeOrders || 0 },
              { label: 'Fulfilled',       value: stats?.fulfilledOrders || 0 },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
                <p className="text-[10px] font-bold tracking-widest text-outline uppercase mb-2">{s.label}</p>
                <h3 className="text-xl font-bold text-on-surface">{s.value}</h3>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="p-4 bg-error-container rounded-lg text-on-error-container text-sm mb-4">{error}</div>}

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-surface-variant/30">
            <p className="text-sm font-bold text-primary">{totalItems} orders total</p>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-9 pr-4 py-2 bg-surface-container-low rounded-full text-sm outline-none border-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low">
                    {['Order ID','Customer','Date','Total (₹)','Status','Actions'].map((h, i) => (
                      <th key={h} className={`px-6 py-4 text-[10px] font-bold tracking-widest text-outline uppercase ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/30">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-secondary">No orders found</td></tr>
                  ) : filtered.map(o => (
                    <tr key={o.id} className="group hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td className="px-6 py-5"><span className="font-mono text-sm font-semibold text-primary">{o.orderId}</span></td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {(o.customer?.name || 'W').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{o.customer?.name || 'Walk-in Customer'}</p>
                            <p className="text-[11px] text-outline">{o.customer?.email || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-secondary">{new Date(o.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</p>
                        <p className="text-[10px] text-outline">{new Date(o.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</p>
                      </td>
                      <td className="px-6 py-5"><span className="text-sm font-extrabold text-on-surface">{fmt(o.totalAmount)}</span></td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[o.status] || 'bg-surface-container text-secondary'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[o.status] || 'bg-outline'}`} />
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => viewInvoice(o.id)} className="p-2 rounded-full hover:bg-surface-container text-primary" title="View Invoice">
                            <span className="material-symbols-outlined text-sm">receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
            <p className="text-xs text-outline">Page {page + 1} of {totalPages} — {totalItems} orders</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-variant disabled:opacity-30">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium ${i === page ? 'bg-primary text-white font-bold' : 'hover:bg-surface-variant'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-variant disabled:opacity-30">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8">
        <button onClick={() => navigate('/new-bill')} className="w-14 h-14 rounded-full teal-gradient text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </Layout>
  )
}
