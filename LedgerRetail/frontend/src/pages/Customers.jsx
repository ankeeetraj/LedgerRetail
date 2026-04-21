import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import customerService from '../services/customerService'

const emptyForm = { name: '', company: '', email: '', phone: '', address: '' }

const STATUS_STYLE = {
  ENTERPRISE: 'bg-primary-fixed text-on-primary-fixed-variant',
  ACTIVE:     'bg-secondary-container text-on-secondary-container',
  DELINQUENT: 'bg-error-container text-error',
  INACTIVE:   'bg-surface-container text-secondary',
}

export default function Customers() {
  const [customers, setCustomers]   = useState([])
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editCustomer, setEditCustomer] = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [search, setSearch]         = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await customerService.getAll({ search, page, size: 10 })
      setCustomers(res?.content || [])
      setTotalPages(res?.totalPages || 1)
      setTotal(res?.totalElements || 0)
    } catch { setError('Failed to load customers.') }
    finally { setLoading(false) }
  }, [search, page])

  useEffect(() => { load() }, [load])

  const openAdd  = () => { setEditCustomer(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (c) => { setEditCustomer(c); setForm({ name: c.name, company: c.company || '', email: c.email || '', phone: c.phone || '', address: c.address || '' }); setShowModal(true) }
  const close    = () => { setShowModal(false); setEditCustomer(null); setForm(emptyForm) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editCustomer) await customerService.update(editCustomer.id, form)
      else              await customerService.create(form)
      close(); load()
    } catch (err) { alert(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return
    try { await customerService.delete(id); load() }
    catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Layout>
      <div className="p-8 flex-1">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-primary leading-none">Customers</h2>
            <p className="text-secondary mt-2 text-sm">Manage client relationships. Total: {total}</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 teal-gradient text-on-primary px-8 py-4 rounded-full font-bold text-sm shadow-xl active:scale-98 transition-all">
            <span className="material-symbols-outlined text-lg">person_add</span>New Customer
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="p-6 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between h-32">
            <span className="micro-caps font-bold text-secondary">Total Customers</span>
            <span className="text-3xl font-bold text-primary">{total}</span>
          </div>
          <div className="p-6 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between h-32">
            <span className="micro-caps font-bold text-secondary">Enterprise</span>
            <span className="text-3xl font-bold text-primary">{customers.filter(c => c.status === 'ENTERPRISE').length}</span>
          </div>
          <div className="p-6 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col justify-between h-32">
            <span className="micro-caps font-bold text-secondary">Active</span>
            <span className="text-3xl font-bold text-primary">{customers.filter(c => c.status === 'ACTIVE').length}</span>
          </div>
          <div className="p-6 bg-error-container rounded-lg shadow-sm flex flex-col justify-between h-32">
            <span className="micro-caps font-bold text-error">Delinquent</span>
            <span className="text-3xl font-bold text-error">{customers.filter(c => c.status === 'DELINQUENT').length}</span>
          </div>
        </div>

        {error && <div className="p-4 bg-error-container rounded-lg text-on-error-container text-sm mb-4">{error}</div>}

        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm">
          <div className="px-8 py-5 flex items-center justify-between border-b border-surface-container-low">
            <span className="text-xs text-secondary font-medium">{total} customers total</span>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Search name, email, phone..."
                className="pl-9 pr-4 py-2 bg-surface-container-low rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 border-none" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  {['Customer Name','Contact','Status','Joined',''].map(h => (
                    <th key={h} className="px-8 py-4 text-left micro-caps font-bold text-secondary">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-secondary">No customers found</td></tr>
                ) : customers.map(c => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors group border-t border-surface-container/30">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center font-bold text-xs">
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-on-surface">{c.name}</div>
                          <div className="text-xs text-outline">{c.company || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-0.5">
                        {c.email && <div className="flex items-center gap-2 text-xs text-on-surface"><span className="material-symbols-outlined text-sm text-outline">mail</span>{c.email}</div>}
                        {c.phone && <div className="flex items-center gap-2 text-xs text-outline"><span className="material-symbols-outlined text-sm text-outline">call</span>{c.phone}</div>}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLE[c.status] || 'bg-secondary-container text-secondary'}`}>{c.status}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-secondary">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(c)} className="p-2 rounded-full hover:bg-surface-container text-primary"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2 rounded-full hover:bg-error-container text-error"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="px-8 py-6 bg-surface-container-low/30 flex items-center justify-between">
            <span className="text-xs text-secondary">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="p-2 rounded-full border border-outline-variant/30 hover:bg-white disabled:opacity-30">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold ${i === page ? 'bg-primary text-white' : 'hover:bg-white'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="p-2 rounded-full border border-outline-variant/30 hover:bg-white disabled:opacity-30">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-lg shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-surface-container flex items-center justify-between">
              <h3 className="text-lg font-bold">{editCustomer ? 'Edit Customer' : 'New Customer'}</h3>
              <button onClick={close}><span className="material-symbols-outlined text-outline">close</span></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { f: 'name',    label: 'Full Name *',    ph: 'Arjun Mehta',           req: true  },
                { f: 'company', label: 'Company',         ph: 'Acme India Pvt Ltd',    req: false },
                { f: 'email',   label: 'Email',           ph: 'arjun@acme.in',         req: false },
                { f: 'phone',   label: 'Phone',           ph: '+91 98765 43210',       req: false },
                { f: 'address', label: 'Address',         ph: '42, MG Road, Bengaluru',req: false },
              ].map(({ f, label, ph, req }) => (
                <div key={f}>
                  <label className="micro-label text-on-surface-variant block mb-1.5">{label}</label>
                  <input type={f === 'email' ? 'email' : 'text'} required={req} value={form[f]}
                    onChange={e => setForm({...form, [f]: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                    placeholder={ph} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={close} className="flex-1 py-3 rounded-full bg-surface-container text-secondary font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full teal-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : (editCustomer ? 'Update' : 'Add Customer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
