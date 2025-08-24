import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiAuth } from '../services/auth'
import { api } from '../services/api'

type Booking = {
  id: number
  status: string
}

function BookingsPage() {
  const [searchParams] = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const venueId = searchParams.get('venueId') || ''

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const token = apiAuth.getToken()
        if (!token) throw new Error('Please login first')
        const headers = { Authorization: `Bearer ${token}` }
        const endpoint = venueId
          ? `/api/bookings/venue/${encodeURIComponent(venueId)}`
          : `/api/bookings/user/${apiAuth.getUserId()}`
        const { data } = await api.get<Booking[]>(endpoint, { headers })
        if (!ignore) setBookings(Array.isArray(data) ? data : [data].filter(Boolean))
      } catch (err: any) {
        if (!ignore) setError(err?.message || 'Failed to load bookings')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [venueId])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="divide-y">
        {bookings.map(b => (
          <li key={b.id} className="py-3 flex items-center justify-between">
            <div>#{b.id}</div>
            <div className="text-sm text-slate-600">{b.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookingsPage

