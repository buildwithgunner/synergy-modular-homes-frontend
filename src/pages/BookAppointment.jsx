import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function BookAppointment() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    type: 'in-person',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser)
        setIsLoggedIn(true)
        setForm((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }))
      } catch {
        // ignore
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const appointmentType =
        form.type === 'virtual' ? 'Virtual Walkthrough' : 'In-Person Tour'

      const notesParts = [
        `Appointment Type: ${appointmentType}`,
        form.date ? `Preferred Date: ${form.date}` : null,
        form.time ? `Preferred Time: ${form.time}` : null,
        form.notes?.trim() ? `Notes: ${form.notes.trim()}` : null,
      ].filter(Boolean)

      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim() || '',
          email: form.email.trim() || null,
          notes: notesParts.join('\n'),
          type: 'appointment',
          status: 'new',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Failed to book appointment')
      }

      setSubmitted(true)
      setForm({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        type: 'in-person',
        notes: '',
      })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          type="button"
          onClick={() =>
            isLoggedIn ? navigate('/user/appointments') : navigate(-1)
          }
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition group"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </span>
          {isLoggedIn ? 'Back to My Appointments' : 'Back'}
        </button>

        {submitted ? (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
              ✓
            </div>
            <h1 className="text-3xl font-bold text-[#0B1C33] mb-3">
              Appointment Requested!
            </h1>
            <p className="text-slate-600 mb-8">
              Thank you. One of our specialists will contact you shortly to
              confirm your appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigate('/user/appointments')}
                  className="px-6 py-3 rounded-xl bg-[#0B1C33] hover:bg-[#B87333] text-white font-medium transition"
                >
                  View My Appointments
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-white transition"
                >
                  ← Go Back
                </button>
              )}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-white transition"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C33] leading-tight mb-4">
                  Book Your Appointment
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  Schedule an in-person tour or a virtual walkthrough with one
                  of our home specialists. We’re here to help you find the
                  perfect home.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0B1C33] text-[#C9A66B] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1C33]">Phone</p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      (563) 571-04448
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0B1C33] text-[#C9A66B] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1C33]">Email</p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      info@api.synergymodularhomes.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0B1C33] text-[#C9A66B] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1C33]">Hours</p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Mon – Sat: 9:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0B1C33] rounded-2xl p-6 text-white">
                <p className="font-semibold mb-1">Prefer to talk now?</p>
                <p className="text-slate-300 text-sm mb-4">
                  Call us directly and we’ll assist you right away.
                </p>
                <a
                  href="tel:56357104448"
                  className="inline-flex items-center gap-2 bg-[#C9A66B] text-[#0B1C33] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#B87333] hover:text-white transition"
                >
                  Call (563) 571-04448
                </a>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5"
              >
                <h2 className="text-xl font-bold text-[#0B1C33] mb-1">
                  Request an Appointment
                </h2>
                <p className="text-sm text-slate-500 mb-2">
                  Fill in the details below and we’ll get back to you.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition"
                      placeholder="(563) 571-04448"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Appointment Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'in-person' })}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition ${
                        form.type === 'in-person'
                          ? 'border-[#0B1C33] bg-[#0B1C33] text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      In-Person Tour
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, type: 'virtual' })}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition ${
                        form.type === 'virtual'
                          ? 'border-[#0B1C33] bg-[#0B1C33] text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Virtual Walkthrough
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Preferred Time
                    </label>
                    <select
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition"
                    >
                      <option value="">Select time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    rows="3"
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] focus:border-transparent outline-none transition resize-none"
                    placeholder="Any specific homes you're interested in or questions..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0B1C33] hover:bg-[#B87333] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition text-base"
                >
                  {submitting ? 'Submitting...' : 'Book Appointment'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}