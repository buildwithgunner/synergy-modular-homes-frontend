import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getImageUrl } from '../../utils/image'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function SavedHomes() {
  const navigate = useNavigate()
  const [homes, setHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const loadSavedHomes = async () => {
      const token = getToken()
      if (!token) {
        setError('Please log in to view saved homes')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const res = await fetch(`${API_BASE}/saved-homes`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.status === 401) {
          setError('Session expired. Please log in again.')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('role')
          return
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || 'Failed to load saved homes')
        }

        const data = await res.json()
        setHomes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError(err.message || 'Could not load saved homes')
      } finally {
        setLoading(false)
      }
    }

    loadSavedHomes()
  }, [])

  const handleRemove = async (homeId) => {
    const confirmed = window.confirm('Remove this home from saved?')
    if (!confirmed) return

    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`${API_BASE}/saved-homes/${homeId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Failed to remove')

      setHomes((prev) => prev.filter((h) => String(h.id) !== String(homeId)))
    } catch (err) {
      alert(err.message || 'Could not remove home')
    }
  }

  const formatPrice = (home) => {
    if (home.price_min && home.price_max) {
      const min = Number(home.price_min).toLocaleString()
      const max = Number(home.price_max).toLocaleString()
      if (Number(home.price_min) === Number(home.price_max)) return `$${min}`
      return `$${min} – $${max}`
    }
    if (home.price) return `$${Number(home.price).toLocaleString()}`
    return 'Price on request'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Homes</h1>
          <p className="text-sm text-slate-500 mt-1">
            Homes you’ve shortlisted for later
          </p>
        </div>
        <Link
          to="/user/homes"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Browse Homes
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
          Loading saved homes...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-5 text-sm">
          {error}
          {(error.toLowerCase().includes('log in') ||
            error.toLowerCase().includes('session')) && (
            <button
              type="button"
              onClick={() => navigate('/user/login')}
              className="block mt-3 text-blue-600 font-medium hover:underline"
            >
              Go to Login
            </button>
          )}
        </div>
      ) : homes.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            No saved homes yet
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Save a home from the listing or detail page and it will appear here.
          </p>
          <Link
            to="/user/homes"
            className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Explore Homes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homes.map((home) => (
            <div
              key={home.id}
              className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={
                    getImageUrl(home.image) ||
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
                  }
                  alt={home.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                  {home.location || 'Location TBD'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 line-clamp-1">
                  {home.title}
                </h3>
                <p className="text-blue-600 font-bold mt-1">
                  {formatPrice(home)}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>{home.beds || 0} beds</span>
                  <span>•</span>
                  <span>{home.baths || 0} baths</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/user/homes/${home.id}`}
                    className="flex-1 text-center bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700 transition"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(home.id)}
                    className="px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}