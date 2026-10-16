import { Coordinates } from '@/types'
import { calculateAccurateRouteDistanceSync } from './distanceRoutingService'

export function calculateDistanceKm(c1: Coordinates, c2: Coordinates): number {
  return calculateAccurateRouteDistanceSync(c1, c2).distanceKm
}

export function interpolateCoordinates(
  from: Coordinates,
  to: Coordinates,
  progressRatio: number, // 0 to 1
): Coordinates {
  const clamped = Math.max(0, Math.min(1, progressRatio))
  // Add a subtle route jitter so the path feels like actual road turns rather than a straight diagonal
  const jitterLat = Math.sin(clamped * Math.PI * 3) * 0.002
  const jitterLng = Math.cos(clamped * Math.PI * 2) * 0.002

  return {
    lat: Number((from.lat + (to.lat - from.lat) * clamped + jitterLat).toFixed(5)),
    lng: Number((from.lng + (to.lng - from.lng) * clamped + jitterLng).toFixed(5)),
  }
}

export function generateRoutePoints(from: Coordinates, to: Coordinates, steps = 8): Coordinates[] {
  const points: Coordinates[] = []
  for (let i = 0; i <= steps; i++) {
    points.push(interpolateCoordinates(from, to, i / steps))
  }
  return points
}
