import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import userService from '../services/userService'

const ROLE_STYLE = { ADMIN: 'bg-error-container text-error', CASHIER: 'bg-primary-fixed text-primary', USER: 'bg-secondary-container text-secondary' }

export default function UserManagement() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'CASHIER' })

  const load = async () => {
    setLoading(true)
    try { setUsers(await userService.getAll() || []) }
    catch { setError('Failed to load users. Admin access required.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try { await userService.create(form); setShowModal(false); setForm({ name: '', email: '', password: '', role: 'CASHIER' }); load() }
    catch (err) { setError(err.response?.data?.message || 'Create failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try { await userService.delete(id); load() }
    catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  const handleRoleChange = async (id, role) => {
    try { await userService.updateRole(id, role); load() }
    catch (err) { alert(err.response?.data?.message || 'Role update failed') }
  }

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Admin Panel</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-secondary-fixed">User Management</h2>
          </div>
          <button onClick={() => setShowModal(true)}
            className="px-8 py-3 rounded-full teal-gradient text-on-primary font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-base">person_add</span>Add Staff User
          </button>
        </div>

        {error && <div className="p-4 bg-error-container rounded-lg text-on-error-container text-sm">{error}</div>}

        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm">
          <div className="px-8 py-5 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
            <p className="text-sm font-bold text-primary">{users.length} system users</p>
            <p className="text-xs text-secondary">Admin access only</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-[10px] font-bold uppercase tracking-[0.1em] text-secondary">
                  {['User','Email','Role','Joined','Actions'].map(h => (
                    <th key={h} className="px-8 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-secondary">No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors group border-t border-surface-container/50">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full teal-gradient flex items-center justify-center text-white text-sm font-bold">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <p className="text-sm font-bold text-on-surface">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-secondary">{u.email}</td>
                    <td className="px-8 py-5">
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-none outline-none cursor-pointer ${ROLE_STYLE[u.role] || 'bg-secondary-container text-secondary'}`}>
                        <option value="ADMIN">ADMIN</option>
                        <option value="CASHIER">CASHIER</option>
                        <option value="USER">USER</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-sm text-secondary">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                    </td>
                    <td className="px-8 py-5">
                      <button onClick={() => handleDelete(u.id)}
                        className="p-2 rounded-full hover:bg-error-container text-error opacity-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-lg shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-surface-container flex items-center justify-between">
              <h3 className="text-lg font-bold">Add Staff User</h3>
              <button onClick={() => setShowModal(false)}><span className="material-symbols-outlined text-outline">close</span></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {error && <p className="text-error text-sm">{error}</p>}
              {[
                { f: 'name',     label: 'Full Name *',      type: 'text',     ph: 'Ravi Sharma' },
                { f: 'email',    label: 'Email Address *',  type: 'email',    ph: 'ravi@ledger.com' },
                { f: 'password', label: 'Password *',       type: 'password', ph: '••••••••' },
              ].map(({ f, label, type, ph }) => (
                <div key={f}>
                  <label className="micro-label text-on-surface-variant block mb-1.5">{label}</label>
                  <input type={type} required value={form[f]} onChange={e => setForm({...form, [f]: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                    placeholder={ph} />
                </div>
              ))}
              <div>
                <label className="micro-label text-on-surface-variant block mb-1.5">Role *</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none border border-transparent">
                  <option value="CASHIER">CASHIER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-full bg-surface-container text-secondary font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full teal-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</> : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
