import {
  Address,
  Contact,
  HandlingTag,
  ItemCategory,
  ItemSize,
  PaymentMethod,
  Payer,
  VehicleType,
} from '@/types'

export interface BookingFormData {
  // Step 1: Locations & Contacts
  isBookingForOther: boolean
  sender: Contact
  receiver: Contact
  pickupAddress: Address
  dropAddress: Address

  // Step 2: Item Details
  itemCategory: ItemCategory
  itemDescription: string
  itemQuantity: number
  itemSize: ItemSize
  dimensions: {
    length?: number
    width?: number
    height?: number
  }
  approxWeightKg: number
  declaredValueInr: number
  handlingTags: HandlingTag[]
  customerPhotos: string[]

  // Step 3: Vehicle & Extras
  vehicleType: VehicleType
  userOverriddenVehicle: boolean
  helperCount: number
  hasPackingService: boolean
  hasItemProtection: boolean
  returnToSenderIfFailed: boolean
  isScheduled: boolean
  scheduledDate?: string
  scheduledTimeSlot?: string

  // Step 4: Review & Fare
  promoCode: string
  useWallet: boolean
  prohibitedItemsAcknowledged: boolean
  recordingConsentAcknowledged: boolean

  // Step 5: Payment
  paymentMethod: PaymentMethod
  payer: Payer
}
