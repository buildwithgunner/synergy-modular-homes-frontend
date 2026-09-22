import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import LoginRequiredModal from '../components/LoginRequiredModal'
import InquiryModal from '../components/InquiryModal'
import { getImageUrl } from '../utils/image'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export default function Home() {
  const navigate = useNavigate()
  const [featuredHomes, setFeaturedHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHome, setSelectedHome] = useState(null)
  
  // House Type Filter State
  const [propertyType, setPropertyType] = useState('all') // 'all' | 'single-wide' | 'double-wide' | 'modular' | 'land-home'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

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

  // Map category tab IDs to acceptable target strings
  const propertyTypeMap = {
    'single-wide': ['single wide', 'single-wide', 'singlewide', 'single'],
    'double-wide': ['double wide', 'double-wide', 'doublewide', 'double'],
    'modular': ['modular'],
    'land-home': ['land & home', 'land and home', 'land-home', 'land_home', 'land']
  }

  // Reset page to 1 when changing type tabs
  const handleTypeChange = (typeId) => {
    setPropertyType(typeId)
    setCurrentPage(1)
  }

  // FETCH HOMES FROM BACKEND API
  useEffect(() => {
    const fetchFeaturedHomes = async () => {
      setLoading(true)
      try {
        const url = `${API_BASE}/homes?page=${currentPage}&limit=12`
        
        // Headers and keepalive prevent QUIC / HTTP3 protocol drops
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          keepalive: true,
        })
        
        if (!res.ok) {
          throw new Error(`API HTTP Error: ${res.status}`)
        }

        const data = await res.json()
        
        // Extract array from paginated response or plain array
        let homesArray = Array.isArray(data) ? data : (data.data || [])

        // Client-side filtering fallback for categories
        if (propertyType !== 'all') {
          const validKeywords = propertyTypeMap[propertyType] || []
          homesArray = homesArray.filter((home) => {
            const rawType = (
              home.type || 
              home.category || 
              home.property_type || 
              home.title || 
              ''
            ).toLowerCase()

            return validKeywords.some((keyword) => rawType.includes(keyword))
          })
        }

        setFeaturedHomes(homesArray)

        // Set pagination metadata
        if (data.last_page) setLastPage(data.last_page)
        else if (data.meta?.last_page) setLastPage(data.meta.last_page)
        else setLastPage(1)

        if (data.total) setTotalItems(data.total)
        else if (data.meta?.total) setTotalItems(data.meta.total)
        else setTotalItems(homesArray.length)

      } catch (err) {
        console.error('Error fetching homes from backend API:', err)
     } finally {
        setLoading(false)
      }
    }

    fetchFeaturedHomes()
  }, [propertyType, currentPage])

  const formatPrice = (home) => {
    if (!home) return '$0'
    const symbol = home.currency === 'GBP' ? '£' : '$'
    if (home.price_min && home.price_max) {
      return `${symbol}${Number(home.price_min).toLocaleString()} – ${symbol}${Number(home.price_max).toLocaleString()}`
    }
    if (home.price_min) {
      return `From ${symbol}${Number(home.price_min).toLocaleString()}`
    }
    const amount = home.price || home.price_max || 0
    return `${symbol}${Number(amount).toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#F7F7F6] text-[#222222] font-sans selection:bg-[#C9945B] selection:text-white">
      {/* HEADER */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-16">
        
        {/* HERO SECTION */}
        <section className="relative rounded-[2.5rem] overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center p-6 sm:p-12 lg:p-16 shadow-lg border border-slate-200/50">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1800&q=85"
              alt="Find Your Dream Home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                Find Your Dream <br />
                Home Today
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-md font-light leading-relaxed">
                Partner with our local experts who are dedicated to helping you find the perfect property for your lifestyle.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate('/homes')}
                  className="bg-[#C9945B] hover:bg-[#b58149] text-white text-sm font-semibold px-7 py-3.5 rounded-full transition shadow-md"
                >
                  Explore Homes
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white text-sm font-semibold px-7 py-3.5 rounded-full transition"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-end">
              <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-7 w-full max-w-sm shadow-2xl text-slate-800 border border-white/40">
                <h3 className="text-2xl font-bold text-[#1A1D20] mb-2">Who We Are?</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  We offer a range of services including buying, selling, and property management.
                </p>

                <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-5">
                  <div>
                    <span className="block text-xl font-extrabold text-[#C9945B]">100+</span>
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wide">Premium Homes</span>
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-[#C9945B]">600+</span>
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wide">Agents Network</span>
                  </div>
                  <div>
                    <span className="block text-xl font-extrabold text-[#C9945B]">3K+</span>
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wide">Happy Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20] tracking-tight">
                Discover Your Perfect <br />
                <span className="text-[#C9945B]">Property Match</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              We listen to your needs, understand your goals, and curate the best property matches just for you. Whether you're buying, selling, or investing, our team is here to guide you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 relative rounded-[2rem] overflow-hidden min-h-[460px] group shadow-md border border-slate-200/60 bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
                alt="456 Oceanview Drive"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-95"
              />

              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2.5 rounded-full cursor-pointer hover:bg-white transition text-slate-700 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-[1.5rem] p-5 shadow-xl border border-white/30 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-[#C9945B] tracking-tight mb-0.5">$1,250,000</div>
                  <div className="text-xs font-medium text-slate-400">456 Oceanview Drive,<br />Malibu, CA 90265</div>
                </div>

                <div className="flex items-center gap-4 text-center border-l pl-5 border-slate-200 text-slate-700">
                  <div>
                    <div className="text-xs font-bold">4</div>
                    <div className="text-[10px] text-slate-400">Beds</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold">3</div>
                    <div className="text-[10px] text-slate-400">Baths</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold">2</div>
                    <div className="text-[10px] text-slate-400">Garage</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#C9945B] text-white flex items-center justify-center font-bold text-xs ml-1 shadow">
                    ↗
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80', alt: 'Kitchen' },
                { img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80', alt: 'Modern Exterior' },
                { img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80', alt: 'Bathroom' },
                { img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&q=80', alt: 'Dining Area' },
              ].map((item, idx) => (
                <div key={idx} className="relative rounded-[1.5rem] overflow-hidden h-52 group shadow-sm bg-slate-100">
                  <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT US BANNER */}
        <section className="bg-[#1A1D20] rounded-[2.5rem] overflow-hidden text-white grid grid-cols-1 lg:grid-cols-12 shadow-xl border border-slate-800">
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">About Us</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md font-light">
              At Nexora Realty, we believe finding the right home is about more than just property — it's about lifestyle, comfort, and the future.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md font-light">
              Our experienced agents provide personalized service, local expertise, and trusted guidance to make your real estate journey smooth and successful.
            </p>
          </div>
          <div className="lg:col-span-6 h-64 lg:h-auto min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80"
              alt="Our Happy Clients"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* PROPERTY SHOWCASE */}
        <section className="space-y-8" id="showcase">
          <div className="text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1D20]">Property Showcase</h2>

            {/* House Type Filter Tab Bar */}
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap justify-center items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-inner">
                {[
                  { id: 'all', label: 'All Types' },
                  { id: 'single-wide', label: 'Single Wide' },
                  { id: 'double-wide', label: 'Double Wide' },
                  { id: 'modular', label: 'Modular' },
                  { id: 'land-home', label: 'Land & Home' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeChange(item.id)}
                    className={`px-5 py-2 rounded-full transition-all duration-200 ${
                      propertyType === item.id
                        ? 'bg-[#C9945B] text-white shadow-md font-bold'
                        : 'hover:text-slate-900 hover:bg-slate-300/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Render Logic */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-3 border border-slate-100 animate-pulse space-y-3">
                  <div className="h-44 bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : featuredHomes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/60 max-w-lg mx-auto shadow-sm">
              <p className="text-sm font-semibold text-slate-700">No properties available in this category.</p>
              <p className="text-xs text-slate-400 mt-1">Try selecting another house type option above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredHomes.map((home) => (
                <div
                  key={home.id || home._id}
                  onClick={() => navigate(`/homes/${home.id}`)}
                  className="bg-white rounded-[1.8rem] p-3 border border-slate-200/60 shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 rounded-[1.2rem] overflow-hidden relative mb-3 bg-slate-100">
                      <img
                        src={
                          getImageUrl(home.image || home.featured_image || (home.images && home.images[0])) ||
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'
                        }
                        alt={home.title || home.location || 'Property Image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="px-2 pb-1 space-y-1">
                      <h3 className="font-bold text-[#1A1D20] text-sm truncate">
                        {home.title || home.location || home.address}
                      </h3>
                      
                      <div className="text-[11px] text-slate-400 font-medium">
                        {home.bedrooms || home.beds || 0} Beds &nbsp;|&nbsp; {home.bathrooms || home.baths || 0} Baths &nbsp;|&nbsp; {home.living_area_min || home.sqft || '—'} Sq Ft
                      </div>

                      <div className="text-sm font-extrabold text-[#C9945B] pt-1">
                        {formatPrice(home)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t border-slate-100 px-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/homes/${home.id}`)
                      }}
                      className="w-full py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedHome(home)
                      }}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-[#C9945B] hover:bg-[#b58149] text-white shadow-sm transition"
                    >
                      Interested
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/60">
            <span className="text-xs font-medium text-slate-500">
              Showing Page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{lastPage}</strong>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={currentPage <= 1 || loading}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                  document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                ← Previous
              </button>

              <button
                type="button"
                disabled={currentPage >= lastPage || loading}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1)
                  document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-2 rounded-full text-xs font-bold bg-[#1A1D20] text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition shadow-md"
              >
                Next →
              </button>
            </div>
          </div>
        </section>

        {/* Protected Feature Triggers */}
        <div className="text-center pt-8 border-t border-slate-200/60 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleProtectedClick('/pre-approved')}
            className="text-xs font-semibold text-slate-500 hover:text-[#C9945B] transition"
          >
            Get Pre-Approved →
          </button>
          <button
            onClick={() => handleProtectedClick('/book-appointment')}
            className="text-xs font-semibold text-slate-500 hover:text-[#C9945B] transition"
          >
            Book Appointment →
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1A1D20] text-slate-400 py-8 text-center text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} Nexora Realty. All rights reserved.</p>
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