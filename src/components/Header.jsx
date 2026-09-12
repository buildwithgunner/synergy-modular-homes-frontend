import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import LoginRequiredModal from './LoginRequiredModal'

export default function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [homesOpen, setHomesOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [redirectPath, setRedirectPath] = useState('/pre-approved')
  const timeoutRef = useRef(null)

  const openDropdown = () => {
    clearTimeout(timeoutRef.current)
    setHomesOpen(true)
  }

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setHomesOpen(false), 180)
  }

  const isLoggedIn = () => !!localStorage.getItem('token')

  const handleProtectedClick = (path) => {
    setMobileMenuOpen(false)
    if (isLoggedIn()) {
      navigate(path)
    } else {
      setRedirectPath(path)
      setShowLoginModal(true)
    }
  }

  const homeTypes = [
    { name: 'Single Wides', path: '/homes/single-wides' },
    { name: 'Double Wides', path: '/homes/double-wides' },
    { name: 'Tiny Homes / Park Models', path: '/homes/tiny-homes' },
    { name: 'Workforce Housing', path: '/homes/workforce-housing' },
  ]

  const otherLinks = [
    { name: 'Buying Guide', path: '/buying-guide' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact Us', path: '/contact' },
  ]

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* Logo - scaled up for high visibility */}
          <Link to="/" className="flex items-center shrink-0 py-1">
            <img
              src="/synergylogo.jpeg"
              alt="Synergy Modular Living"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#B87333] transition py-2"
              >
                Homes
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${homesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {homesOpen && (
                <div
                  className="absolute top-full left-0 pt-2 w-60 z-50"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <div className="bg-white border border-slate-100 rounded-xl shadow-lg py-2 overflow-hidden">
                    {homeTypes.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#B87333] transition"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {otherLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-[#B87333] transition"
              >
                {link.name}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => handleProtectedClick('/pre-approved')}
              className="hover:text-[#B87333] transition"
            >
              Get Pre-Approved
            </button>
            <button
              type="button"
              onClick={() => handleProtectedClick('/book-appointment')}
              className="hover:text-[#B87333] transition"
            >
              Book Appointment
            </button>
          </nav>

          {/* Auth + mobile toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn() ? (
                <Link
                  to="/user/dashboard"
                  className="bg-[#0B1C33] hover:bg-[#B87333] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/user/login"
                    className="text-sm font-semibold text-[#0B1C33] hover:text-[#B87333] transition px-2 py-2"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/user/register"
                    className="bg-[#0B1C33] hover:bg-[#B87333] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <p className="text-[11px] font-bold text-[#B87333] uppercase tracking-wider mb-2 px-1">
              Homes
            </p>
            <div className="space-y-0.5 mb-3">
              {homeTypes.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#B87333] font-medium transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 my-3" />

            <div className="space-y-0.5">
              {otherLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#B87333] font-medium transition"
                >
                  {link.name}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => handleProtectedClick('/pre-approved')}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#B87333] font-medium transition"
              >
                Get Pre-Approved
              </button>
              <button
                type="button"
                onClick={() => handleProtectedClick('/book-appointment')}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#B87333] font-medium transition"
              >
                Book Appointment
              </button>
            </div>

            <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
              {isLoggedIn() ? (
                <Link
                  to="/user/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-[#0B1C33] hover:bg-[#B87333] text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/user/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center border border-slate-200 text-[#0B1C33] font-semibold py-3 rounded-xl hover:border-[#B87333] hover:text-[#B87333] transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/user/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-[#0B1C33] hover:bg-[#B87333] text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Account Required"
        redirectTo={redirectPath}
      />
    </>
  )
}