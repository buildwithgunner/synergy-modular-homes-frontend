import Header from '../components/Header'
import SaveHomeButton from '../components/SaveHomeButton'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/image'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function HomeDetail() {
  const { id } = useParams()
  const [home, setHome] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [financeTab, setFinanceTab] = useState('financing')
  const [termMonths, setTermMonths] = useState(36)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/homes/${id}`)
        if (!res.ok) throw new Error('Home not found')
        const data = await res.json()
        setHome(data)

        const images = []
        if (data.image) images.push(getImageUrl(data.image))
        if (Array.isArray(data.images)) {
          data.images.forEach((img) => {
            const url = getImageUrl(img)
            if (url && !images.includes(url)) images.push(url)
          })
        }
        setMainImage(images[0] || '')
        setHome((prev) => ({ ...prev, gallery: images }))
      } catch (err) {
        console.error(err)
        setHome(null)
      } finally {
        setLoading(false)
      }
    }
    fetchHome()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="text-center py-20 text-slate-500">Loading home...</div>
      </div>
    )
  }

  if (!home) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Home Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">← Back to Homes</Link>
        </div>
      </div>
    )
  }

  const gallery = home.gallery || (home.image ? [getImageUrl(home.image)] : [])
  const price = Number(home.price_min || home.price || 0)
  const downPaymentPercent = 10
  const downPayment = Math.round(price * (downPaymentPercent / 100))
  const amortizedBalance = price - downPayment
  const monthlyFinancing = termMonths > 0 ? Math.round(amortizedBalance / termMonths) : 0
  const baseRent = Math.round(price * 0.012)
  const equityBuilder = 50
  const totalRentPayment = baseRent + equityBuilder

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % gallery.length)
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length)

  const formatPrice = () => {
    const symbol = home.currency === 'GBP' ? '£' : '$'
    if (home.price_min && home.price_max) {
      return `${symbol}${Number(home.price_min).toLocaleString()} – ${symbol}${Number(home.price_max).toLocaleString()}`
    }
    return `${symbol}${price.toLocaleString()}`
  }

  const features = Array.isArray(home.amenities) ? home.amenities : []
  const specs = home.specs && typeof home.specs === 'object' ? home.specs : {
    solar: 'None',
    water: 'Municipal',
    insulation: 'Standard',
    toilet: 'Standard',
    lofts: '0',
    heating: 'Central',
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] overflow-x-hidden">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-5 sm:mb-6"
        >
          ← Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            {/* Gallery */}
            <div>
              <div
                className="relative rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-sm"
                onClick={() => openLightbox(Math.max(0, gallery.indexOf(mainImage)))}
              >
                <img
                  src={mainImage || getImageUrl(home.image)}
                  alt={home.title}
                  className="w-full h-[280px] sm:h-[380px] lg:h-[460px] object-cover"
                />
                {gallery.length > 0 && (
                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {Math.max(1, gallery.indexOf(mainImage) + 1)} / {gallery.length}
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2 -mx-1 px-1">
                  {gallery.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setMainImage(img)}
                      className={`flex-shrink-0 w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden border-2 transition ${
                        mainImage === img ? 'border-emerald-700' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <span className="inline-block bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  FOR SALE & RENT
                </span>
                <SaveHomeButton homeId={home.id} />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-tight mb-2">
                {home.title}
              </h1>
              <p className="text-slate-500 text-sm mb-4 sm:mb-6">
                📍 {home.location || 'Location TBD'}
              </p>

              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-8 text-sm text-slate-600 border-y border-slate-200 py-4">
                <div className="text-center sm:text-left">
                  <strong className="block sm:inline">{home.living_area_min || home.sqft || '—'}</strong>
                  <span className="text-xs sm:text-sm text-slate-500"> sqft</span>
                </div>
                <div className="text-center sm:text-left">
                  <strong className="block sm:inline">{home.beds || 0}</strong>
                  <span className="text-xs sm:text-sm text-slate-500"> bed</span>
                </div>
                <div className="text-center sm:text-left">
                  <strong className="block sm:inline">{home.baths || 0}</strong>
                  <span className="text-xs sm:text-sm text-slate-500"> bath</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">About This Home</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {home.description || 'No description available.'}
              </p>
            </div>

            {/* Tech Specs */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Tech Specs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white border border-slate-100 rounded-2xl p-3 sm:p-4 text-center"
                  >
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {features.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {features.map((item) => (
                    <span
                      key={item}
                      className="bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (sticky only on large screens) */}
          <div className="lg:col-span-2">
            <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-24">
              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <p className="text-xs font-semibold text-slate-400 tracking-wider mb-1">
                  SALE / RENT
                </p>
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {formatPrice()}
                  </span>
                  <span className="text-slate-400 text-sm">/ ${baseRent}/mo</span>
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  {downPaymentPercent}% down = ${downPayment.toLocaleString()} · {termMonths} months
                </p>

                <div className="space-y-3">
                  {/* ✅ Updated button - goes to the new inquiry form */}
                  <Link
                    to={`/user/inquiries/new?home_id=${home.id}`}
                    className="flex items-center justify-between w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3.5 px-5 rounded-xl transition text-sm sm:text-base"
                  >
                    <span>I am Interested</span>
                    <span>→</span>
                  </Link>

                  <SaveHomeButton
                    homeId={home.id}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 font-medium py-3.5 rounded-xl hover:bg-slate-50 transition"
                  />

                  <Link
                    to="/pre-approved"
                    className="flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 rounded-xl transition text-sm sm:text-base"
                  >
                    Get Pre-Approved
                  </Link>
                </div>
              </div>

              {/* Finance Calculator */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
                  <button
                    type="button"
                    onClick={() => setFinanceTab('financing')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                      financeTab === 'financing' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    Financing
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinanceTab('rent')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                      financeTab === 'rent' ? 'bg-emerald-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    Rent-to-Own
                  </button>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">TERM DURATION</span>
                    <span className="font-bold">{termMonths} MONTHS</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="6"
                    value={termMonths}
                    onChange={(e) => setTermMonths(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                </div>

                {financeTab === 'financing' ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Price</span>
                      <span>${price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Down Payment (10%)</span>
                      <span>${downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Monthly Term Rate</span>
                      <span className="text-emerald-700">${monthlyFinancing}/mo</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Monthly Rent</span>
                      <span>${baseRent}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Equity Builder</span>
                      <span>${equityBuilder}/mo</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Total Monthly</span>
                      <span className="text-emerald-700">${totalRentPayment}/mo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-3xl sm:text-4xl z-10"
          >
            ×
          </button>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-2 sm:left-4 text-white text-4xl sm:text-5xl z-10"
          >
            ‹
          </button>
          <img
            src={gallery[currentIndex]}
            alt="Gallery"
            className="max-h-[75vh] sm:max-h-[85vh] max-w-full object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-2 sm:right-4 text-white text-4xl sm:text-5xl z-10"
          >
            ›
          </button>
          <div className="absolute bottom-4 sm:bottom-6 text-white text-sm">
            {currentIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  )
}