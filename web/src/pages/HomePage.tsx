import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Find and book sports venues easily
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Browse venues, check availability, and confirm bookings in minutes.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/venues" className="px-5 py-2.5 rounded-full bg-brand text-white">Explore Venues</Link>
            <Link to="/login" className="px-5 py-2.5 rounded-full border border-slate-300">Sign In</Link>
          </div>
        </div>
      </section>
      <section>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-4">Popular cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {['London','Manchester','Birmingham'].map(city => (
              <Link key={city} to={`/venues?city=${encodeURIComponent(city)}`} className="group border rounded-lg p-5 hover:border-brand-accent">
                <div className="text-lg font-medium group-hover:text-brand-accent">{city}</div>
                <div className="text-sm text-slate-600">Discover venues and activities</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

