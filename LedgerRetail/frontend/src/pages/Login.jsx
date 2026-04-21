import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

export default function Login() {
  const [form, setForm]             = useState({ email: '', password: '' })
  const [showPwd, setShowPwd]       = useState(false)
  const [remember, setRemember]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { user, token } = await authService.login(form.email, form.password)
      login(user, token)
      navigate('/dashboard')
    } catch (err) { setError(err.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  const demo = (role) => {
    const d = { admin: { email: 'admin@ledger.com', password: 'admin123' }, cashier: { email: 'cashier@ledger.com', password: 'cash123' } }
    setForm(d[role])
  }

  return (
    <div className="bg-primary-container font-body text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-fixed blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-inverse-primary blur-[100px]" />
      </div>

      <main className="relative z-10 w-full max-w-[1100px] grid md:grid-cols-2 bg-surface-container-lowest rounded-lg shadow-2xl overflow-hidden min-h-[700px]">
        {/* Left branding */}
        <section className="hidden md:flex flex-col justify-between p-12 teal-gradient text-on-primary">
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">Ledger Retail</h1>
            <p className="text-primary-fixed opacity-80 text-sm mt-1">Enterprise Suite v1.0 — Made in India 🇮🇳</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">The modern billing system for Indian retail.</h2>
            <p className="text-lg text-primary-fixed/70 font-light max-w-sm">GST-compliant invoices · ₹ INR pricing · CGST + SGST breakdown.</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: 'receipt_long', label: 'GST Invoices' },
                { icon: 'inventory_2',  label: 'Stock Management' },
                { icon: 'group',        label: 'Customer CRM' },
                { icon: 'analytics',    label: 'Live Dashboard' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary-fixed">{f.icon}</span>
                  <span className="text-sm text-primary-fixed font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs opacity-40">© 2024 Ledger Retail. All rights reserved.</p>
        </section>

        {/* Right form */}
        <section className="flex flex-col justify-center p-8 md:p-16 bg-surface-container-lowest">
          <div className="max-w-sm mx-auto w-full space-y-8">
            <div className="space-y-3">
              <div className="md:hidden mb-4">
                <span className="text-xl font-bold tracking-tighter text-primary">Ledger Retail</span>
              </div>
              <h3 className="text-3xl font-bold text-on-secondary-fixed tracking-tight">Sign In</h3>
              <p className="text-secondary text-sm">Enter your credentials to access the dashboard.</p>
            </div>

            {/* Demo shortcuts */}
            <div className="flex gap-2">
              <button type="button" onClick={() => demo('admin')}
                className="text-xs px-3 py-1.5 rounded-full bg-primary-fixed text-primary font-semibold hover:bg-primary-fixed-dim transition-colors">
                Demo Admin
              </button>
              <button type="button" onClick={() => demo('cashier')}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary-container text-secondary font-semibold hover:bg-surface-variant transition-colors">
                Demo Cashier
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-error-container rounded-DEFAULT text-on-error-container text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>{error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="micro-label text-on-surface-variant block">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                  <input type="email" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low rounded-DEFAULT text-on-secondary-fixed placeholder:text-outline/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none border border-transparent focus:border-primary/30"
                    placeholder="admin@ledger.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="micro-label text-on-surface-variant block">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                  <input type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low rounded-DEFAULT text-on-secondary-fixed placeholder:text-outline/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none border border-transparent focus:border-primary/30"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" />
                <label htmlFor="remember" className="text-sm text-secondary font-medium cursor-pointer select-none">Stay signed in for 30 days</label>
              </div>

              <button type="submit" disabled={loading}
                className="w-full teal-gradient text-on-primary font-semibold py-4 rounded-full shadow-lg active:scale-95 transition-all text-sm tracking-wide disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing in...</> : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
