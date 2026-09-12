import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../../utils/image'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function BrowseHomes() {
  const [homes, setHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savedIds, setSavedIds] = useState(new Set())
  const [savingId, setSavingId] = useState(null)

  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await fetch(`${API_BASE}/homes`, {
          headers: { Accept: 'application/json' },
        })

        if (!res.ok) throw new Error('Failed to load homes')

        const data = await res.json()
        setHomes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError(err.message || 'Could not load homes')
      } finally {
        setLoading(false)
      }
    }

    fetchHomes()
  }, [])

  // Load saved homes so hearts show correct state
  useEffect(() => {
    const loadSaved = async () => {
      const token = getToken()
      if (!token) return

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
        setSavedIds(new Set(list.map((h) => String(h.id))))
      } catch (err) {
        console.error(err)
      }
    }

    loadSaved()
  }, [])

  const toggleSave = async (homeId, e) => {
    e.preventDefault()
    e.stopPropagation()

    const token = getToken()
    if (!token) {
      alert('Please log in to save homes')
      return
    }

    const idStr = String(homeId)
    const alreadySaved = savedIds.has(idStr)

    setSavingId(homeId)

    try {
      if (alreadySaved) {
        const res = await fetch(`${API_BASE}/saved-homes/${homeId}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to remove from saved')
        setSavedIds((prev) => {
          const next = new Set(prev)
          next.delete(idStr)
          return next
        })
      } else {
        const res = await fetch(`${API_BASE}/saved-homes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ home_id: Number(homeId) }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message || 'Failed to save home')
        }
        setSavedIds((prev) => new Set(prev).add(idStr))
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Could not update saved homes')
    } finally {
      setSavingId(null)
    }
  }

  const formatPrice = (home) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Browse Homes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore available homes and submit an inquiry
          </p>
        </div>
        <Link
          to="/user/inquiries"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          ← Back to My Inquiries
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
          Loading homes...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-5 text-sm">
          {error}
        </div>
      ) : homes.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            No homes available
          </h2>
          <p className="text-sm text-slate-500">
            Check back later for new listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {homes.map((home) => {
            const isSaved = savedIds.has(String(home.id))
            const isSaving = savingId === home.id

            return (
              <div
                key={home.id}
                className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image + Heart */}
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={
                      getImageUrl(home.image) ||
                      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
                    }
                    alt={home.title || 'Home'}
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => toggleSave(home.id, e)}
                    disabled={isSaving}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center hover:bg-white transition disabled:opacity-60"
                    title={isSaved ? 'Remove from saved' : 'Save home'}
                  >
                    <svg
                      className={`w-5 h-5 ${
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

                {/* Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {home.title || 'Untitled Home'}
                    </h3>
                    {home.status && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                          home.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : home.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {home.status}
                      </span>
                    )}
                  </div>

                  {home.house_name && (
                    <p className="text-sm text-slate-500 mb-2">{home.house_name}</p>
                  )}

                  <p className="text-lg font-bold text-slate-900 mb-2">
                    {formatPrice(home)}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-4">
                    {(home.beds || home.baths) && (
                      <span>
                        {home.beds || 0} bed · {home.baths || 0} bath
                      </span>
                    )}
                    {formatArea(home.living_area_min, home.living_area_max) && (
                      <span>
                        Living:{' '}
                        {formatArea(home.living_area_min, home.living_area_max)}
                      </span>
                    )}
                    {home.location && <span>{home.location}</span>}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/user/homes/${home.id}`}
                      className="flex-1 text-center px-3 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      I&apos;m Interested
                    </Link>
                    <Link
                      to={`/user/homes/${home.id}`}
                      className="px-3 py-2.5 rounded-xl border text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}