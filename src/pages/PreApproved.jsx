import Header from '../components/Header'
import { useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function PreApproved() {
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    dob: '',
    ssn: '',
    email: '',
    cell_phone: '',
    credit_score: '',
    purchasing_method: '',
    co_applicant: 'no',
    how_soon: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    years_at_address: '',
    housing_situation: '',
    rent_or_mortgage: '',
    proof_of_income: [],
    form_of_payment_1: '',
    form_of_payment_2: '',
    income_before_tax: '',
    pay_frequency: '',
    overtime_amount: '',
    preferred_bedrooms: '',
    preferred_home_size: '',
    down_payment: '',
    monthly_budget: '',
    signature: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      setForm((prev) => {
        const current = prev.proof_of_income || []
        if (checked) {
          return { ...prev, proof_of_income: [...current, value] }
        } else {
          return { ...prev, proof_of_income: current.filter((item) => item !== value) }
        }
      })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await axios.post(`${API_BASE}/pre-approvals`, form)
      setSubmitted(true)
    } catch (err) {
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="bg-white p-10 rounded-2xl shadow">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-3">Application Submitted!</h1>
            <p className="text-slate-600">
              Thank you. Our financing team will review your information and contact you shortly.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Get Pre-Approved</h1>
          <p className="text-slate-600">
            Fill out the form below. All fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-10 space-y-10">

          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-bold mb-5 border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input type="text" name="first_name" required value={form.first_name} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Middle Name</label>
                <input type="text" name="middle_name" value={form.middle_name} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name *</label>
                <input type="text" name="last_name" required value={form.last_name} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <input type="date" name="dob" required value={form.dob} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Social Security Number *</label>
                <input type="text" name="ssn" required placeholder="XXX-XX-XXXX" value={form.ssn} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" name="email" required value={form.email} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cell Phone *</label>
                <input type="tel" name="cell_phone" required value={form.cell_phone} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Credit & Purchase */}
          <div>
            <h2 className="text-xl font-bold mb-5 border-b pb-2">Credit & Purchase Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Estimated Credit Score</label>
                <select name="credit_score" value={form.credit_score} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="">Select...</option>
                  <option value="300-579">300 – 579 (Poor)</option>
                  <option value="580-669">580 – 669 (Fair)</option>
                  <option value="670-739">670 – 739 (Good)</option>
                  <option value="740-799">740 – 799 (Very Good)</option>
                  <option value="800-850">800 – 850 (Excellent)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purchasing Method *</label>
                <select name="purchasing_method" required value={form.purchasing_method} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="">Select...</option>
                  <option value="financing">Financing</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1">Do you have a Co-Applicant?</label>
                <select name="co_applicant" value={form.co_applicant} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">How soon do you want the house?</label>
                <select name="how_soon" value={form.how_soon} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="">Select...</option>
                  <option value="asap">As soon as possible</option>
                  <option value="1-3 months">1 – 3 months</option>
                  <option value="3-6 months">3 – 6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div>
            <h2 className="text-xl font-bold mb-5 border-b pb-2">Current Address</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Street Address *</label>
                <input type="text" name="address" required value={form.address} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input type="text" name="city" required value={form.city} onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input type="text" name="state" required value={form.state} onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code *</label>
                  <input type="text" name="zip" required value={form.zip} onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Years at this Address</label>
                  <input type="number" name="years_at_address" value={form.years_at_address} onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Housing Situation</label>
                  <select name="housing_situation" value={form.housing_situation} onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                    <option value="">Select...</option>
                    <option value="rent">Renting</option>
                    <option value="own">Own</option>
                    <option value="family">Living with Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Rent or Mortgage Payment ($)</label>
                <input type="number" name="rent_or_mortgage" value={form.rent_or_mortgage} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Income & Employment */}
          <div>
            <h2 className="text-xl font-bold mb-5 border-b pb-2">Income & Employment</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Proof of Income (select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['W2', '1099', 'Cash', 'Bank Statements', '401k / IRA', 'Savings'].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={item}
                      checked={form.proof_of_income.includes(item)}
                      onChange={handleChange}
                      className="rounded"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Form of Payment 1</label>
                <input type="text" name="form_of_payment_1" value={form.form_of_payment_1} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Form of Payment 2</label>
                <input type="text" name="form_of_payment_2" value={form.form_of_payment_2} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1">Income Before Tax ($)</label>
                <input type="number" name="income_before_tax" value={form.income_before_tax} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pay Frequency</label>
                <select name="pay_frequency" value={form.pay_frequency} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="">Select...</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="semi-monthly">Semi-Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Overtime Amount ($)</label>
                <input type="number" name="overtime_amount" value={form.overtime_amount} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Home Preferences */}
          <div>
            <h2 className="text-xl font-bold mb-5 border-b pb-2">Home Preferences & Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Bedroom Count</label>
                <select name="preferred_bedrooms" value={form.preferred_bedrooms} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="">Select...</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Home Size</label>
                <select name="preferred_home_size" value={form.preferred_home_size} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none">
                  <option value="">Select...</option>
                  <option value="single-wide">Single-Wide</option>
                  <option value="double-wide">Double-Wide</option>
                  <option value="triple-wide">Triple-Wide</option>
                  <option value="modular">Modular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1">Available Down Payment ($)</label>
                <input type="number" name="down_payment" value={form.down_payment} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Payment Budget ($)</label>
                <input type="number" name="monthly_budget" value={form.monthly_budget} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Signature */}
          <div>
            <h2 className="text-xl font-bold mb-5 border-b pb-2">Signature</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Type your full name as signature *</label>
              <input
                type="text"
                name="signature"
                required
                placeholder="Type your full legal name"
                value={form.signature}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                By typing your name, you confirm that the information provided is accurate.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition text-lg"
          >
            {submitting ? 'Submitting Application...' : 'Submit Pre-Approval Application'}
          </button>
        </form>
      </section>
    </div>
  )
}