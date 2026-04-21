import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('retail_token')
    const u = localStorage.getItem('retail_user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    setLoading(false)
  }, [])

  const login = (userData, jwt) => {
    setUser(userData); setToken(jwt)
    localStorage.setItem('retail_token', jwt)
    localStorage.setItem('retail_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('retail_token')
    localStorage.removeItem('retail_user')
    localStorage.removeItem('current_invoice')
  }

  const isAdmin   = () => user?.role === 'ADMIN'
  const isCashier = () => ['USER','CASHIER'].includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isCashier, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
