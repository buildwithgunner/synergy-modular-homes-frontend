import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function NewInquiry() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const homeIdFromUrl = searchParams.get('home_id')

  const [homes, setHomes] = useState([])
  const [loadingHomes, setLoadingHomes] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    home_id: homeIdFromUrl || '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Pre-fill user info if logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setForm((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }))
      } catch (e) {}
    }
  }, [])

  // Load homes list (so we can show the selected home name)
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch(`${API_BASE}/homes`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('Failed to load homes')
        const data = await res.json()
        setHomes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingHomes(false)
      }
    }
    fetchHomes()
  }, [])

  // Keep home_id in sync if URL changes
  useEffect(() => {
    if (homeIdFromUrl) {
      setForm((prev) => ({ ...prev, home_id: homeIdFromUrl }))
    }
  }, [homeIdFromUrl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const selectedHome = homes.find((h) => String(h.id) === String(form.home_id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')

      const payload = {
        home_id: form.home_id || null,
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        notes: form.notes || null,
        type: 'inquiry',
        status: 'new',
      }

      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to submit inquiry')
      }

      setSuccess(true)

      // Redirect after short delay
      setTimeout(() => {
        navigate('/user/inquiries')
      }, 1800)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="bg-white rounded-2xl border p-10 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Inquiry Submitted!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Thank you. We have received your interest and will contact you soon.
          </p>
          <p className="text-xs text-slate-400">Redirecting to My Inquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/user/homes"
          className="text-sm text-blue-600 hover:underline mb-3 inline-block"
        >
          ← Back to Browse Homes
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">I am Interested</h1>
        <p className="text-sm text-slate-500 mt-1">
          Fill in your details and we’ll get back to you about this home.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border p-6 shadow-sm space-y-5"
      >
        {/* Selected Home */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Home
          </label>
          {loadingHomes ? (
            <div className="text-sm text-slate-400">Loading homes...</div>
          ) : (
            <select
              name="home_id"
              value={form.home_id}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2.5 text-sm bg-slate-50"
            >
              <option value="">Select a home</option>
              {homes.map((home) => (
                <option key={home.id} value={home.id}>
                  {home.title || home.house_name || `Home #${home.id}`}
                </option>
              ))}
            </select>
          )}
          {selectedHome && (
            <p className="mt-1.5 text-xs text-slate-500">
              {selectedHome.type && `${selectedHome.type} · `}
              {selectedHome.location}
            </p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full Name *
          </label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2.5 text-sm"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2.5 text-sm"
            placeholder="you@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2.5 text-sm"
            placeholder="Optional"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Message / Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded-xl px-3 py-2.5 text-sm"
            placeholder="Tell us more about what you're looking for, preferred move-in date, questions, etc."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            to="/user/homes"
            className="flex-1 text-center px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Interest'}
          </button>
        </div>
      </form>
    </div>
  )
}