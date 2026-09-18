import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token')
  const storedRole = localStorage.getItem('role')

  // Safely parse role or extract from user object if stored together
  let userRole = storedRole ? storedRole.toLowerCase() : null

  if (!userRole) {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        userRole = parsed?.role?.toLowerCase() || null
      }
    } catch (e) {
      console.error('Error parsing user role from localStorage:', e)
    }
  }

  // 1. Not logged in -> Send to appropriate login page
  if (!token) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/user/login'} replace />
  }

  // 2. Role mismatch -> Send to login instead of dashboard to avoid redirect loops
  if (allowedRole && userRole !== allowedRole.toLowerCase()) {
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/user/login'} replace />
  }

  return children
}