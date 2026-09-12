import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function Overview() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    inquiries: 0,
    saved: 0,
    appointments: 0,
    preApproval: 'Not Applied',
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUser = localStorage.getItem('user')
        const parsedUser = savedUser ? JSON.parse(savedUser) : null
        setUser(parsedUser)

        const token = localStorage.getItem('token')
        let leads = []

        try {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 4000)

          const res = await fetch(`${API_BASE}/leads`, {
            signal: controller.signal,
            headers: {
              Accept: 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          })
          clearTimeout(timeout)

          if (res.ok) {
            const data = await res.json()
            leads = Array.isArray(data) ? data : []
          }
        } catch (err) {
          console.warn('Leads API failed, continuing with empty data')
        }

        const userEmail = parsedUser?.email?.toLowerCase()
        const myLeads = userEmail
          ? leads.filter((l) => l.email?.toLowerCase() === userEmail)
          : leads

        const inquiries = myLeads.filter((l) => !l.type || l.type === 'inquiry')
        const appointments = myLeads.filter((l) => l.type === 'appointment')
        const preApprovalLeads = myLeads.filter((l) => l.type === 'pre-approval')

        const activity = myLeads.slice(0, 6).map((lead) => {
          const homeTitle = lead.home?.title || 'a home'
          let text = `You inquired about ${homeTitle}`

          if (lead.type === 'appointment') {
            text = `Appointment requested for ${homeTitle}`
          } else if (lead.type === 'pre-approval') {
            text = 'Pre-approval application submitted'
          }

          return {
            text,
            time: lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '',
            color:
              lead.type === 'appointment'
                ? 'bg-violet-500'
                : lead.type === 'pre-approval'
                ? 'bg-amber-500'
                : 'bg-blue-500',
          }
        })

        setStats({
          inquiries: inquiries.length,
          saved: 0,
          appointments: appointments.length,
          preApproval:
            preApprovalLeads.length > 0
              ? preApprovalLeads[0].status === 'new'
                ? 'Under Review'
                : preApprovalLeads[0].status || 'Submitted'
              : 'Not Applied',
        })

        setRecentActivity(activity)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const firstName = user?.name?.split(' ')[0] || 'there'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B87333] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here’s what’s happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            label: 'My Inquiries',
            value: stats.inquiries,
            path: '/user/inquiries',
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            color: 'bg-blue-100 text-blue-700',
          },
          {
            label: 'Saved Homes',
            value: stats.saved,
            path: '/user/saved',
            icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
            color: 'bg-rose-100 text-rose-700',
          },
          {
            label: 'Appointments',
            value: stats.appointments,
            path: '/user/appointments',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'bg-violet-100 text-violet-700',
          },
          {
            label: 'Pre-Approval',
            value: stats.preApproval,
            path: '/user/pre-approval',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            color: 'bg-amber-100 text-amber-700',
            isText: true,
          },
        ].map((card) => (
          <Link
            key={card.label}
            to={card.path}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#B87333]/40 transition-all duration-200 group"
          >
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={card.icon} />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className={`font-bold text-slate-900 mt-1 ${card.isText ? 'text-lg' : 'text-3xl'}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Bottom section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              {
                to: '/user/inquiries',
                label: 'View Inquiries',
                sub: `${stats.inquiries} active`,
                color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
                icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
              },
              {
                to: '/user/saved',
                label: 'Saved Homes',
                sub: `${stats.saved} homes`,
                color: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
                icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
              },
              {
                to: '/user/appointments',
                label: 'Appointments',
                sub: `${stats.appointments} upcoming`,
                color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
              },
              {
                to: '/pre-approved',
                label: 'New Pre-Approval',
                sub: 'Apply now',
                color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${item.color}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-5">Recent Activity</h2>

          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">No recent activity yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition">
                  <div className={`w-2.5 h-2.5 ${item.color} rounded-full mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}