import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SaveHomeButton from '../components/SaveHomeButton'
import LoginRequiredModal from '../components/LoginRequiredModal'
import InquiryModal from '../components/InquiryModal'
import BrowseCategories from '../components/BrowseCategories'
import { getImageUrl } from '../utils/image'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function Home() {
  const navigate = useNavigate()
  const [featuredHomes, setFeaturedHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHome, setSelectedHome] = useState(null)
  const [videoError, setVideoError] = useState(false)

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [redirectPath, setRedirectPath] = useState('/pre-approved')

  const isLoggedIn = !!localStorage.getItem('token')

  const handleProtectedClick = (path) => {
    if (isLoggedIn) {
      navigate(path)
    } else {
      setRedirectPath(path)
      setShowLoginModal(true)
    }
  }

  const handleHeroSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/homes?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  useEffect(() => {
    const fetchFeaturedHomes = async () => {
      try {
        const res = await fetch(`${API_BASE}/homes?limit=3&featured=true`)
        const data = await res.json()
        setFeaturedHomes(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        console.error('Error fetching featured homes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedHomes()
  }, [])

  const formatPrice = (home) => {
    const symbol = home.currency === 'GBP' ? '£' : '$'
    if (home.price_min && home.price_max) {
      return `${symbol}${Number(home.price_min).toLocaleString()} – ${symbol}${Number(home.price_max).toLocaleString()}`
    }
    if (home.price_min) {
      return `From ${symbol}${Number(home.price_min).toLocaleString()}`
    }
    return `${symbol}${Number(home.price || 0).toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800 font-sans selection:bg-[#B87333] selection:text-white">
      <Header />

      {/* 1. HERO SECTION WITH VIDEO BACKGROUND & FALLBACK */}
      <section className="relative text-white min-h-[85vh] flex items-center justify-center px-4 py-24 overflow-hidden">
        {/* Background Video with Static Fallback Image */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              poster="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80"
              className="w-full h-full object-cover scale-105"
            >
              <source
                src="https://videos.pexels.com/video-files/3205634/3205634-sd_640_360_25fps.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80"
              alt="Modular Home Hero"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C33] via-[#0B1C33]/70 to-[#0B1C33]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto text-center z-10 pt-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold px-4 py-2 rounded-full mb-6 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-100 uppercase tracking-widest text-[11px]">Next-Gen Modular Living</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Modern Modular Homes,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-[#B87333]">
              Delivered Anywhere.
            </span>
          </h1>

          <p className="text-slate-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Explore single-wides, double-wides, tiny homes, and workforce setups. Factory-crafted precision meets hassle-free installation.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-xl rounded-2xl p-2 shadow-2xl gap-2 border border-white/30 transition-all focus-within:ring-2 focus-within:ring-[#B87333]"
          >
            <div className="flex items-center w-full px-3">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search city, zip code, or floor plan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-3.5 text-slate-900 focus:outline-none rounded-xl text-sm placeholder:text-slate-400 bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#0B1C33] hover:bg-[#B87333] text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shrink-0 shadow-lg"
            >
              Search
            </button>
          </form>

          {/* Quick Stats Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg> 4.9/5 Homeowner Rating</span>
            <span>•</span>
            <span>Direct Factory Pricing</span>
            <span>•</span>
            <span>Turnkey Site Setup</span>
          </div>
        </div>

        {/* Floating Media Cards (Desktop Only) */}
        <div className="hidden lg:block absolute bottom-8 left-8 z-10 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-2xl max-w-xs">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&q=80" alt="Delivery preview" className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <p className="text-xs font-bold text-white">Turnkey Delivery</p>
              <p className="text-[11px] text-slate-300">We ship direct to your plot</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-8 right-8 z-10 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-2xl max-w-xs">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&q=80" alt="Interior preview" className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <p className="text-xs font-bold text-white">Custom Interiors</p>
              <p className="text-[11px] text-slate-300">Choose luxury finishes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-white border-b border-slate-200/80 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '150+', label: 'Homes Ready to Ship' },
            { value: '12+', label: 'Years Industry Expertise' },
            { value: '980+', label: 'Delivered Homes' },
            { value: '24h', label: 'Fast Pre-Approval' },
          ].map((stat) => (
            <div key={stat.label} className="p-2">
              <p className="text-3xl sm:text-4xl font-black text-[#0B1C33] tracking-tight">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HOMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#B87333] text-xs font-bold uppercase tracking-widest block mb-1">Live Inventory</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C33]">Featured Homes</h2>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Hand-picked modular homes ready for delivery</p>
          </div>
          <Link
            to="/homes"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#B87333] hover:text-[#0B1C33] transition-colors"
          >
            View All Homes <span className="text-lg">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-64 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-7 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHomes.map((home) => (
              <div
                key={home.id}
                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  <img
                    src={getImageUrl(home.image) || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-[#0B1C33]/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-lg">
                    {home.location || home.house_type || 'Available'}
                  </span>
                  <div className="absolute top-3 right-3">
                    <SaveHomeButton homeId={home.id} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1C33] mb-1 group-hover:text-[#B87333] transition line-clamp-1">
                      {home.title}
                    </h3>
                    <p className="text-2xl font-black text-[#B87333] mb-4">{formatPrice(home)}</p>
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs font-semibold text-slate-600 mb-4">
                      <div><span className="block text-slate-400 font-normal text-[11px]">Beds</span>{home.beds || 0}</div>
                      <div><span className="block text-slate-400 font-normal text-[11px]">Baths</span>{home.baths || 0}</div>
                      <div><span className="block text-slate-400 font-normal text-[11px]">Sq Ft</span>{home.living_area_min || home.sqft || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/homes/${home.id}`}
                      className="flex-1 text-center border border-slate-200 hover:border-[#B87333] hover:text-[#B87333] text-sm font-semibold py-2.5 rounded-xl transition"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setSelectedHome(home)}
                      className="flex-1 bg-[#0B1C33] hover:bg-[#B87333] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      I'm Interested
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#B87333] text-xs font-bold uppercase tracking-wider block mb-2">Precision Engineering</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C33] mb-6 leading-tight">
                Why Choose Synergy Modular Living?
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We specialize in factory-built modular and manufactured housing built to strict federal HUD standards. Enjoy up to 40% faster construction timelines without sacrificing design quality.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Wide Floor Plan Selection', desc: 'Single-wides, double-wides, tiny homes, and workforce housing.' },
                  { title: 'Flexible Financing & Fast Approval', desc: 'Get pre-approved in as little as 24 hours with custom loan packages.' },
                  { title: 'Full Turnkey Setup', desc: 'We coordinate permits, foundations, utility hooks, and direct delivery.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#B87333]/10 text-[#B87333] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1C33]">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[460px] bg-slate-900 border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern manufactured home setup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C33]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-black text-[#0B1C33]">12+ Years</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Building Better Homes</p>
                </div>
                <Link to="/about" className="text-xs font-bold text-[#B87333] hover:underline">
                  Learn Our Story →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATEGORIES SECTION */}
      <BrowseCategories />

      {/* 6. SHOWROOM LOCATIONS */}
      <section 
        className="relative text-white py-28 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-[#0B1C33]/90 backdrop-blur-xs" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#C9A66B] text-xs font-bold uppercase tracking-widest block mb-2">Experience Models Firsthand</span>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">Visit Our Showrooms</h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Tour fully staged floor models in Texas or California.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/15 rounded-3xl p-8 hover:border-white/30 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#B87333] flex items-center justify-center text-white font-black text-sm shadow-lg">TX</div>
                  <div>
                    <h3 className="text-2xl font-bold">Tyler, Texas</h3>
                    <p className="text-xs text-slate-300">Sales Lot & Model Park</p>
                  </div>
                </div>
                <p className="text-slate-200 leading-relaxed mb-8">
                  2606 E Commerce St<br />Tyler, TX 75702
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=2606+E+Commerce+St,+Tyler,+TX+75702"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C9A66B] hover:text-white font-bold text-sm transition"
              >
                Get Directions →
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/15 rounded-3xl p-8 hover:border-white/30 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#B87333] flex items-center justify-center text-white font-black text-sm shadow-lg">CA</div>
                  <div>
                    <h3 className="text-2xl font-bold">Grass Valley, California</h3>
                    <p className="text-xs text-slate-300">Sales Lot & Model Park</p>
                  </div>
                </div>
                <p className="text-slate-200 leading-relaxed mb-8">
                  11534 Country View Way<br />Grass Valley, CA 95945
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=11534+Country+View+Way,+Grass+Valley,+CA+95945"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C9A66B] hover:text-white font-bold text-sm transition"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="relative bg-[#0B1C33] text-white py-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black mb-6">Ready to Find Your Modular Home?</h2>
          <p className="text-slate-300 mb-10 max-w-xl mx-auto text-base sm:text-lg">
            Apply online for pre-approval or schedule a walk-through appointment with one of our modular home specialists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleProtectedClick('/pre-approved')}
              className="bg-[#B87333] hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl transition shadow-xl"
            >
              Get Pre-Approved Fast
            </button>
            <button
              onClick={() => handleProtectedClick('/book-appointment')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border border-white/20 transition shadow-xl"
            >
              Book Showroom Visit
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#071222] text-slate-400 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <span className="text-2xl font-black text-white tracking-tight">SYNERGY HOMES</span>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Providing modern modular and manufactured housing options nationwide with end-to-end site prep, financing, and delivery.
            </p>
            <p className="text-xs text-slate-500 pt-2">© {new Date().getFullYear()} Synergy Modular Living. All rights reserved.</p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/homes" className="hover:text-white transition">All Models</Link></li>
              <li><Link to="/categories" className="hover:text-white transition">Categories</Link></li>
              <li><Link to="/pre-approved" className="hover:text-white transition">Financing</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5">
              <li><Link to="/homes?type=single-wide" className="hover:text-white transition">Single-Wides</Link></li>
              <li><Link to="/homes?type=double-wide" className="hover:text-white transition">Double-Wides</Link></li>
              <li><Link to="/homes?type=tiny-home" className="hover:text-white transition">Tiny Homes</Link></li>
              <li><Link to="/homes?type=workforce" className="hover:text-white transition">Workforce Housing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Contact & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li>Tyler, TX • Grass Valley, CA</li>
              <li>Support: support@synergyhomes.com</li>
              <li>Mon - Sat: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <InquiryModal
        home={selectedHome}
        onClose={() => setSelectedHome(null)}
      />

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Account Required"
        redirectTo={redirectPath}
      />
    </div>
  )
}