import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-[#f7fafa] sticky top-0 z-40 border-b border-surface-container/50">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/60 outline-none"
            placeholder="Search across enterprise data..." />
        </div>
      </div>
      <div className="flex items-center gap-4 border-l border-outline-variant/20 pl-6 ml-6">
        <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low relative">
          notifications
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
        </button>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/settings')}>
          <div className="w-8 h-8 rounded-full teal-gradient flex items-center justify-center text-white text-xs font-bold border-2 border-surface-variant group-hover:border-primary transition-colors">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-primary">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-secondary">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
