import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

type Venue = {
  id: number
  name: string
  city?: string
  description?: string
}

function VenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const city = searchParams.get('city') || ''
  const name = searchParams.get('name') || ''

  const query = useMemo(() => ({ city, name }), [city, name])

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams()
        if (query.city) qs.set('city', query.city)
        if (query.name) qs.set('name', query.name)
        const endpoint = qs.toString() ? `/api/venues/search?${qs}` : '/api/venues'
        const { data } = await api.get<Venue[]>(endpoint)
        if (!ignore) setVenues(data)
      } catch (err: any) {
        if (!ignore) setError(err?.message || 'Failed to load venues')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [query.city, query.name])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Venues</h1>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={name}
          onChange={(e) => setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            if (e.target.value) next.set('name', e.target.value); else next.delete('name')
            return next
          })}
          placeholder="Search by name"
          className="border rounded-md px-3 py-2"
        />
        <input
          value={city}
          onChange={(e) => setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            if (e.target.value) next.set('city', e.target.value); else next.delete('city')
            return next
          })}
          placeholder="City"
          className="border rounded-md px-3 py-2"
        />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {venues.map(v => (
          <Link key={v.id} to={`/venues/${v.id}`} className="border rounded-lg p-4 hover:border-brand-accent">
            <div className="font-medium">{v.name}</div>
            <div className="text-sm text-slate-600">{v.city || '—'}</div>
            {v.description && <p className="text-sm mt-2 line-clamp-2">{v.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default VenuesPage

