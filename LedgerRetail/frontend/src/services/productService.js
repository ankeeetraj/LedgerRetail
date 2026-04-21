import api from './api'

const productService = {
  getAll: async ({ search = '', categoryId, page = 0, size = 20, sortBy = 'createdAt' } = {}) => {
    const params = { page, size, sortBy }
    if (search)     params.search     = search
    if (categoryId) params.categoryId = categoryId
    const { data } = await api.get('/products', { params })
    return data.data   // { content, totalElements, totalPages, ... }
  },
  getById:     async (id)        => { const { data } = await api.get(`/products/${id}`);    return data.data },
  create:      async (product)   => { const { data } = await api.post('/products', product); return data.data },
  update:      async (id, p)     => { const { data } = await api.put(`/products/${id}`, p); return data.data },
  delete:      async (id)        => { await api.delete(`/products/${id}`) },
  getLowStock: async (t = 10)    => { const { data } = await api.get('/products/low-stock', { params: { threshold: t } }); return data.data },
  getCategories: async ()        => { const { data } = await api.get('/categories'); return data.data },
}

export default productService
