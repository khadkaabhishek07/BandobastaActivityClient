// Generic API response wrapper
export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
}

// Venue related
export type VenueResponse = {
  id: number
  name: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  contactPhone?: string
  contactEmail?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  bookingFee: number
  minimumPayment: number
  ownerId: number
}

export type VenueResourceResponse = {
  id: number
  venueId: number
  name: string
  description?: string
  capacity?: number
  isActive: boolean
}

export type VenueActivityResponse = {
  id: number
  venueId: number
  name: string
  description?: string
  basePrice: number
  isActive: boolean
}

export type PricingCategory = {
  id: number
  name: string
  price: number
}

// Booking related
export type BookingParticipantRequest = {
  pricingCategoryId: number
  quantity: number
}

export type CreateBookingRequest = {
  venueResourceId: number
  venueActivityId: number
  bookingDate: string // YYYY-MM-DD
  startTime: string // HH:MM:SS
  endTime: string // HH:MM:SS
  participants: BookingParticipantRequest[]
}

export type BookingResponse = {
  id: number
  userId: number
  firstName: string
  lastName: string
  userPhone: string
  venueResourceId: number
  venueActivityId: number
  bookingDate: string
  startTime: string
  endTime: string
  totalHours: number
  totalAmount: number
  amountPaid: number
  minimumPaymentRequired: number
  bookingStatus: number
  paymentStatus: number
  paymentMethod?: string
  paymentReference?: string
  createdAt: string
  updatedAt: string
}

// Availability
export type TimeSlotResponse = {
  startTime: string
  endTime: string
  pricePerHour: number
  isAvailable: boolean
}

export type AvailabilityResponse = {
  venueResourceId: number
  resourceName: string
  date: string
  availableSlots: TimeSlotResponse[]
}

// Payments
export type ProcessPaymentRequest = {
  bookingId: number
  paymentMethod: string
  paymentReference: string
  amount: number
}

