import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/image'

const API_BASE = 'http://127.0.0.1:8000/api'

export default function TinyHomes() {
  const [homes, setHomes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        let res = await fetch(`${API_BASE}/homes?type=Tiny Home`)
        let data = await res.json()

        if (!Array.isArray(data) || data.length === 0) {
          res = await fetch(`${API_BASE}/homes`)
          data = await res.json()
        }

        const allHomes = Array.isArray(data) ? data : []

        const filtered = allHomes.filter((home) => {
          const type = (
            home.type ||
            home.house_type ||
            home.category ||
            home.layout ||
            ''
          ).toLowerCase()

          return (
            type.includes('tiny') ||
            type.includes('park model') ||
            type.includes('park-model')
          )
        })

        setHomes(filtered)
      } catch (err) {
        console.error(err)
        setHomes([])
      } finally {
        setLoading(false)
      }
    }

    fetchHomes()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Header />

      <section className="bg-[#0B1C33] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">Tiny Homes / Park Models</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Compact, efficient, and often park-model ready. Perfect for minimalist living,
            vacation use, or affordable starter homes.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#0B1C33] mb-3">Why Choose a Tiny Home or Park Model?</h2>
          <p className="text-slate-600 max-w-3xl">
            These homes offer lower costs, easier maintenance, and greater flexibility.
            Many can be placed in RV parks or on private land with minimal foundation requirements.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-slate-100"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-7 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : homes.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            No Tiny Homes available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {homes.map((home) => (
              <Link
                key={home.id}
                to={`/homes/${home.id}`}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={getImageUrl(home.image) || 'https://images.unsplash.com/photo-1518780664697-55e3d9439e1c?w=800'}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-[#0B1C33] mb-1 group-hover:text-[#B87333] transition">
                    {home.title}
                  </h3>
                  <p className="text-2xl font-black text-[#B87333] mb-3">
                    ${Number(home.price || home.price_min || 0).toLocaleString()}
                  </p>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>{home.beds || 0} Beds</span>
                    <span>{home.baths || 0} Baths</span>
                    <span>{home.sqft || home.living_area_min || 'N/A'} Sq Ft</span>
                  </div>
                  <p className="text-sm text-slate-500">{home.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}