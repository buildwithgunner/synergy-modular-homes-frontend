import { useState, useEffect } from 'react'
import api from '../../api/axois'

export default function Overview() {
  const [stats, setStats] = useState({
    totalHomes: 0,
    newLeads: 0,
    appointments: 0,
    users: 0,
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch homes & leads concurrently
        const [homesRes, leadsRes] = await Promise.all([
          api.get('/homes'),
          api.get('/leads')
        ])

        const homes = homesRes.data
        const leads = leadsRes.data

        // Calculate stats
        const newLeadsCount = Array.isArray(leads)
          ? leads.filter((l) => (l.status || '').toLowerCase() === 'new').length
          : 0

        setStats({
          totalHomes: Array.isArray(homes) ? homes.length : 0,
          newLeads: newLeadsCount,
          appointments: 0,
          users: 0,
        })

        // Recent leads (latest 5)
        if (Array.isArray(leads)) {
          const sorted = [...leads]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)

          setRecentLeads(sorted)
        }
      } catch (err) {
        console.error('Failed to load overview data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status) => {
    const s = (status || 'new').toLowerCase()
    if (s === 'new') return 'bg-blue-100 text-blue-700'
    if (s === 'contacted') return 'bg-emerald-100 text-emerald-700'
    if (s === 'closed') return 'bg-slate-100 text-slate-600'
    return 'bg-slate-100 text-slate-600'
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border shadow-sm animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Total Homes</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalHomes}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">New Leads</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats.newLeads}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Appointments</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats.appointments}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-sm text-slate-500">Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{stats.users}</p>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-bold text-slate-900">Recent Leads</h2>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No leads yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Home</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-medium">{lead.name || '—'}</td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {lead.home?.title || (lead.home_id ? `Home #${lead.home_id}` : '—')}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                        lead.status
                      )}`}
                    >
                      {lead.status || 'new'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}