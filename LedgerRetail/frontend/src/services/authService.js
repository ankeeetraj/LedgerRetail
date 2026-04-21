import api from './api'

const DEMO = {
  'admin@ledger.com':   { password: 'admin123', user: { id: 1, name: 'Alex Sterling',  email: 'admin@ledger.com',   role: 'ADMIN'   } },
  'cashier@ledger.com': { password: 'cash123',  user: { id: 2, name: 'Jamie Cashier',  email: 'cashier@ledger.com', role: 'CASHIER' } },
}

const authService = {
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      return { user: data.data.user, token: data.data.token }
    } catch (err) {
      // Demo fallback when backend is offline
      if (DEMO[email]) {
        const d = DEMO[email]
        if (d.password !== password) throw new Error('Invalid credentials')
        return { user: d.user, token: `demo-${d.user.role.toLowerCase()}` }
      }
      throw new Error(err.response?.data?.message || 'Login failed')
    }
  },
  logout: async () => { try { await api.post('/auth/logout') } catch {} },
  getProfile: async () => { const { data } = await api.get('/auth/me'); return data.data },
}

export default authService
