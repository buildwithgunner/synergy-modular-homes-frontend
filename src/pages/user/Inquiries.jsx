import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInquiries = async () => {
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

        if (!res.ok) throw new Error('Failed to load inquiries')

        let leads = await res.json()
        if (!Array.isArray(leads)) leads = []

        // Keep only inquiry-type leads
        let myLeads = leads.filter(
          (lead) => !lead.type || lead.type === 'inquiry'
        )

        // Filter by logged-in user email if available
        if (user?.email) {
          myLeads = myLeads.filter(
            (lead) =>
              lead.email?.toLowerCase() === user.email.toLowerCase()
          )
        }

        const mapped = myLeads.map((lead) => ({
          id: lead.id,
          home: lead.home?.title || 'General Inquiry',
          homeId: lead.home_id || lead.home?.id || null,
          price: lead.home?.price || lead.home?.price_min || null,
          date: lead.created_at
            ? new Date(lead.created_at).toLocaleDateString()
            : '-',
          status: formatStatus(lead.status),
          notes: lead.notes || '',
        }))

        setInquiries(mapped)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Could not load inquiries')
      } finally {
        setLoading(false)
      }
    }

    fetchInquiries()
  }, [])

  const formatStatus = (status) => {
    if (!status) return 'Pending'
    const s = status.toLowerCase()
    if (s === 'new') return 'Pending'
    if (s === 'contacted') return 'Contacted'
    if (s === 'closed') return 'Closed'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const statusClass = (status) => {
    if (status === 'Pending') return 'bg-amber-100 text-amber-700'
    if (status === 'Contacted') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Inquiries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track homes you have shown interest in
          </p>
        </div>
        <Link
          to="/user/homes"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Browse Homes
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
          Loading inquiries...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-5 text-sm">
          {error}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
            📩
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            No inquiries yet
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            When you submit interest on a home, it will appear here.
          </p>
          <Link
            to="/user/homes"
            className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Explore Homes
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Home
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Price
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{item.home}</p>
                      {item.notes && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                          {item.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {item.price
                        ? `$${Number(item.price).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{item.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {item.homeId ? (
                        <Link
                          to={`/homes/${item.homeId}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </Link>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y">
            {inquiries.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{item.home}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm font-medium text-slate-800">
                    {item.price
                      ? `$${Number(item.price).toLocaleString()}`
                      : 'Price N/A'}
                  </p>
                  {item.homeId && (
                    <Link
                      to={`/homes/${item.homeId}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      View Home
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}