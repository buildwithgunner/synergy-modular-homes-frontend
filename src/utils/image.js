const API_ORIGIN = 'http://127.0.0.1:8000'

export function getImageUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/storage')) return `${API_ORIGIN}${path}`
  return `${API_ORIGIN}/storage/${path.replace(/^\/+/, '')}`
}