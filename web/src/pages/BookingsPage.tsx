import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiAuth } from '../services/auth'
import { api } from '../services/api'
import type { AvailabilityResponse, BookingResponse, CreateBookingRequest, PricingCategory, VenueActivityResponse, VenueResourceResponse } from '../types/dto'

type Booking = BookingResponse

function BookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resources, setResources] = useState<VenueResourceResponse[]>([])
  const [activities, setActivities] = useState<VenueActivityResponse[]>([])
  const [pricing, setPricing] = useState<PricingCategory[]>([])
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null)
  const [form, setForm] = useState<CreateBookingRequest | null>(null)

  const venueId = searchParams.get('venueId') || ''
  const resourceId = searchParams.get('venueResourceId') || ''
  const activityId = searchParams.get('venueActivityId') || ''

  const canCreate = useMemo(() => Boolean(form && form.participants.length > 0), [form])

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

  // If venueId provided, fetch resources/activities and set up form
  useEffect(() => {
    if (!venueId) return
    let ignore = false
    async function run() {
      try {
        const [{ data: res }, { data: acts }] = await Promise.all([
          api.get<VenueResourceResponse[]>(`/api/venues/${venueId}/resources`),
          api.get<VenueActivityResponse[]>(`/api/venues/${venueId}/activities`),
        ])
        if (!ignore) {
          setResources(res || [])
          setActivities(acts || [])
        }
      } catch {}
    }
    run()
    return () => { ignore = true }
  }, [venueId])

  useEffect(() => {
    if (!activityId) return
    let ignore = false
    async function run() {
      try {
        const { data } = await api.get<PricingCategory[]>(`/api/venues/activities/${activityId}/pricing-categories`)
        if (!ignore) setPricing(data || [])
      } catch {}
    }
    run()
    return () => { ignore = true }
  }, [activityId])

  useEffect(() => {
    if (!(venueId && resourceId && activityId)) return
    let ignore = false
    async function run() {
      try {
        const params = new URLSearchParams({
          venueId: String(venueId),
          venueResourceId: String(resourceId),
          venueActivityId: String(activityId),
          date: new Date().toISOString().slice(0,10),
          durationHours: '1',
        })
        const { data } = await api.get<AvailabilityResponse>(`/api/availability?${params.toString()}`)
        if (!ignore) setAvailability(data || null)
      } catch {}
    }
    run()
    return () => { ignore = true }
  }, [venueId, resourceId, activityId])

  function onCreateSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const token = apiAuth.getToken()
        if (!token) throw new Error('Please login first')
        const headers = { Authorization: `Bearer ${token}` }
        const { data } = await api.post<BookingResponse>(`/api/bookings`, form, { headers })
        setBookings(prev => [data, ...prev])
      } catch (err: any) {
        setError(err?.message || 'Failed to create booking')
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>
      {venueId && (
        <form onSubmit={onCreateSubmit} className="mb-8 border rounded-md p-4 grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select defaultValue={resourceId} onChange={(e) => setSearchParams(prev => { const n = new URLSearchParams(prev); if (e.target.value) n.set('venueResourceId', e.target.value); else n.delete('venueResourceId'); return n })} className="border rounded-md px-3 py-2">
              <option value="">Select Resource</option>
              {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select defaultValue={activityId} onChange={(e) => setSearchParams(prev => { const n = new URLSearchParams(prev); if (e.target.value) n.set('venueActivityId', e.target.value); else n.delete('venueActivityId'); return n })} className="border rounded-md px-3 py-2">
              <option value="">Select Activity</option>
              {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <input type="date" onChange={(e) => setForm(prev => ({ ...(prev || { venueResourceId: Number(resourceId), venueActivityId: Number(activityId), bookingDate: '', startTime: '', endTime: '', participants: [] }), bookingDate: e.target.value }))} className="border rounded-md px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="time" onChange={(e) => setForm(prev => ({ ...(prev as CreateBookingRequest), startTime: e.target.value }))} className="border rounded-md px-3 py-2" />
            <input type="time" onChange={(e) => setForm(prev => ({ ...(prev as CreateBookingRequest), endTime: e.target.value }))} className="border rounded-md px-3 py-2" />
          </div>
          <div>
            <button type="button" onClick={() => setForm(prev => {
              const base: CreateBookingRequest = prev || { venueResourceId: Number(resourceId), venueActivityId: Number(activityId), bookingDate: new Date().toISOString().slice(0,10), startTime: '10:00:00', endTime: '11:00:00', participants: [] }
              const firstPricing = pricing[0]
              return { ...base, participants: [...base.participants, { pricingCategoryId: firstPricing?.id || 0, quantity: 1 }] }
            })} className="rounded-full border px-3 py-1.5">Add Participant</button>
            <div className="mt-3 grid gap-2">
              {(form?.participants || []).map((p, idx) => (
                <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                  <select value={p.pricingCategoryId} onChange={(e) => setForm(prev => {
                    const next = { ...(prev as CreateBookingRequest) }
                    next.participants[idx].pricingCategoryId = Number(e.target.value)
                    return next
                  })} className="border rounded-md px-3 py-2">
                    {pricing.map(pc => <option key={pc.id} value={pc.id}>{pc.name}</option>)}
                  </select>
                  <input type="number" value={p.quantity} min={1} onChange={(e) => setForm(prev => {
                    const next = { ...(prev as CreateBookingRequest) }
                    next.participants[idx].quantity = Number(e.target.value)
                    return next
                  })} className="border rounded-md px-3 py-2" />
                </div>
              ))}
            </div>
          </div>
          <button disabled={!canCreate} className="rounded-full bg-brand text-white px-4 py-2 disabled:opacity-50">Create Booking</button>
          {availability && <div className="text-sm text-slate-600">Available slots today: {availability.availableSlots.filter(s => s.isAvailable).length}</div>}
        </form>
      )}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="divide-y">
        {bookings.map(b => (
          <li key={b.id} className="py-3 flex items-center justify-between">
            <div>#{b.id}</div>
            <div className="text-sm text-slate-600">{b.bookingStatus}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BookingsPage

