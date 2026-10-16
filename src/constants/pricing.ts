import { PricingConfig } from '@/types'

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  city: 'Gujarat Logistics Corridor (Anand • Ahmedabad • Vadodara)',
  vehicles: {
    bike: { baseFare: 45, perKmRate: 10, minDistanceKm: 2 },
    cargo_auto: { baseFare: 140, perKmRate: 16, minDistanceKm: 2 },
    mini_truck: { baseFare: 280, perKmRate: 22, minDistanceKm: 3 },
    large_tempo: { baseFare: 520, perKmRate: 28, minDistanceKm: 4 },
    truck_eicher: { baseFare: 1150, perKmRate: 38, minDistanceKm: 5 },
  },
  handlingFee: 25,
  helperRatePerHelper: 180,
  packingBaseRate: 250,
  itemProtectionRatePercent: 1.5,
  nightSurgeMultiplier: 1.25,
  isSurgeActive: false,
  gstTaxRatePercent: 5,
  driverSharePercent: 80,
  maxDriverCashLimit: 1500,
  freeWaitMinutes: 10,
  waitChargePerMinute: 3,
}

export const DEMO_PROMO_CODES: Record<string, { discountPercent: number; maxDiscount: number; minOrderValue: number }> = {
  LOCALMOVE50: { discountPercent: 50, maxDiscount: 50, minOrderValue: 80 },
  FIRSTMOVE: { discountPercent: 20, maxDiscount: 100, minOrderValue: 100 },
  AERA2026: { discountPercent: 15, maxDiscount: 150, minOrderValue: 200 },
}
