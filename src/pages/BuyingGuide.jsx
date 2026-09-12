import Header from '../components/Header'
import { useState } from 'react'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function BuyingGuide() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    placement_location: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post(`${API_BASE}/leads`, {
        ...form,
        type: 'buying_guide',
      })
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '', placement_location: '' })
    } catch (err) {
      alert('Failed to send. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
          Home Buying Guide
        </h1>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Everything you need to know about purchasing your mobile or manufactured home in 3 simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <span className="text-blue-600 font-black text-2xl mb-3 block">01</span>
            <h3 className="font-bold text-xl mb-3">Select Your Model</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Choose between single-wide or double-wide layouts depending on your budget and space requirements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <span className="text-blue-600 font-black text-2xl mb-3 block">02</span>
            <h3 className="font-bold text-xl mb-3">Get Financing Options</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Apply for quick pre-approval to understand your financing terms and monthly payments.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            <span className="text-blue-600 font-black text-2xl mb-3 block">03</span>
            <h3 className="font-bold text-xl mb-3">Move In</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Finalize paperwork, schedule delivery or walkthrough, and get the keys to your new home.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Have Questions About Buying?</h2>

          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-xl font-bold">Message Sent!</h3>
              <p className="text-slate-600 mt-2">We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Where are you placing the home? *</label>
                <input
                  type="text"
                  required
                  placeholder="City, State or Park name"
                  value={form.placement_location}
                  onChange={(e) => setForm({ ...form, placement_location: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  rows="4"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}