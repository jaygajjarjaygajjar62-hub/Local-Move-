export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount))
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return isoString
  }
}

export function formatTimeOnly(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return isoString
  }
}

export function formatIndianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

export function maskAadhaar(aadhaar: string): string {
  const cleaned = aadhaar.replace(/\D/g, '')
  if (cleaned.length >= 4) {
    const last4 = cleaned.slice(-4)
    return `XXXX-XXXX-${last4}`
  }
  return 'XXXX-XXXX-8921'
}

export function formatDistanceKm(km: number): string {
  return `${km.toFixed(1)} km`
}

export function calculateEtaMinutes(distanceKm: number, speedKmph: number): number {
  if (speedKmph <= 0) return 15
  const minutes = Math.round((distanceKm / speedKmph) * 60)
  return Math.max(8, minutes + 5) // Includes 5 mins baseline traffic/parking buffer
}
