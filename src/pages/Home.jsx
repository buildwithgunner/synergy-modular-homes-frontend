import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Building, 
  MapPin, 
  DollarSign, 
  ArrowRight, 
  Search, 
  Heart, 
  Star, 
  Check, 
  Bed, 
  Bath, 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  Loader2 
} from 'lucide-react'

const Home = () => {
  const [featuredHomes, setFeaturedHomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [propertyType, setPropertyType] = useState('all')

  // Robust Price Formatting Helper
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Call for Price'
    const numericValue = typeof price === 'number' 
      ? price 
      : parseFloat(String(price).replace(/[^0-9.-]+/g, ''))
    
    if (isNaN(numericValue)) return 'Call for Price'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numericValue)
  }

  // Synchronized Filter Change
  const handleTypeChange = (newType) => {
    if (newType === propertyType) return
    setPropertyType(newType)
    setCurrentPage(1)
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchFeaturedHomes = async () => {
      setLoading(true)
      setError(null)
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '8',
          ...(propertyType !== 'all' && { type: propertyType })
        })

        const response = await fetch(`/api/homes/featured?${queryParams}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error(`Failed to load homes (Status: ${response.status})`)
        }

        const data = await response.json()
        
        let homesArray = Array.isArray(data) ? data : (data.data || [])
        let lastPage = data.last_page || data.totalPages || 1

        // Handle Fallback Client-Side Filtering cleanly
        if (propertyType !== 'all' && homesArray.length > 0) {
          const filtered = homesArray.filter(
            home => home.type?.toLowerCase() === propertyType.toLowerCase()
          )
          if (filtered.length > 0) {
            homesArray = filtered
            // Adjust page ceiling if client-side filtering drops item counts
            lastPage = Math.max(1, Math.ceil(filtered.length / 8))
          }
        }

        setFeaturedHomes(homesArray)
        setTotalPages(lastPage)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching homes:', err)
          setError('Unable to load featured homes at this time.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchFeaturedHomes()

    return () => {
      controller.abort()
    }
  }, [propertyType, currentPage])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Find Your Dream Manufactured Home
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
            Discover quality single-wides, double-wides, and modular homes built for modern living at affordable prices.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/homes" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Browse Inventory <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Homes Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Models</h2>
            <p className="text-slate-600 mt-2">Explore our most popular floor plans and move-in ready homes.</p>
          </div>

          {/* Property Type Filter */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {['all', 'single-wide', 'double-wide', 'modular'].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  propertyType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Home Listing Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center my-8">
            {error}
          </div>
        ) : featuredHomes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center my-8">
            <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No properties found</h3>
            <p className="text-slate-500 mt-1">Try selecting a different category filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredHomes.map((home) => (
                <div 
                  key={home.id || home._id} 
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-48 bg-slate-100">
                    <img 
                      src={home.image_url || home.thumbnail || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80'} 
                      alt={home.title || home.name || 'Manufactured Home'} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-full font-medium capitalize backdrop-blur-sm">
                      {home.type || 'Home'}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">
                        {home.title || home.name || `${home.beds || 3} Bed ${home.baths || 2} Bath Model`}
                      </h3>
                      <p className="text-slate-500 text-sm flex items-center mb-4">
                        <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                        {home.location || 'Dealer Lot'}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
                        <div className="flex items-center">
                          <Bed className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>{home.beds || '-'} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>{home.baths || '-'} Baths</span>
                        </div>
                        <div className="flex items-center">
                          <Maximize className="h-3.5 w-3.5 mr-1 text-slate-400" />
                          <span>{home.sqft ? `${home.sqft} sqft` : '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2">
                      <div>
                        <span className="text-xs text-slate-400 block">Starting at</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(home.price || home.price_min)}
                        </span>
                      </div>
                      <Link 
                        to={`/homes/${home.id || home._id}`}
                        className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-slate-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Home