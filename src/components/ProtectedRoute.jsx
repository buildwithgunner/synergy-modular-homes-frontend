import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) {
   
    if (allowedRole === 'admin') {
      return <Navigate to="/admin/login" replace />
    }
    return <Navigate to="/user/login" replace />
  }

 
  if (allowedRole && role !== allowedRole) {
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/user/dashboard" replace />
  }

  return children
}