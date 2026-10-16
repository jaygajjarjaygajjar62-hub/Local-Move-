import { DEMO_PROMO_CODES } from '@/constants/pricing'
import { VEHICLE_OPTIONS } from '@/constants/vehicles'
import { FareBreakdown, OrderItem, PricingConfig, VehicleType } from '@/types'

export interface FareCalculationParams {
  distanceKm: number
  vehicleType: VehicleType
  item: OrderItem
  helperCount: number
  hasPackingService: boolean
  hasItemProtection: boolean
  promoCode?: string
  applyWalletBalance?: number
  pricingConfig: PricingConfig
  isNightHours?: boolean
}

/**
 * Transparent, Industry-Standard Logistics Fare Calculation Engine.
 *
 * Pricing Formula:
 * 1. Base Transport Fare:
 *    Covers minimum mobilization and initial included distance (e.g., first 2 km for 2W/3W, 3 km for Tata Ace, 4 km for Tempo, 5 km for Eicher).
 * 2. Additional Distance Charge:
 *    Charged only on distance beyond the included base kilometers:
 *    additionalKm = Math.max(0, distanceKm - includedKm)
 *    distanceCharge = Math.round(additionalKm * perKmRate)
 * 3. Cargo Weight Surcharge:
 *    Applied fairly if payload exceeds vehicle nominal rating.
 * 4. Value-Added Logistics Services:
 *    - Doorstep Handover & Digital Proof of Condition: ₹20 - ₹60
 *    - Trained Loading/Unloading Helpers: ₹180 per helper
 *    - Multi-layer Protective Packaging: ₹250
 *    - Comprehensive Transit Insurance: 1.5% of declared value (min ₹25, max ₹500 for demo)
 * 5. Statutory Goods Transport GST: 5%
 */
export function calculateFareBreakdown(params: FareCalculationParams): FareBreakdown {
  const {
    distanceKm: rawDistanceKm,
    vehicleType,
    item,
    helperCount,
    hasPackingService,
    hasItemProtection,
    promoCode,
    applyWalletBalance = 0,
    pricingConfig,
    isNightHours = false,
  } = params

  const vehicleRates = pricingConfig.vehicles[vehicleType] || VEHICLE_OPTIONS[vehicleType] || VEHICLE_OPTIONS.mini_truck
  const baseFare = vehicleRates.baseFare
  const perKmRate = vehicleRates.perKmRate
  const includedKm = vehicleRates.minDistanceKm || 2

  // Distance rounding to 1 decimal place
  const distanceKm = Number(Math.max(1.0, rawDistanceKm).toFixed(1))

  // Additional km beyond what is covered by the base fare
  const additionalKm = Number(Math.max(0, distanceKm - includedKm).toFixed(1))
  const distanceCharge = Math.round(additionalKm * perKmRate)

  // Weight surcharge: if declared cargo weight exceeds vehicle capacity rating
  const vehicleSpec = VEHICLE_OPTIONS[vehicleType]
  let weightSurcharge = 0
  if (vehicleSpec && item.approxWeightKg > vehicleSpec.capacityWeightKg) {
    const excessKg = item.approxWeightKg - vehicleSpec.capacityWeightKg
    weightSurcharge = Math.round(excessKg * 2.5) // ₹2.5 per excess kg
  }

  // Tiered doorstep handling and digital handover proof fee
  let handlingFee = pricingConfig.handlingFee || 25
  if (vehicleType === 'bike') handlingFee = 15
  else if (vehicleType === 'cargo_auto') handlingFee = 20
  else if (vehicleType === 'mini_truck') handlingFee = 30
  else if (vehicleType === 'large_tempo') handlingFee = 40
  else if (vehicleType === 'truck_eicher') handlingFee = 60

  // Extras
  const helperCharge = helperCount * (pricingConfig.helperRatePerHelper || 180)
  const packingCharge = hasPackingService ? (pricingConfig.packingBaseRate || 250) : 0

  let itemProtectionFee = 0
  if (hasItemProtection && item.declaredValueInr > 0) {
    const rawFee = (item.declaredValueInr * (pricingConfig.itemProtectionRatePercent || 1.5)) / 100
    itemProtectionFee = Math.max(25, Math.min(500, Math.round(rawFee)))
  }

  const transportSubtotal = baseFare + distanceCharge + weightSurcharge
  const servicesSubtotal = handlingFee + helperCharge + packingCharge + itemProtectionFee
  const rawSubtotal = transportSubtotal + servicesSubtotal

  // Night hours surge (11 PM - 6 AM) or dynamic demand surge
  let nightSurgeAdjustment = 0
  if (isNightHours || pricingConfig.isSurgeActive) {
    nightSurgeAdjustment = Math.round(transportSubtotal * ((pricingConfig.nightSurgeMultiplier || 1.25) - 1))
  }

  const subtotalWithSurge = rawSubtotal + nightSurgeAdjustment

  // Promo Code Discount Calculation
  let discount = 0
  let promoCodeApplied: string | undefined

  if (promoCode) {
    const cleanedCode = promoCode.trim().toUpperCase()
    const promo = DEMO_PROMO_CODES[cleanedCode]
    if (promo && subtotalWithSurge >= promo.minOrderValue) {
      discount = Math.min(
        promo.maxDiscount,
        Math.round((subtotalWithSurge * promo.discountPercent) / 100),
      )
      promoCodeApplied = cleanedCode
    }
  }

  // GST (5% standard for Goods Transport Agency services)
  const taxableAmount = Math.max(0, subtotalWithSurge - discount)
  const taxesGst = Math.round((taxableAmount * (pricingConfig.gstTaxRatePercent || 5)) / 100)

  const grossTotal = taxableAmount + taxesGst
  const walletDeduction = Math.min(applyWalletBalance, grossTotal)
  const totalCustomerFare = Math.max(0, grossTotal - walletDeduction)

  // Driver commission share (80% default) and platform technology share
  const driverShare = Math.round((subtotalWithSurge * (pricingConfig.driverSharePercent || 80)) / 100)
  const companyShare = Math.max(0, grossTotal - driverShare)

  // Approximate transit minutes for display
  const avgSpeed = vehicleSpec?.speedKmph || 25
  const estimatedDurationMin = Math.max(5, Math.round((distanceKm / avgSpeed) * 60) + (helperCount > 0 ? 15 : 8))

  return {
    baseFare,
    distanceKm,
    distanceCharge,
    includedKm,
    additionalKm,
    perKmRate,
    handlingFee,
    helperCount,
    helperCharge,
    packingCharge,
    itemProtectionFee,
    weightSurcharge,
    nightSurgeAdjustment,
    subtotal: subtotalWithSurge,
    taxesGst,
    discount,
    promoCodeApplied,
    walletDeduction,
    totalCustomerFare,
    driverShare,
    companyShare,
    isEstimate: true,
    estimatedDurationMin,
  }
}
