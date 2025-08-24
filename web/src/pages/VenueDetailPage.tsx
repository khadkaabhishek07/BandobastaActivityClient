import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'

type Venue = {
  id: number
  name: string
  description?: string
  city?: string
}

function VenueDetailPage() {
  const { id } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let ignore = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get<Venue>(`/api/venues/${id}`)
        if (!ignore) setVenue(data)
      } catch (err: any) {
        if (!ignore) setError(err?.message || 'Failed to load venue')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [id])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8 text-red-600">{error}</div>
  if (!venue) return <div className="max-w-4xl mx-auto px-4 py-8">Not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">{venue.name}</h1>
      {venue.city && <div className="text-slate-600 mt-1">{venue.city}</div>}
      {venue.description && <p className="mt-4">{venue.description}</p>}
      <div className="mt-6">
        <a href={`/bookings?venueId=${venue.id}`} className="px-5 py-2.5 rounded-full bg-brand text-white">Book now</a>
      </div>
    </div>
  )
}

export default VenueDetailPage

