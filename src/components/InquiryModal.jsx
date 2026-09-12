import { useState, useEffect } from 'react'

export default function InquiryModal({ home, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...formData, home_id: home?.id, type: 'inquiry' }),
      })

      if (!res.ok) throw new Error('Submission failed. Please check your details.')
      setSubmitted(true)
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!home) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0B1C33]/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-[#0B1C33]">Inquiry Sent!</h3>
            <p className="text-slate-600 mt-2 text-sm">
              Thanks for inquiring about <strong>{home.title}</strong>. Our team will reach out shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-[#0B1C33] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B87333] transition"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-[#0B1C33]">Inquire About Listing</h3>
            <p className="text-sm text-slate-500 mb-5">{home.title}</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
              />
              <textarea
                rows="3"
                placeholder="Questions or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0B1C33] hover:bg-[#B87333] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}