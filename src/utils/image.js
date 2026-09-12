const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '')

export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/storage')) return `${API_ORIGIN}${path}`
  return `${API_ORIGIN}/storage/${path.replace(/^\/+/, '')}`
}