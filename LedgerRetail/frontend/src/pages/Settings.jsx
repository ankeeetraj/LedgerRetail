import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [pwd, setPwd]         = useState({ current: '', newPwd: '', confirm: '' })
  const [prefs, setPrefs]     = useState({ currency: '₹ INR', timezone: 'Asia/Kolkata', dateFormat: 'DD/MM/YYYY', gstNo: '' })

  const saveProfile = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(''); setError('')
    await new Promise(r => setTimeout(r, 600))
    setMsg('Profile saved successfully (demo mode)')
    setSaving(false)
  }

  const savePwd = async (e) => {
    e.preventDefault(); setMsg(''); setError('')
    if (pwd.newPwd !== pwd.confirm) { setError('New passwords do not match'); return }
    if (pwd.newPwd.length < 6)     { setError('Password must be at least 6 characters'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setMsg('Password changed successfully')
    setPwd({ current: '', newPwd: '', confirm: '' })
    setSaving(false)
  }

  const TABS = [
    { id: 'profile',  label: 'Profile',     icon: 'person' },
    { id: 'password', label: 'Password',    icon: 'lock' },
    { id: 'prefs',    label: 'Preferences', icon: 'tune' },
    { id: 'about',    label: 'About',       icon: 'info' },
  ]

  return (
    <Layout>
      <div className="p-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary">Settings</h2>
          <p className="text-secondary mt-1 text-sm">Manage your account and application preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <div className="w-56 shrink-0">
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-l-4 ${tab === t.id ? 'border-primary text-primary bg-surface-container-low font-bold' : 'border-transparent text-secondary hover:bg-surface-container-low'}`}>
                  <span className="material-symbols-outlined text-sm">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={() => { logout(); navigate('/login') }}
              className="w-full mt-4 flex items-center gap-3 px-5 py-4 text-sm font-medium text-error hover:bg-error-container/30 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm">logout</span>Sign Out
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {(msg || error) && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${msg ? 'bg-primary-fixed/30 text-primary' : 'bg-error-container text-on-error-container'}`}>
                {msg || error}
              </div>
            )}

            {tab === 'profile' && (
              <div className="bg-surface-container-lowest rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-bold text-on-surface mb-6">Profile Information</h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full teal-gradient flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-on-surface">{user?.name}</p>
                    <p className="text-sm text-secondary">{user?.email}</p>
                    <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-[10px] font-bold uppercase mt-2 inline-block">{user?.role}</span>
                  </div>
                </div>
                <form onSubmit={saveProfile} className="space-y-5">
                  {[{ f: 'name', label: 'Full Name', type: 'text' }, { f: 'email', label: 'Email Address', type: 'email' }].map(({ f, label, type }) => (
                    <div key={f}>
                      <label className="micro-label text-on-surface-variant block mb-1.5">{label}</label>
                      <input type={type} value={profile[f]} onChange={e => setProfile({...profile, [f]: e.target.value})}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30" />
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="px-8 py-3 rounded-full teal-gradient text-white font-bold text-sm flex items-center gap-2 disabled:opacity-70">
                    {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Save Profile'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'password' && (
              <div className="bg-surface-container-lowest rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-bold text-on-surface mb-6">Change Password</h3>
                <form onSubmit={savePwd} className="space-y-5">
                  {[
                    { f: 'current', label: 'Current Password' },
                    { f: 'newPwd',  label: 'New Password' },
                    { f: 'confirm', label: 'Confirm New Password' },
                  ].map(({ f, label }) => (
                    <div key={f}>
                      <label className="micro-label text-on-surface-variant block mb-1.5">{label}</label>
                      <input type="password" value={pwd[f]} onChange={e => setPwd({...pwd, [f]: e.target.value})}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
                        placeholder="••••••••" />
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="px-8 py-3 rounded-full teal-gradient text-white font-bold text-sm flex items-center gap-2 disabled:opacity-70">
                    {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {tab === 'prefs' && (
              <div className="bg-surface-container-lowest rounded-lg shadow-sm p-8">
                <h3 className="text-lg font-bold text-on-surface mb-6">Application Preferences</h3>
                <div className="space-y-5">
                  {[
                    { f: 'currency',   label: 'Currency',        options: ['₹ INR', '$ USD', '€ EUR'] },
                    { f: 'timezone',   label: 'Timezone',        options: ['Asia/Kolkata', 'UTC', 'Asia/Dubai'] },
                    { f: 'dateFormat', label: 'Date Format',     options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
                  ].map(({ f, label, options }) => (
                    <div key={f}>
                      <label className="micro-label text-on-surface-variant block mb-1.5">{label}</label>
                      <select value={prefs[f]} onChange={e => setPrefs({...prefs, [f]: e.target.value})}
                        className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent">
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div>
                    <label className="micro-label text-on-surface-variant block mb-1.5">GST Number</label>
                    <input value={prefs.gstNo} onChange={e => setPrefs({...prefs, gstNo: e.target.value})}
                      className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                      placeholder="29ABCDE1234F1Z5" />
                  </div>
                  <button onClick={() => setMsg('Preferences saved')} className="px-8 py-3 rounded-full teal-gradient text-white font-bold text-sm">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {tab === 'about' && (
              <div className="bg-surface-container-lowest rounded-lg shadow-sm p-8 space-y-6">
                <h3 className="text-lg font-bold text-on-surface">About Ledger Retail</h3>
                {[
                  { label: 'Application', value: 'Ledger Retail — Enterprise Suite' },
                  { label: 'Version',     value: 'v1.0.0' },
                  { label: 'Backend',     value: 'Spring Boot 3.2 + Java 17' },
                  { label: 'Frontend',    value: 'React 18 + Vite + Tailwind CSS' },
                  { label: 'Database',    value: 'MySQL 8.0' },
                  { label: 'Tax',         value: '18% GST (CGST 9% + SGST 9%)' },
                  { label: 'Currency',    value: 'Indian Rupee (₹ INR)' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 border-b border-surface-container last:border-0">
                    <span className="text-sm text-secondary font-medium">{label}</span>
                    <span className="text-sm font-bold text-on-surface">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
