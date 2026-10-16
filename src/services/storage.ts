import { DEFAULT_PRICING_CONFIG } from '@/constants/pricing'
import {
  DEMO_ADDRESSES,
  DEMO_CLAIMS,
  DEMO_DRIVERS,
  DEMO_ORDERS,
  DEMO_SUPPORT_TICKETS,
} from '@/constants/mockData'
import {
  Address,
  DamageClaim,
  DriverProfile,
  Order,
  PricingConfig,
  SupportTicket,
} from '@/types'

const STORAGE_KEYS = {
  ORDERS: 'localmove_orders_v1',
  DRIVERS: 'localmove_drivers_v1',
  ADDRESSES: 'localmove_addresses_v1',
  CLAIMS: 'localmove_claims_v1',
  TICKETS: 'localmove_tickets_v1',
  PRICING: 'localmove_pricing_v1',
  WALLET_BALANCE: 'localmove_wallet_balance_v1',
  BOOKING_DRAFT: 'localmove_booking_draft_v1',
  DRIVER_SESSION: 'localmove_driver_session_v1',
  USER_LANG: 'localmove_user_lang_v1',
}

export function loadStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEMO_ORDERS
}

export function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  } catch {}
}

export function loadStoredDrivers(): DriverProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEMO_DRIVERS
}

export function saveStoredDrivers(drivers: DriverProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers))
  } catch {}
}

export function loadStoredAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADDRESSES)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length >= DEMO_ADDRESSES.length) {
        return parsed
      }
    }
  } catch {}
  return DEMO_ADDRESSES
}

export function saveStoredAddresses(addresses: Address[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses))
  } catch {}
}

export function loadStoredPricing(): PricingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRICING)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...DEFAULT_PRICING_CONFIG,
        ...parsed,
        vehicles: {
          ...DEFAULT_PRICING_CONFIG.vehicles,
          ...(parsed.vehicles || {}),
        },
      }
    }
  } catch {}
  return DEFAULT_PRICING_CONFIG
}

export function saveStoredPricing(config: PricingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(config))
  } catch {}
}

export function loadStoredClaims(): DamageClaim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEMO_CLAIMS
}

export function saveStoredClaims(claims: DamageClaim[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims))
  } catch {}
}

export function loadStoredTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TICKETS)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEMO_SUPPORT_TICKETS
}

export function saveStoredTickets(tickets: SupportTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets))
  } catch {}
}

export function loadStoredWallet(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE)
    if (raw) return Number(raw)
  } catch {}
  return 350 // Default demo wallet balance ₹350
}

export function saveStoredWallet(balance: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, String(balance))
  } catch {}
}

export function loadBookingDraft<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKING_DRAFT)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function saveBookingDraft<T>(draft: T): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKING_DRAFT, JSON.stringify(draft))
  } catch {}
}

export function clearBookingDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.BOOKING_DRAFT)
  } catch {}
}

export function resetAllDemoData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ORDERS)
    localStorage.removeItem(STORAGE_KEYS.DRIVERS)
    localStorage.removeItem(STORAGE_KEYS.ADDRESSES)
    localStorage.removeItem(STORAGE_KEYS.CLAIMS)
    localStorage.removeItem(STORAGE_KEYS.TICKETS)
    localStorage.removeItem(STORAGE_KEYS.PRICING)
    localStorage.removeItem(STORAGE_KEYS.WALLET_BALANCE)
    localStorage.removeItem(STORAGE_KEYS.BOOKING_DRAFT)
    localStorage.removeItem(STORAGE_KEYS.DRIVER_SESSION)
  } catch {}
}
