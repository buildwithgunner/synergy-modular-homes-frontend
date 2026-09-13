import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function PreApproval() {
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPreApprovalStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')

      const res = await fetch(`${API_BASE}/pre-approvals/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 404) {
        setApplication(null)
        return
      }

      if (!res.ok) {
        throw new Error('Failed to load application status')
      }

      const data = await res.json()
      // Expecting array or single object response
      const latest = Array.isArray(data) ? data[0] : data
      setApplication(latest || null)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error loading pre-approval details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreApprovalStatus()
  }, [])

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-700'
      case 'under_review':
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  const formatStatusText = (status) => {
    if (!status) return 'Under Review'
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Pre-Approval Status</h1>

      {loading ? (
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
          Loading your application status...
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 rounded-2xl border border-red-200 p-6 mb-6 text-sm">
          {error}
        </div>
      ) : application ? (
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Application Status</h2>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(application.status)}`}>
              {formatStatusText(application.status)}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            {application.status === 'approved'
              ? 'Congratulations! Your pre-approval application has been approved.'
              : application.status === 'rejected'
              ? 'Your pre-approval application was reviewed and could not be approved at this time.'
              : `Your pre-approval application was submitted on ${application.created_at || 'record'}. Our financing team is currently reviewing your information.`}
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Submitted</span>
              <span>{application.created_at ? new Date(application.created_at).toLocaleDateString() : '—'}</span>
            </div>
            {application.estimated_decision && (
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Decision</span>
                <span>{application.estimated_decision}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Reference No.</span>
              <span className="font-mono">{application.reference_no || application.id || '—'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-8 text-center text-slate-500 mb-6">
          You have not submitted a pre-approval application yet.
        </div>
      )}

      <a
        href="/pre-approved"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
      >
        Submit New Application
      </a>
    </div>
  )
}