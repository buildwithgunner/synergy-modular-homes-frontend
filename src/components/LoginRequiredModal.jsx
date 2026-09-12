import { Link } from 'react-router-dom'

export default function LoginRequiredModal({
  isOpen,
  onClose,
  title = 'Account Required',
  redirectTo = '/pre-approved',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1C33]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-14 h-14 bg-[#F8F7F4] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#B87333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-[#0B1C33] mb-2">{title}</h3>
          <p className="text-slate-600 text-sm mb-8">
            You need an account to continue. It only takes a minute to create one.
          </p>

          <div className="space-y-3">
            <Link
              to={`/user/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="block w-full bg-[#0B1C33] hover:bg-[#B87333] text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Log In
            </Link>
            <Link
              to={`/user/register?redirect=${encodeURIComponent(redirectTo)}`}
              className="block w-full border border-slate-200 text-[#0B1C33] font-semibold py-3.5 rounded-xl hover:border-[#B87333] hover:text-[#B87333] transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}