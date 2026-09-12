import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import OtpInput from '../../../components/OtpInput'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          type: 'register',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP')

      setSuccessMsg('OTP sent to your email. Please check your inbox.')
      setStep(2)
    } catch (err) {
      setError(err.message || 'Could not send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      const verifyRes = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          otp,
        }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(verifyData.message || 'Invalid or expired OTP')

      const registerRes = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(form),
      })

      const registerData = await registerRes.json()
      if (!registerRes.ok) throw new Error(registerData.message || 'Registration failed')

      if (registerData.token) {
        localStorage.setItem('token', registerData.token)
        localStorage.setItem('user', JSON.stringify(registerData.user || {}))
        localStorage.setItem('role', 'user')
      }

      const params = new URLSearchParams(window.location.search)
      const redirectTo = params.get('redirect') || '/user/dashboard'
      navigate(redirectTo)
    } catch (err) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    setLoading(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          type: 'register',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP')
      setSuccessMsg('A new OTP has been sent to your email.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Header />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="/synergylogo.jpeg"
              alt="Synergy Modular Homes"
              className="h-16 mx-auto mb-4 object-contain"
            />
            <h1 className="text-2xl font-bold text-[#0B1C33]">
              {step === 1 ? 'Create Account' : 'Verify Your Email'}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {step === 1
                ? 'Join Synergy Modular Homes today'
                : `We sent a 6-digit code to ${form.email}`}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-xl">
                {successMsg}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    required
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#B87333] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1C33] hover:bg-[#B87333] text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60 mt-2"
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <OtpInput length={6} onComplete={(value) => setOtp(value)} disabled={loading} />

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#0B1C33] hover:bg-[#B87333] text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>

                <div className="text-center text-sm text-slate-500">
                  Didn’t receive the code?{' '}
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={loading}
                    className="text-[#B87333] font-semibold hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setOtp('')
                    setError('')
                    setSuccessMsg('')
                  }}
                  className="w-full text-sm text-slate-500 hover:text-[#0B1C33]"
                >
                  ← Back to form
                </button>
              </form>
            )}

            {step === 1 && (
              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{' '}
                <Link to="/user/login" className="text-[#B87333] font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}