import React from 'react'
import { Coordinates } from '@/types'
import { GoogleDeliveryMap } from '@/components/maps/GoogleDeliveryMap'

export interface MockMapProps {
  pickupCoords: Coordinates
  dropCoords: Coordinates
  driverCoords?: Coordinates
  driverVehicleType?: string
  driverName?: string
  isMoving?: boolean
  className?: string
  height?: string
  showTelemetry?: boolean
  pickupAddressLabel?: string
  dropAddressLabel?: string
  additionalMarkers?: Array<{
    id: string
    title: string
    coords: Coordinates
    status: 'online' | 'busy' | 'offline'
    vehicle: string
  }>
}

/**
 * Enhanced Map component powered by Google Maps Platform (@vis.gl/react-google-maps)
 * with graceful fallback to high-fidelity simulated telemetry.
 */
export const MockMap: React.FC<MockMapProps> = (props) => {
  return <GoogleDeliveryMap {...props} />
}
