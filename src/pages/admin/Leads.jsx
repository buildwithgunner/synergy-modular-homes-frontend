import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all | contact | inquiry

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError('')

      const token = localStorage.getItem('token')

      const res = await fetch(`${API_BASE}/leads`, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!res.ok) throw new Error('Failed to load leads')

      const data = await res.json()
      setLeads(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(`${API_BASE}/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      // Refresh list
      await fetchLeads()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Could not update status')
    }
  }

  const filteredLeads =
    filter === 'all'
      ? leads
      : leads.filter((lead) => (lead.type || 'inquiry') === filter)

  const statusClass = (status) => {
    if (status === 'new') return 'bg-amber-100 text-amber-700'
    if (status === 'contacted') return 'bg-blue-100 text-blue-700'
    if (status === 'closed') return 'bg-slate-100 text-slate-600'
    return 'bg-slate-100 text-slate-600'
  }

  const typeBadge = (type) => {
    if (type === 'contact') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Contact
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        Inquiry
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads & Inquiries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Contact form messages and home inquiries
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'contact', 'inquiry'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filter === item
                  ? 'bg-red-600 text-white'
                  : 'bg-white border text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
          Loading leads...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-5 text-sm">
          {error}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center text-slate-500">
          No leads found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Contact
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Type
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Home
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Message
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="text-right px-5 py-3.5 font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {lead.name || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <div className="space-y-0.5">
                        {lead.email && <p>{lead.email}</p>}
                        {lead.phone && (
                          <p className="text-xs text-slate-400">{lead.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">{typeBadge(lead.type)}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {lead.home?.title || (lead.home_id ? `#${lead.home_id}` : '—')}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2">{lead.notes || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClass(
                          lead.status
                        )}`}
                      >
                        {lead.status || 'new'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="border rounded-lg px-2 py-1.5 text-xs bg-white"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
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