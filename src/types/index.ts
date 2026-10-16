export type UserRole = 'customer' | 'driver' | 'admin' | 'receiver'

export type AdminSubRole = 'super_admin' | 'operations' | 'support' | 'finance'

export type Language = 'en' | 'hi' | 'gu'

export type VehicleType = 'bike' | 'cargo_auto' | 'mini_truck' | 'large_tempo' | 'truck_eicher'

export type ItemCategory =
  | 'documents'
  | 'electronics'
  | 'groceries'
  | 'clothes'
  | 'furniture'
  | 'appliances'
  | 'household_shifting'
  | 'other'

export type ItemSize = 'small' | 'medium' | 'large' | 'xlarge'

export type HandlingTag =
  | 'fragile'
  | 'keep_upright'
  | 'liquid'
  | 'needs_two_people'
  | 'stairs_carry'

export type OrderStatus =
  | 'created'
  | 'searching_driver'
  | 'driver_assigned'
  | 'arrived_at_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'arrived_at_drop'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'failed_returned'
  | 'under_dispute'

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'wallet' | 'receiver_pays'

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

export type Payer = 'sender' | 'receiver'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Address {
  id?: string
  title?: string
  fullAddress: string
  landmark?: string
  floor?: string
  instructions?: string
  coords: Coordinates
  city?: string
}

export interface Contact {
  name: string
  phone: string
}

export interface OrderItem {
  category: ItemCategory
  description: string
  quantity: number
  size: ItemSize
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  approxWeightKg: number
  declaredValueInr: number
  handlingTags: HandlingTag[]
  customerPhotos: string[]
}

export interface ProofMedia {
  id: string
  type: 'photo' | 'video'
  url: string
  timestamp: string
  stage: 'pickup' | 'drop'
  notes?: string
}

export interface OrderProof {
  pickupOtpVerified: boolean
  pickupOtpEnteredAt?: string
  pickupSenderNameConfirmed: boolean
  pickupProofs: ProofMedia[]
  pickupCustomerApproved: boolean

  dropOtpVerified: boolean
  dropOtpEnteredAt?: string
  dropReceiverNameConfirmed: boolean
  dropProofs: ProofMedia[]
  dropReceiverAcknowledged: boolean
  dropIssueReported?: string

  cashCollectedConfirmed?: boolean
  cashAmountCollected?: number
}

export interface FareBreakdown {
  baseFare: number
  distanceKm: number
  distanceCharge: number
  includedKm?: number
  additionalKm?: number
  perKmRate?: number
  handlingFee: number
  helperCount: number
  helperCharge: number
  packingCharge: number
  itemProtectionFee: number
  weightSurcharge?: number
  nightSurgeAdjustment: number
  subtotal: number
  taxesGst: number
  discount: number
  promoCodeApplied?: string
  walletDeduction: number
  totalCustomerFare: number
  driverShare: number
  companyShare: number
  isEstimate: boolean
  estimatedDurationMin?: number
}

export interface VehicleOption {
  type: VehicleType
  name: string
  subtitle: string
  capacityWeightKg: number
  capacityVolumeDesc: string
  baseFare: number
  perKmRate: number
  minDistanceKm?: number
  speedKmph: number
  idealFor: string
  iconName: string
}

export interface Order {
  id: string
  trackingToken: string
  createdAt: string
  updatedAt: string
  status: OrderStatus
  customer: {
    id: string
    name: string
    phone: string
  }
  sender: Contact
  receiver: Contact
  pickupAddress: Address
  dropAddress: Address
  item: OrderItem
  vehicleType: VehicleType
  helpersCount: number
  hasPackingService: boolean
  hasItemProtection: boolean
  isScheduled: boolean
  scheduledTime?: string
  returnToSenderIfFailed: boolean

  fare: FareBreakdown
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  payer: Payer

  pickupOtp: string
  dropOtp: string

  assignedDriver?: {
    id: string
    name: string
    phone: string
    avatar: string
    vehicleNumber: string
    vehicleModel: string
    vehicleType: VehicleType
    rating: number
    totalTrips: number
    currentCoords: Coordinates
  }

  proofs: OrderProof
  timeline: {
    status: OrderStatus
    timestamp: string
    note: string
  }[]

  driverRating?: {
    stars: number
    comment?: string
    tipInr?: number
    createdAt: string
  }

  rescheduleRequest?: {
    requestedBy: 'receiver' | 'customer'
    newDate: string
    newTimeSlot: string
    status: 'pending' | 'approved' | 'rejected'
  }

  isDelayed?: boolean
  lastKnownLocation?: Coordinates
  cancelReason?: string
}

export interface DriverDocument {
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  frontUrl?: string
  backUrl?: string
  number?: string
  expiryDate?: string
  rejectionReason?: string
}

export interface DriverProfile {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  isOnline: boolean
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  vehicleType: VehicleType
  vehicleNumber: string
  vehicleModel: string
  rating: number
  totalTrips: number
  acceptanceRate: number
  completionRate: number
  cashInHandBalance: number
  companyShareOwed: number
  todayEarnings: number
  activeDeliveryMinutes: number
  onlineMinutes: number
  waitingMinutes: number
  documents: {
    licence: DriverDocument
    aadhaar: DriverDocument & { maskedNumber: string }
    rc: DriverDocument
    selfie: DriverDocument
  }
  activeOrderId?: string
  currentCoords: Coordinates
}

export interface PricingConfig {
  city: string
  vehicles: Record<
    VehicleType,
    {
      baseFare: number
      perKmRate: number
      minDistanceKm: number
    }
  >
  handlingFee: number
  helperRatePerHelper: number
  packingBaseRate: number
  itemProtectionRatePercent: number
  nightSurgeMultiplier: number
  isSurgeActive: boolean
  gstTaxRatePercent: number
  driverSharePercent: number
  maxDriverCashLimit: number
  freeWaitMinutes: number
  waitChargePerMinute: number
}

export interface SupportTicket {
  id: string
  orderId?: string
  userId: string
  userRole: UserRole
  userName: string
  userPhone: string
  subject: string
  category: 'delivery_delay' | 'damage_claim' | 'wrong_charge' | 'driver_issue' | 'receiver_absent' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  messages: {
    id: string
    sender: 'user' | 'agent'
    senderName: string
    text: string
    timestamp: string
  }[]
}

export interface DamageClaim {
  id: string
  orderId: string
  customerId?: string
  customerName: string
  customerPhone: string
  driverName: string
  itemDescription: string
  declaredValueInr: number
  claimedAmountInr: number
  approvedCompensationInr?: number
  pickupPhotos: string[]
  dropPhotos: string[]
  description: string
  status: 'open' | 'under_review' | 'approved' | 'rejected'
  assignedInvestigator?: string
  resolutionNotes?: string
  createdAt: string
}
