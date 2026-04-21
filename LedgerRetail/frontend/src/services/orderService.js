import api from './api'

const orderService = {
  getAll: async ({ status, customerId, page = 0, size = 10 } = {}) => {
    const params = { page, size }
    if (status)     params.status     = status
    if (customerId) params.customerId = customerId
    const { data } = await api.get('/orders', { params })
    return data.data
  },
  getById:        async (id)     => { const { data } = await api.get(`/orders/${id}`);         return data.data },
  create:         async (order)  => { const { data } = await api.post('/orders', order);        return data.data },
  updateStatus:   async (id, s)  => { const { data } = await api.put(`/orders/${id}/status`, null, { params: { status: s } }); return data.data },
  getInvoice:     async (id)     => { const { data } = await api.get(`/orders/${id}/invoice`); return data.data },
  getDashboard:   async ()       => { const { data } = await api.get('/orders/stats/dashboard'); return data.data },
}

export default orderService
