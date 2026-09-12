import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        setError('')

        const savedUser = localStorage.getItem('user')
        const user = savedUser ? JSON.parse(savedUser) : null
        const token = localStorage.getItem('token')

        const res = await fetch(`${API_BASE}/leads`, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        if (!res.ok) throw new Error('Failed to load appointments')

        let leads = await res.json()
        if (!Array.isArray(leads)) leads = []

        // Only appointment-type leads
        let myAppointments = leads.filter(
          (lead) => (lead.type || '').toLowerCase() === 'appointment'
        )

        // Filter by logged-in user email
        if (user?.email) {
          myAppointments = myAppointments.filter(
            (lead) =>
              lead.email?.toLowerCase() === user.email.toLowerCase()
          )
        }

        const mapped = myAppointments.map((lead) => ({
          id: lead.id,
          type: lead.notes?.includes('Virtual')
            ? 'Virtual Tour'
            : lead.notes?.includes('Site')
            ? 'Site Visit'
            : 'Appointment',
          home: lead.home?.title || 'General Appointment',
          homeId: lead.home_id || lead.home?.id || null,
          date: lead.created_at
            ? new Date(lead.created_at).toLocaleDateString()
            : '—',
          time: lead.created_at
            ? new Date(lead.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—',
          status: formatStatus(lead.status),
          notes: lead.notes || '',
        }))

        setAppointments(mapped)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Could not load appointments')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const formatStatus = (status) => {
    if (!status) return 'Pending'
    const s = status.toLowerCase()
    if (s === 'new') return 'Pending'
    if (s === 'contacted') return 'Confirmed'
    if (s === 'closed') return 'Completed'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const statusClass = (status) => {
    if (status === 'Confirmed') return 'bg-emerald-100 text-emerald-700'
    if (status === 'Pending') return 'bg-amber-100 text-amber-700'
    if (status === 'Completed') return 'bg-slate-100 text-slate-600'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Site visits and virtual tours you’ve requested
          </p>
        </div>
        <Link
          to="/book-appointment"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Book Appointment
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
          Loading appointments...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-5 text-sm">
          {error}
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
            📅
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            No appointments yet
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Book a site visit or virtual tour and it will appear here.
          </p>
          <Link
            to="/book-appointment"
            className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Book Appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-slate-900">{item.type}</p>
                <p className="text-sm text-slate-600 mt-1">{item.home}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {item.date} · {item.time}
                </p>
                {item.notes && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {item.notes}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 self-start">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
                {item.homeId && (
                  <Link
                    to={`/user/homes/${item.homeId}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View Home
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}