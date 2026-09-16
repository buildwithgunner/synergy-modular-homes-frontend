import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function AdminPreApprovals() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchPreApprovals()
  }, [])

  const fetchPreApprovals = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token')
      const res = await axios.get(`${API_BASE}/pre-approvals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Handle both standard arrays and paginated data responses
      const data = Array.isArray(res.data) ? res.data : (res.data.data || [])
      setApps(data)
    } catch (err) {
      console.error('Error fetching pre-approvals:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pre-Approval Applications</h1>
          <p className="text-sm text-slate-500">View and manage full pre-approval financial details</p>
        </div>
        <button 
          onClick={fetchPreApprovals}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading pre-approvals...</div>
      ) : apps.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-500 border">
          No pre-approval applications received yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Credit Score</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {apps.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {item.first_name} {item.last_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{item.email}</div>
                    <div className="text-xs text-slate-400">{item.cell_phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {item.credit_score || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    ${item.monthly_budget ? Number(item.monthly_budget).toLocaleString() : '0'}/mo
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 capitalize">
                    {item.how_soon || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedApp(item)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {selectedApp.first_name} {selectedApp.middle_name ? selectedApp.middle_name + ' ' : ''}{selectedApp.last_name}
                </h2>
                <p className="text-xs text-slate-500">Submitted on {new Date(selectedApp.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Personal & Contact Info</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
                <div><span className="block text-xs text-slate-400">Date of Birth:</span> {selectedApp.dob || 'N/A'}</div>
                <div><span className="block text-xs text-slate-400">SSN:</span> {selectedApp.ssn || 'N/A'}</div>
                <div><span className="block text-xs text-slate-400">Cell Phone:</span> {selectedApp.cell_phone}</div>
                <div><span className="block text-xs text-slate-400">Email:</span> {selectedApp.email}</div>
                <div><span className="block text-xs text-slate-400">Co-Applicant:</span> <span className="capitalize">{selectedApp.co_applicant}</span></div>
                <div><span className="block text-xs text-slate-400">How Soon:</span> <span className="capitalize">{selectedApp.how_soon}</span></div>
              </div>
            </div>

            {/* Current Address */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Current Address & Housing</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
                <div className="col-span-2 sm:col-span-3">
                  <span className="block text-xs text-slate-400">Street Address:</span>
                  {selectedApp.address}, {selectedApp.city}, {selectedApp.state} {selectedApp.zip}
                </div>
                <div><span className="block text-xs text-slate-400">Years at Address:</span> {selectedApp.years_at_address || 'N/A'}</div>
                <div><span className="block text-xs text-slate-400">Housing Situation:</span> <span className="capitalize">{selectedApp.housing_situation || 'N/A'}</span></div>
                <div><span className="block text-xs text-slate-400">Current Payment:</span> ${selectedApp.rent_or_mortgage || '0'}/mo</div>
              </div>
            </div>

            {/* Employment & Income */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Income & Employment</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
                <div className="col-span-2 sm:col-span-3">
                  <span className="block text-xs text-slate-400">Proof of Income Provided:</span>
                  {Array.isArray(selectedApp.proof_of_income) 
                    ? selectedApp.proof_of_income.join(', ') 
                    : (selectedApp.proof_of_income || 'None selected')}
                </div>
                <div><span className="block text-xs text-slate-400">Income (Before Tax):</span> ${selectedApp.income_before_tax || '0'}</div>
                <div><span className="block text-xs text-slate-400">Pay Frequency:</span> <span className="capitalize">{selectedApp.pay_frequency || 'N/A'}</span></div>
                <div><span className="block text-xs text-slate-400">Overtime Amount:</span> ${selectedApp.overtime_amount || '0'}</div>
                <div><span className="block text-xs text-slate-400">Payment Form 1:</span> {selectedApp.form_of_payment_1 || 'N/A'}</div>
                <div><span className="block text-xs text-slate-400">Payment Form 2:</span> {selectedApp.form_of_payment_2 || 'N/A'}</div>
              </div>
            </div>

            {/* Home Preferences & Budget */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Preferences & Budget</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-sm">
                <div><span className="block text-xs text-slate-400">Credit Score:</span> {selectedApp.credit_score || 'N/A'}</div>
                <div><span className="block text-xs text-slate-400">Purchase Method:</span> <span className="capitalize">{selectedApp.purchasing_method || 'N/A'}</span></div>
                <div><span className="block text-xs text-slate-400">Bedrooms:</span> {selectedApp.preferred_bedrooms || 'N/A'}</div>
                <div><span className="block text-xs text-slate-400">Home Size:</span> <span className="capitalize">{selectedApp.preferred_home_size || 'N/A'}</span></div>
                <div><span className="block text-xs text-slate-400">Down Payment:</span> ${selectedApp.down_payment || '0'}</div>
                <div><span className="block text-xs text-slate-400">Monthly Budget:</span> ${selectedApp.monthly_budget || '0'}</div>
              </div>
            </div>

            {/* Signature */}
            <div className="border-t pt-4 flex justify-between items-center text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Digital Signature:</span>
                <span className="font-serif italic text-base text-slate-800">{selectedApp.signature}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}