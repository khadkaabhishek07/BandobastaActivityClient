import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import type { VenueActivityResponse, VenueResourceResponse } from '../types/dto'

type Venue = {
  id: number
  name: string
  description?: string
  city?: string
}

function VenueDetailPage() {
  const { id } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [activities, setActivities] = useState<VenueActivityResponse[]>([])
  const [resources, setResources] = useState<VenueResourceResponse[]>([])
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

  useEffect(() => {
    if (!id) return
    let ignore = false
    async function run() {
      try {
        const [{ data: acts }, { data: res }] = await Promise.all([
          api.get<VenueActivityResponse[]>(`/api/venues/${id}/activities`),
          api.get<VenueResourceResponse[]>(`/api/venues/${id}/resources`),
        ])
        if (!ignore) {
          setActivities(acts || [])
          setResources(res || [])
        }
      } catch (err) {
        // ignore secondary errors
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
      <div className="mt-8 grid gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Activities</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activities.map(a => (
              <li key={a.id} className="border rounded-md p-4">
                <div className="font-medium">{a.name}</div>
                {a.description && <div className="text-sm text-slate-600">{a.description}</div>}
                <div className="text-sm mt-1">Base price: £{a.basePrice}</div>
              </li>
            ))}
            {activities.length === 0 && <div className="text-sm text-slate-600">No activities yet.</div>}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3">Resources</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map(r => (
              <li key={r.id} className="border rounded-md p-4">
                <div className="font-medium">{r.name}</div>
                {r.description && <div className="text-sm text-slate-600">{r.description}</div>}
              </li>
            ))}
            {resources.length === 0 && <div className="text-sm text-slate-600">No resources yet.</div>}
          </ul>
        </section>
        <section>
          <a href={`/bookings?venueId=${venue.id}`} className="inline-block px-5 py-2.5 rounded-full bg-brand text-white">Book now</a>
        </section>
      </div>
    </div>
  )
}

export default VenueDetailPage

