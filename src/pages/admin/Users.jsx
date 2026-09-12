import { useState, useEffect } from 'react'
import api from '../../api/axois'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await api.get('/users')
        setUsers(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        console.error(err)
        setError('Could not load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return 'bg-red-100 text-red-700'
    }
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {users.length} total
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
          Loading users...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-red-500">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
          No users registered yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {user.name || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}