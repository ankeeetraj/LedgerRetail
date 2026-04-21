import api from './api'

const userService = {
  getAll:     async ()          => { const { data } = await api.get('/users');            return data.data },
  create:     async (u)         => { const { data } = await api.post('/users', u);         return data.data },
  delete:     async (id)        => { await api.delete(`/users/${id}`) },
  updateRole: async (id, role)  => { const { data } = await api.put(`/users/${id}/role`, null, { params: { role } }); return data.data },
}

export default userService
