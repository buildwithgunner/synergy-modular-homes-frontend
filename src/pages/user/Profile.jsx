import { useState, useEffect } from 'react'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // First try localStorage (faster)
        const stored = localStorage.getItem('user')
        if (stored) {
          const user = JSON.parse(stored)
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
          })
        }

        // Then refresh from backend
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch(`${API_BASE}/me`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const user = await res.json()
          setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
          })
          localStorage.setItem('user', JSON.stringify(user))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('You must be logged in')
      }

      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data.message || (data.errors && Object.values(data.errors).flat().join(' ')) || 'Update failed'
        throw new Error(msg)
      }

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      setMessage('Profile updated successfully')
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h1>
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
          Loading profile...
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h1>

      <div className="bg-white rounded-2xl border p-6 max-w-xl">
        {message && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}