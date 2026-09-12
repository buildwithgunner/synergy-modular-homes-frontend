export default function PreApproval() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Pre-Approval Status</h1>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Application Status</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
            Under Review
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Your pre-approval application was submitted on August 20, 2026. Our financing team is currently reviewing your information.
        </p>
        <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Submitted</span>
            <span>Aug 20, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Decision</span>
            <span>Aug 27, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Reference No.</span>
            <span className="font-mono">PA-2026-08421</span>
          </div>
        </div>
      </div>

      <a
        href="/pre-approved"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
      >
        Submit New Application
      </a>
    </div>
  )
}