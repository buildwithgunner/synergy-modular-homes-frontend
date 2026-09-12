import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    title: 'Single Wides',
    path: '/homes?type=single-wide',
    desc: 'Affordable & efficient long-narrow designs',
    price: 'From $89k',
    // Long, narrow, single-section modern manufactured home
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  },
  {
    title: 'Double Wides',
    path: '/homes?type=double-wide',
    desc: 'Spacious multi-section family ranch layouts',
    price: 'From $145k',
    // Wide, dual-section modern modular home
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  },
  {
    title: 'Tiny Homes',
    path: '/homes?type=tiny-home',
    desc: 'Compact, efficient micro-cabin builds',
    price: 'From $62k',
    // True small-footprint modern A-frame/tiny cabin
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
  },
  {
    title: 'Workforce Housing',
    path: '/homes?type=workforce',
    desc: 'Multi-unit commercial residential setups',
    price: 'Multi-Unit',
    // Row/modular multi-unit lodge structure
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
  },
]

export default function BrowseCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-14">
        <span className="text-[#B87333] text-xs font-bold uppercase tracking-widest block mb-2">
          Explore Classifications
        </span>
        <h2 className="text-3xl font-extrabold text-[#0B1C33] mb-3">
          Browse by Category
        </h2>
        <p className="text-slate-500">
          Find the exact modular layout tailored to your site and budget
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            to={cat.path}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6"
          >
            {/* Image with zoom effect */}
            <img
              src={cat.image}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Dark gradient readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C33]/95 via-[#0B1C33]/40 to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <span className="text-[#C9A66B] font-extrabold text-xs uppercase tracking-wider block mb-1">
                {cat.price}
              </span>
              <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#C9A66B] transition-colors flex items-center justify-between">
                {cat.title}
                <span className="text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}