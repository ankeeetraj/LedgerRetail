import api from './api'

const customerService = {
  getAll: async ({ search = '', page = 0, size = 20 } = {}) => {
    const params = { page, size }
    if (search) params.search = search
    const { data } = await api.get('/customers', { params })
    return data.data
  },
  getById:  async (id)  => { const { data } = await api.get(`/customers/${id}`);    return data.data },
  create:   async (c)   => { const { data } = await api.post('/customers', c);       return data.data },
  update:   async (id, c) => { const { data } = await api.put(`/customers/${id}`, c); return data.data },
  delete:   async (id)  => { await api.delete(`/customers/${id}`) },
  search:   async (q)   => { const { data } = await api.get('/customers', { params: { search: q, size: 10 } }); return data.data?.content || [] },
}

export default customerService
