import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SaveHomeButton from '../components/SaveHomeButton'
import LoginRequiredModal from '../components/LoginRequiredModal'
import InquiryModal from '../components/InquiryModal'
import BrowseCategories from '../components/BrowseCategories'
import { getImageUrl } from '../utils/image'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function Home() {
  const navigate = useNavigate()
  const [featuredHomes, setFeaturedHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHome, setSelectedHome] = useState(null)

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
    <div className="min-h-screen bg-[#F8F7F4] text-slate-800">
      <Header />

      {/* 1. HERO SECTION WITH PARALLAX BACKGROUND */}
      <section 
        className="relative text-white min-h-[720px] flex items-center justify-center px-4 py-28 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1C33]/85 via-[#0B1C33]/70 to-[#0B1C33]/90" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="inline-block bg-[#B87333] text-white text-xs font-semibold px-5 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 shadow-md">
            Modular & Mobile Living
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
            High-Quality Modular Homes<br />
            Ready for Move-In
          </h1>

          <p className="text-slate-200 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore single-wides, double-wides, tiny homes, and workforce housing with flexible financing and full support from selection to delivery.
          </p>

          <form
            onSubmit={handleHeroSearch}
            className="max-w-xl mx-auto flex flex-col sm:flex-row items-center bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl gap-2 border border-white/20"
          >
            <input
              type="text"
              placeholder="Search by city, zip code, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 text-slate-900 focus:outline-none rounded-xl text-sm placeholder:text-slate-400 bg-transparent"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#0B1C33] hover:bg-[#B87333] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shrink-0 shadow-md"
            >
              Search Homes
            </button>
          </form>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="bg-white border-b border-slate-100 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '150+', label: 'Homes Available' },
            { value: '12', label: 'Years Experience' },
            { value: '980+', label: 'Happy Families' },
            { value: '24h', label: 'Pre-Approval' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-[#0B1C33]">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HOMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#B87333] text-xs font-bold uppercase tracking-wider block mb-1">Live Inventory</span>
            <h2 className="text-3xl font-extrabold text-[#0B1C33]">Featured Homes</h2>
            <p className="text-slate-500 mt-1">Hand-picked modular homes ready for delivery</p>
          </div>
          <Link
            to="/homes"
            className="text-sm font-semibold text-[#B87333] hover:text-[#0B1C33] transition"
          >
            View All Homes →
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
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
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

      {/* 4. WHY CHOOSE US (FIXED SHOWCASE IMAGE) */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#B87333] text-xs font-bold uppercase tracking-wider block mb-2">Precision Built</span>
              <h2 className="text-3xl font-extrabold text-[#0B1C33] mb-6">
                Why Choose Synergy Modular Living?
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We specialize in high-quality modular and manufactured homes.
                From site prep to delivery, installation, and financing — we guide you through every step of the journey.
              </p>

              <div className="space-y-6">
                {[
                  { title: 'Wide Selection', desc: 'Single-wides, double-wides, tiny homes and workforce housing.' },
                  { title: 'Fast Pre-Approval', desc: 'Get approved in as little as 24 hours with multiple lender options.' },
                  { title: 'Full Turnkey Setup', desc: 'We handle permits, foundation matching, delivery, and utility hooks.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#B87333]/10 text-[#B87333] flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0B1C33]">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reliable Image Showcase with Hover Zoom */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[420px] bg-slate-900 border border-slate-100 group">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern manufactured home setup"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C33]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl">
                <p className="text-3xl font-black text-[#0B1C33]">12+</p>
                <p className="text-sm font-semibold text-slate-600">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CATEGORIES SECTION */}
      <BrowseCategories />

      {/* 6. PARALLAX LOCATIONS SECTION */}
      <section 
        className="relative text-white py-28 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-[#0B1C33]/90 backdrop-blur-xs" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#C9A66B] text-xs font-bold uppercase tracking-widest block mb-2">Showrooms & Sales Lots</span>
            <h2 className="text-3xl font-extrabold mb-3">Visit Our Locations</h2>
            <p className="text-slate-300 max-w-xl mx-auto">
              Walk through featured floor models in Texas or California.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8 hover:bg-white/20 transition duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#B87333] flex items-center justify-center text-white font-bold text-sm shadow-md">TX</div>
                <h3 className="text-xl font-bold">Tyler, Texas</h3>
              </div>
              <p className="text-slate-200 leading-relaxed mb-6">
                2606 E Commerce St<br />Tyler, TX 75702
              </p>
              <a
                href="https://maps.google.com/?q=2606+E+Commerce+St,+Tyler,+TX+75702"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C9A66B] hover:text-white font-semibold text-sm transition"
              >
                Get Directions →
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#B87333] flex items-center justify-center text-white font-bold text-sm shadow-md">CA</div>
                <h3 className="text-xl font-bold">Grass Valley, California</h3>
              </div>
              <p className="text-slate-200 leading-relaxed mb-6">
                11534 Country View Way<br />Grass Valley, CA 95945
              </p>
              <a
                href="https://maps.google.com/?q=11534+Country+View+Way,+Grass+Valley,+CA+95945"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C9A66B] hover:text-white font-semibold text-sm transition"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PARALLAX CALL TO ACTION SECTION */}
      <section 
        className="relative text-white py-24 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-[#B87333]/90" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Find Your Modular Home?</h2>
          <p className="text-white/90 mb-10 max-w-xl mx-auto text-lg">
            Get pre-approved today or book a private consultation with our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleProtectedClick('/pre-approved')}
              className="bg-white text-[#0B1C33] font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition shadow-xl"
            >
              Get Pre-Approved
            </button>
            <button
              onClick={() => handleProtectedClick('/book-appointment')}
              className="bg-[#0B1C33] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#162a47] transition border border-white/20 shadow-xl"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </section>

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