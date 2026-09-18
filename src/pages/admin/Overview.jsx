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

        // Fetch concurrently using Promise.allSettled to prevent single-endpoint blockage
        const [homesRes, leadsRes, usersRes] = await Promise.allSettled([
          api.get('/homes'),
          api.get('/leads'),
          api.get('/users'),
        ])

        // Robust extractor for Laravel responses (handles plain arrays + paginated objects)
        const parseResponse = (res) => {
          if (res.status !== 'fulfilled' || !res.value?.data) {
            return { list: [], total: 0 }
          }

          const raw = res.value.data

          // Case 1: Direct Array -> res.data = [...]
          if (Array.isArray(raw)) {
            return { list: raw, total: raw.length }
          }

          // Case 2: Standard Laravel Wrapper -> res.data = { data: [...] }
          if (Array.isArray(raw.data)) {
            return { list: raw.data, total: typeof raw.total === 'number' ? raw.total : raw.data.length }
          }

          // Case 3: Paginated with Custom Payload -> res.data = { data: { data: [...], total: X } }
          if (Array.isArray(raw.data?.data)) {
            return { 
              list: raw.data.data, 
              total: typeof raw.data.total === 'number' ? raw.data.total : raw.data.data.length 
            }
          }

          return { list: [], total: 0 }
        }

        const homes = parseResponse(homesRes)
        const leads = parseResponse(leadsRes)
        const users = parseResponse(usersRes)

        // Calculate new leads count safely
        const newLeadsCount = leads.list.filter(
          (l) => (l.status || 'new').toLowerCase() === 'new'
        ).length

        setStats({
          totalHomes: homes.total,
          newLeads: newLeadsCount,
          appointments: leads.total,
          users: users.total,
        })

        // Sort and select 5 most recent leads
        const sortedLeads = [...leads.list]
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          .slice(0, 5)

        setRecentLeads(sortedLeads)
      } catch (err) {
        console.error('Failed to load overview data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? '—'
      : date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
  }

  const getStatusBadge = (status) => {
    const s = (status || 'new').toLowerCase()
    if (s === 'new') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    if (s === 'contacted') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    if (s === 'closed') return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 space-y-6">
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-slate-800 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 space-y-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-400">Total Homes</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalHomes}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-400">New Leads</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{stats.newLeads}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-400">Appointments</p>
          <p className="text-3xl font-bold text-blue-500 mt-1">{stats.appointments}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-400">Users</p>
          <p className="text-3xl font-bold text-emerald-500 mt-1">{stats.users}</p>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">Recent Leads</h2>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No leads yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-300">Name</th>
                  <th className="px-5 py-3 font-semibold text-slate-300">Home</th>
                  <th className="px-5 py-3 font-semibold text-slate-300">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">{lead.name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {lead.home?.title || (lead.home_id ? `Home #${lead.home_id}` : '—')}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
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
          </div>
        )}
      </div>
    </div>
  )
}