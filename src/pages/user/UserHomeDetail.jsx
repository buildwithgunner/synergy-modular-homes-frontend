import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/image'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function UserHomeDetail() {
  const { id } = useParams()
  const [home, setHome] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${API_BASE}/homes/${id}`, {
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('Home not found')
        const data = await res.json()
        setHome(data)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Could not load home')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchHome()
  }, [id])

  // Check if this home is already saved
  useEffect(() => {
    const checkSaved = async () => {
      const token = getToken()
      if (!token || !id) return

      try {
        const res = await fetch(`${API_BASE}/saved-homes`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) return
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        setIsSaved(list.some((h) => String(h.id) === String(id)))
      } catch (err) {
        console.error(err)
      }
    }

    checkSaved()
  }, [id])

  const toggleSave = async () => {
    const token = getToken()
    if (!token) {
      alert('Please log in to save homes')
      return
    }

    setSaving(true)
    try {
      if (isSaved) {
        // Remove from saved
        const res = await fetch(`${API_BASE}/saved-homes/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to remove from saved')
        setIsSaved(false)
      } else {
        // Add to saved
        const res = await fetch(`${API_BASE}/saved-homes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ home_id: Number(id) }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message || 'Failed to save home')
        }
        setIsSaved(true)
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Could not update saved homes')
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (home) => {
    if (!home) return ''
    const min = home.price_min ?? home.price
    const max = home.price_max
    const currency = home.currency === 'GBP' ? '£' : '$'

    if (min == null && max == null) return 'Price on request'
    if (max != null && Number(min) !== Number(max)) {
      return `${currency}${Number(min).toLocaleString()} – ${currency}${Number(max).toLocaleString()}`
    }
    return `${currency}${Number(min).toLocaleString()}`
  }

  const formatArea = (min, max) => {
    if (min == null && max == null) return null
    if (max != null && Number(min) !== Number(max)) {
      return `${Number(min).toLocaleString()} – ${Number(max).toLocaleString()} sq ft`
    }
    return `${Number(min).toLocaleString()} sq ft`
  }

  const handleInquiry = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    setSubmitting(true)
    try {
      const savedUser = localStorage.getItem('user')
      const user = savedUser ? JSON.parse(savedUser) : null
      const token = getToken()

      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          home_id: home.id,
          name: user?.name || 'User',
          email: user?.email || '',
          phone: user?.phone || '',
          notes: message.trim(),
          type: 'inquiry',
          status: 'new',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Failed to submit inquiry')
      }

      setSuccess(true)
      setMessage('')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Could not submit inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
        Loading home details...
      </div>
    )
  }

  if (error || !home) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-5 text-sm">
          {error || 'Home not found'}
        </div>
        <Link
          to="/user/homes"
          className="inline-flex px-4 py-2.5 rounded-xl border text-sm font-medium hover:bg-slate-50"
        >
          ← Back to Browse Homes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/user/homes"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Browse Homes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Image + Heart */}
          <div className="bg-white rounded-2xl border overflow-hidden relative">
            <img
              src={
                getImageUrl(home.image) ||
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
              }
              alt={home.title || 'Home'}
              className="w-full h-72 object-cover"
            />

            {/* Heart / Save button */}
            <button
              type="button"
              onClick={toggleSave}
              disabled={saving}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center hover:bg-white transition disabled:opacity-60"
              title={isSaved ? 'Remove from saved' : 'Save home'}
            >
              <svg
                className={`w-6 h-6 ${
                  isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
                }`}
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Gallery */}
          {Array.isArray(home.images) && home.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {home.images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={`Gallery ${i + 1}`}
                  className="h-24 w-full object-cover rounded-xl border"
                />
              ))}
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {home.title || 'Untitled Home'}
                </h1>
                {home.house_name && (
                  <p className="text-slate-500 mt-1">{home.house_name}</p>
                )}
              </div>
              <p className="text-xl font-bold text-slate-900">
                {formatPrice(home)}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-5">
              {(home.beds || home.baths) && (
                <span>
                  {home.beds || 0} Beds · {home.baths || 0} Baths
                </span>
              )}
              {formatArea(home.living_area_min, home.living_area_max) && (
                <span>
                  Living: {formatArea(home.living_area_min, home.living_area_max)}
                </span>
              )}
              {formatArea(
                home.total_covered_area_min,
                home.total_covered_area_max
              ) && (
                <span>
                  Covered:{' '}
                  {formatArea(
                    home.total_covered_area_min,
                    home.total_covered_area_max
                  )}
                </span>
              )}
              {home.location && <span>{home.location}</span>}
              {(home.house_type || home.type) && (
                <span>{home.house_type || home.type}</span>
              )}
            </div>

            {home.description && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  About this home
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {home.description}
                </p>
              </div>
            )}
          </div>

          {/* Specs & Amenities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {home.specs && Object.keys(home.specs).length > 0 && (
              <div className="bg-white rounded-2xl border p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Tech Specs</h3>
                <dl className="space-y-2 text-sm">
                  {Object.entries(home.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-3">
                      <dt className="text-slate-500 capitalize">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="font-medium text-slate-800">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {Array.isArray(home.amenities) && home.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {home.amenities.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Save button (also here for clarity) */}
          <button
            type="button"
            onClick={toggleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`}
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {saving ? 'Updating...' : isSaved ? 'Saved' : 'Save Home'}
          </button>

          {/* I'm Interested */}
          <div className="bg-white rounded-2xl border p-5 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-1">
              I’m Interested
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Send an inquiry and our team will contact you about this home.
            </p>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 text-sm">
                Inquiry submitted successfully! Track it in{' '}
                <Link to="/user/inquiries" className="font-medium underline">
                  My Inquiries
                </Link>
                .
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-3">
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you're looking for or any questions..."
                  className="w-full border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Sending...' : "I'm Interested – Send Inquiry"}
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t">
              <Link
                to="/user/inquiries"
                className="block text-center text-sm text-slate-600 hover:text-slate-900"
              >
                View My Inquiries →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}