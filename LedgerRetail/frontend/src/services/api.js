import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 15000,
})

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('retail_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('retail_token')
      localStorage.removeItem('retail_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
