import Header from '../components/Header'
import { Link } from 'react-router-dom'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Tyler, TX',
      text: 'The process was smooth from start to finish. They helped us find a beautiful 3-bed double wide within our budget. Highly professional team!',
      rating: 5,
    },
    {
      name: 'David K.',
      location: 'Grass Valley, CA',
      text: 'Found them through Instagram and booked an appointment the same day. Got pre-approved in under 24 hours. Incredible experience.',
      rating: 5,
    },
    {
      name: 'Elena R.',
      location: 'Texas',
      text: 'Great customer service and honest pricing with no hidden fees. They made buying our first modular home feel easy and stress-free.',
      rating: 5,
    },
    {
      name: 'James T.',
      location: 'California',
      text: 'We were first-time buyers and the team guided us through every single step. Very patient, knowledgeable, and professional.',
      rating: 5,
    },
    {
      name: 'Michelle A.',
      location: 'Tyler, TX',
      text: 'Beautiful home and fast delivery. Everything was ready within 3 weeks. The quality exceeded our expectations.',
      rating: 5,
    },
    {
      name: 'Robert P.',
      location: 'Grass Valley, CA',
      text: 'Excellent communication and transparent financing options. Would definitely buy from Synergy Modular Homes again.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Header />

      {/* Hero */}
      <section className="bg-[#0B1C33] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <img
            src="../../public/synergylogo.jpeg"
            alt="Synergy Modular Homes"
            className="h-14 mx-auto mb-6 object-contain "
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            What Our Buyers Say
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Real stories from families who found their perfect home with Synergy Modular Homes.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-[#B87333] fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                “{item.text}”
              </p>

              <div className="border-t border-slate-100 pt-4">
                <p className="font-bold text-[#0B1C33] text-sm">{item.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#B87333] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
            Ready to Find Your Home?
          </h2>
          <p className="text-white/90 mb-8">
            Join hundreds of happy families who chose Synergy Modular Homes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-appointment"
              className="inline-block bg-white text-[#0B1C33] font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition"
            >
              Book an Appointment
            </Link>
            <Link
              to="/pre-approved"
              className="inline-block bg-[#0B1C33] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#162a47] transition border border-white/20"
            >
              Get Pre-Approved
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}