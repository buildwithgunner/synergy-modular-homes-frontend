import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function SaveHomeButton({ homeId, className = '' }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const canSave = token && role !== 'admin'

  useEffect(() => {
    const checkSaved = async () => {
      if (!canSave || !homeId) return
      try {
        const res = await fetch(`${API_BASE}/saved-homes/check/${homeId}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) return
        const data = await res.json()
        setSaved(Boolean(data.saved))
      } catch (err) {
        console.error(err)
      }
    }
    checkSaved()
  }, [homeId, canSave, token])

  const handleToggle = async () => {
    if (!token || role === 'admin') {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      if (saved) {
        const res = await fetch(`${API_BASE}/saved-homes/${homeId}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Failed to unsave')
        setSaved(false)
      } else {
        const res = await fetch(`${API_BASE}/saved-homes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ home_id: homeId }),
        })
        if (!res.ok) throw new Error('Failed to save')
        setSaved(true)
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={
        className ||
        `inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition ${
          saved
            ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
        }`
      }
      title={saved ? 'Remove from saved' : 'Save home'}
    >
      <svg
        className="w-4 h-4"
        fill={saved ? 'currentColor' : 'none'}
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
      {loading ? '...' : saved ? 'Saved' : 'Save'}
    </button>
  )
}