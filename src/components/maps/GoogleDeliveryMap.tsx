import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Coordinates } from '@/types'
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps'
import { useGoogleMaps } from '@/context/GoogleMapsContext'
import { useTheme } from '@/context/ThemeContext'
import { interpolateCoordinates } from '@/services/trackingSimulator'
import {
  calculateAccurateRouteDistanceSync,
  calculateAccurateRouteDistance,
  decodePolyline,
} from '@/services/distanceRoutingService'
import {
  Bike,
  Truck,
  Car,
  MapPin,
  Flag,
  Navigation,
  Layers,
  Settings,
  Sparkles,
  Route,
} from 'lucide-react'

export interface GoogleDeliveryMapProps {
  pickupCoords: Coordinates
  dropCoords: Coordinates
  driverCoords?: Coordinates
  driverVehicleType?: string
  driverName?: string
  driverPlate?: string
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
 * Child helper component to manage native Google Maps Polyline, Directions & FitBounds inside <Map>
 */
const RoutePolylineAndBounds: React.FC<{
  pickup: Coordinates
  drop: Coordinates
  driver: Coordinates
  showTraffic: boolean
}> = ({ pickup, drop, driver, showTraffic }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !(window as any).google?.maps) return

    const googleMaps = (window as any).google.maps
    if (!pickup?.lat || !drop?.lat) return

    // Fit initial bounds to include pickup and drop
    const bounds = new googleMaps.LatLngBounds()
    bounds.extend({ lat: Number(pickup.lat), lng: Number(pickup.lng) })
    bounds.extend({ lat: Number(drop.lat), lng: Number(drop.lng) })
    if (driver?.lat && driver?.lng) {
      bounds.extend({ lat: Number(driver.lat), lng: Number(driver.lng) })
    }
    map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 })

    // Route Outline
    const routeOutline = new googleMaps.Polyline({
      strokeColor: '#064e3b',
      strokeOpacity: 0.6,
      strokeWeight: 8,
      map,
    })

    // Active Route Polyline
    const activeRoute = new googleMaps.Polyline({
      strokeColor: '#10b981',
      strokeOpacity: 0.95,
      strokeWeight: 5,
      map,
    })

    // Fetch exact road route polyline via Google Routes API (New)
    let isMounted = true
    fetch('/api/v1/maps/compute-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: { lat: pickup.lat, lng: pickup.lng },
        destination: { lat: drop.lat, lng: drop.lng },
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => {
        if (!isMounted) return
        const data = res?.data || res
        if (data?.encodedPolyline) {
          const points = decodePolyline(data.encodedPolyline)
          if (points.length > 0) {
            activeRoute.setPath(points)
            routeOutline.setPath(points)
            const rBounds = new googleMaps.LatLngBounds()
            points.forEach((p) => rBounds.extend(p))
            map.fitBounds(rBounds, { top: 60, bottom: 60, left: 60, right: 60 })
            return
          }
        }

        // Fallback: Try legacy DirectionsService if available
        if (googleMaps.DirectionsService) {
          const dirService = new googleMaps.DirectionsService()
          dirService.route(
            {
              origin: { lat: pickup.lat, lng: pickup.lng },
              destination: { lat: drop.lat, lng: drop.lng },
              travelMode: googleMaps.TravelMode.DRIVING,
            },
            (dRes: any, status: any) => {
              if (!isMounted) return
              if (status === 'OK' && dRes?.routes?.[0]?.overview_path) {
                const overviewPath = dRes.routes[0].overview_path
                activeRoute.setPath(overviewPath)
                routeOutline.setPath(overviewPath)
                if (dRes.routes[0].bounds) {
                  map.fitBounds(dRes.routes[0].bounds, { top: 60, bottom: 60, left: 60, right: 60 })
                }
              } else {
                // Curved fallback
                const fallbackPath = [
                  { lat: pickup.lat, lng: pickup.lng },
                  {
                    lat: (pickup.lat + drop.lat) / 2 + 0.003,
                    lng: (pickup.lng + drop.lng) / 2 - 0.004,
                  },
                  { lat: drop.lat, lng: drop.lng },
                ]
                activeRoute.setPath(fallbackPath)
                routeOutline.setPath(fallbackPath)
              }
            },
          )
        }
      })
      .catch(() => {
        // Fallback curved path
        const fallbackPath = [
          { lat: pickup.lat, lng: pickup.lng },
          {
            lat: (pickup.lat + drop.lat) / 2 + 0.003,
            lng: (pickup.lng + drop.lng) / 2 - 0.004,
          },
          { lat: drop.lat, lng: drop.lng },
        ]
        activeRoute.setPath(fallbackPath)
        routeOutline.setPath(fallbackPath)
      })

    // Optional Traffic layer
    let trafficLayer: any = null
    if (showTraffic && googleMaps.TrafficLayer) {
      trafficLayer = new googleMaps.TrafficLayer()
      trafficLayer.setMap(map)
    }

    return () => {
      isMounted = false
      routeOutline.setMap(null)
      activeRoute.setMap(null)
      if (trafficLayer) trafficLayer.setMap(null)
    }
  }, [map, pickup.lat, pickup.lng, drop.lat, drop.lng, driver.lat, driver.lng, showTraffic])

  return null
}

export const GoogleDeliveryMap: React.FC<GoogleDeliveryMapProps> = ({
  pickupCoords,
  dropCoords,
  driverCoords,
  driverVehicleType = 'bike',
  driverName = 'Ramesh Kumar (Partner)',
  driverPlate = 'GJ-01-LM-9281',
  isMoving = false,
  className = '',
  height = 'h-72 sm:h-96',
  showTelemetry = true,
  pickupAddressLabel = 'Pickup Location',
  dropAddressLabel = 'Drop Location',
  additionalMarkers = [],
}) => {
  const { hasKey, mapMode, setMapMode, setIsConfigModalOpen, attributionId } = useGoogleMaps()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isApiLoaded = useApiIsLoaded()

  const [progress, setProgress] = useState(isMoving ? 0.35 : 0)
  const [showTraffic, setShowTraffic] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<'pickup' | 'drop' | 'driver' | null>(null)

  // Smooth live telemetry animation if isMoving is active
  useEffect(() => {
    if (!isMoving) {
      setProgress(0)
      return
    }
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 0.95 ? 0.05 : prev + 0.02))
    }, 2500)
    return () => clearInterval(interval)
  }, [isMoving])

  // Safe normalized coordinates to guard against undefined props
  const safePickup = useMemo(
    () => ({
      lat: Number(pickupCoords?.lat || 22.54607),
      lng: Number(pickupCoords?.lng || 72.9818),
    }),
    [pickupCoords?.lat, pickupCoords?.lng],
  )

  const safeDrop = useMemo(
    () => ({
      lat: Number(dropCoords?.lat || 22.5528),
      lng: Number(dropCoords?.lng || 72.9242),
    }),
    [dropCoords?.lat, dropCoords?.lng],
  )

  // Current driver coordinate
  const currentDriverPos = useMemo(() => {
    if (driverCoords?.lat && driverCoords?.lng) {
      return { lat: Number(driverCoords.lat), lng: Number(driverCoords.lng) }
    }
    if (isMoving) {
      return interpolateCoordinates(safePickup, safeDrop, progress)
    }
    return safePickup
  }, [driverCoords, safePickup, safeDrop, progress, isMoving])

  // Accurate Distance & ETA calculation using realistic road router
  const routeEstimate = useMemo(() => {
    return calculateAccurateRouteDistanceSync(safePickup, safeDrop, driverVehicleType as any)
  }, [safePickup, safeDrop, driverVehicleType])

  const totalDistanceKm = routeEstimate.distanceKm

  const remainingDistanceKm = useMemo(() => {
    if (!isMoving) return totalDistanceKm
    return Math.max(0.3, Number((totalDistanceKm * (1 - progress)).toFixed(1)))
  }, [totalDistanceKm, progress, isMoving])

  const remainingMinutes = useMemo(() => {
    if (!isMoving) return routeEstimate.durationMin
    return Math.max(3, Math.round(remainingDistanceKm * (routeEstimate.durationMin / (totalDistanceKm || 1))))
  }, [remainingDistanceKm, isMoving, routeEstimate.durationMin, totalDistanceKm])

  // Determine if Google Maps engine should be actively rendered
  const useGoogleEngine = hasKey && isApiLoaded && mapMode === 'google'

  const renderVehicleIcon = (vType: string, iconClassName = 'w-4 h-4 text-white') => {
    switch (vType) {
      case 'mini_truck':
      case 'large_tempo':
      case 'truck_eicher':
        return <Truck className={iconClassName} />
      case 'cargo_auto':
        return <Car className={iconClassName} />
      default:
        return <Bike className={iconClassName} />
    }
  }

  return (
    <div
      role="region"
      aria-label="Interactive delivery tracking map"
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm select-none ${height} ${className}`}
    >
      {useGoogleEngine ? (
        /* ================= GOOGLE MAPS ENGINE ================= */
        <div className="w-full h-full relative">
          <Map
            mapId="LOCALMOVE_DELIVERY_MAP_ID"
            defaultCenter={{
              lat: (safePickup.lat + safeDrop.lat) / 2,
              lng: (safePickup.lng + safeDrop.lng) / 2,
            }}
            defaultZoom={13}
            colorScheme={isDark ? ('DARK' as any) : ('LIGHT' as any)}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
            internalUsageAttributionIds={[attributionId]}
          >
            {/* Native Polyline, Driving Directions & Bounds controller */}
            <RoutePolylineAndBounds
              pickup={safePickup}
              drop={safeDrop}
              driver={currentDriverPos}
              showTraffic={showTraffic}
            />

            {/* PICKUP ADVANCED MARKER */}
            <AdvancedMarker
              position={{ lat: safePickup.lat, lng: safePickup.lng }}
              onClick={() => setSelectedMarker('pickup')}
              title={`Pickup: ${pickupAddressLabel}`}
            >
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-extrabold shadow-md whitespace-nowrap mb-1">
                  Pickup
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white">
                  <MapPin className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </AdvancedMarker>

            {/* DROP ADVANCED MARKER */}
            <AdvancedMarker
              position={{ lat: safeDrop.lat, lng: safeDrop.lng }}
              onClick={() => setSelectedMarker('drop')}
              title={`Drop: ${dropAddressLabel}`}
            >
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="px-2 py-0.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-extrabold shadow-md whitespace-nowrap mb-1">
                  Drop
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white border-2 border-emerald-500 shadow-lg flex items-center justify-center text-white dark:text-slate-900">
                  <Flag className="w-4 h-4 stroke-[2.5] text-emerald-400 dark:text-emerald-600" />
                </div>
              </div>
            </AdvancedMarker>

            {/* LIVE DRIVER ADVANCED MARKER (when active/moving) */}
            {isMoving && (
              <AdvancedMarker
                position={{ lat: currentDriverPos.lat, lng: currentDriverPos.lng }}
                onClick={() => setSelectedMarker('driver')}
                title={`Delivery Partner: ${driverName} (${driverPlate})`}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-white relative">
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
                    {renderVehicleIcon(driverVehicleType, 'w-5 h-5 text-white')}
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* INFO WINDOW ON MARKER CLICK */}
            {selectedMarker === 'driver' && isMoving && (
              <InfoWindow
                position={{ lat: currentDriverPos.lat, lng: currentDriverPos.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2 text-slate-900 text-xs space-y-1">
                  <div className="font-extrabold text-sm">{driverName}</div>
                  <div className="text-slate-600 font-mono">{driverPlate}</div>
                  <div className="text-emerald-700 font-bold">
                    ETA: ~{remainingMinutes} mins ({remainingDistanceKm} km away)
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      ) : (
        /* ================= DYNAMIC VECTOR ENGINE ================= */
        <SimulatedVectorCanvas
          pickupCoords={safePickup}
          dropCoords={safeDrop}
          currentDriverPos={currentDriverPos}
          driverVehicleType={driverVehicleType}
          driverName={driverName}
          driverPlate={driverPlate}
          progress={progress}
          isMoving={isMoving}
          isDark={isDark}
          renderVehicleIcon={renderVehicleIcon}
        />
      )}

      {/* OVERLAY TELEMETRY & CONTROLS HUD */}
      {showTelemetry && (
        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none gap-2">
          {/* Telemetry Capsule */}
          <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2 sm:gap-3 text-xs min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${isMoving ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'}`} />
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] sm:text-[11px]">
                {isMoving ? 'Live GPS' : 'Route Calculated'}
              </span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs">
              <span className="font-black text-emerald-700 dark:text-emerald-400 font-mono text-xs sm:text-sm mr-1">
                {isMoving ? `${remainingDistanceKm} km` : `${totalDistanceKm} km`}
              </span>
              <span className="hidden sm:inline">{isMoving ? 'remaining' : 'transit'}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="font-bold text-slate-700 dark:text-slate-200 shrink-0 text-xs">
              ETA:{' '}
              <span className="font-black text-slate-900 dark:text-white font-mono text-xs sm:text-sm">
                ~{remainingMinutes}m
              </span>
            </div>
          </div>

          {/* Quick Engine Switch & Settings Badge */}
          <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
              title="Google Maps Platform Key & Settings"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">
                {hasKey ? 'GMP Active' : 'Connect Maps API'}
              </span>
            </button>

            {hasKey && (
              <button
                type="button"
                onClick={() => setMapMode(mapMode === 'google' ? 'simulated' : 'google')}
                className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md text-xs font-extrabold transition-colors shrink-0"
                title={`Switch engine (Current: ${mapMode})`}
              >
                {mapMode === 'google' ? 'Google' : 'Vector'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM SPEED & DRIVER / ROUTE BADGE */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 pointer-events-none max-w-[85%]">
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-800 shadow-md text-xs font-bold flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-600 text-white shrink-0">
            {renderVehicleIcon(driverVehicleType, 'w-3 h-3 text-white')}
          </div>
          <div className="min-w-0">
            <span className="block text-[11px] font-extrabold leading-none text-slate-100 truncate">
              {isMoving ? driverName : `${driverVehicleType.replace('_', ' ').toUpperCase()} Road Transit`}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5 block truncate">
              {totalDistanceKm} km verified route • {routeEstimate.isIntercity ? 'Intercity Highway' : 'City Road Network'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dynamic Vector Canvas for reliable fallback & demo mode.
 * Dynamically computes projection bounds around pickup & drop pins anywhere in Gujarat or India!
 */
const SimulatedVectorCanvas: React.FC<{
  pickupCoords: Coordinates
  dropCoords: Coordinates
  currentDriverPos: Coordinates
  driverVehicleType: string
  driverName: string
  driverPlate: string
  progress: number
  isMoving: boolean
  isDark: boolean
  renderVehicleIcon: (type: string, cls?: string) => React.ReactNode
}> = ({
  pickupCoords,
  dropCoords,
  currentDriverPos,
  driverVehicleType,
  driverName,
  progress,
  isMoving,
  isDark,
  renderVehicleIcon,
}) => {
  // Dynamically compute bounding box encompassing pickup, drop, and vehicle
  const lats = [pickupCoords.lat, dropCoords.lat, currentDriverPos.lat].filter(Number.isFinite)
  const lngs = [pickupCoords.lng, dropCoords.lng, currentDriverPos.lng].filter(Number.isFinite)

  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

  // Minimum bounding spans with generous padding
  const latSpan = Math.max(0.04, (Math.max(...lats) - Math.min(...lats)) * 1.5)
  const lngSpan = Math.max(0.06, (Math.max(...lngs) - Math.min(...lngs)) * 1.5)

  const minLat = centerLat - latSpan / 2
  const maxLat = centerLat + latSpan / 2
  const minLng = centerLng - lngSpan / 2
  const maxLng = centerLng + lngSpan / 2

  const toSvgX = (lng: number) => {
    const val = Number.isFinite(lng) ? lng : centerLng
    return Math.max(90, Math.min(910, ((val - minLng) / (maxLng - minLng)) * 820 + 90))
  }

  const toSvgY = (lat: number) => {
    const val = Number.isFinite(lat) ? lat : centerLat
    return Math.max(70, Math.min(530, (1 - (val - minLat) / (maxLat - minLat)) * 460 + 70))
  }

  const pickupX = toSvgX(pickupCoords.lng)
  const pickupY = toSvgY(pickupCoords.lat)
  const dropX = toSvgX(dropCoords.lng)
  const dropY = toSvgY(dropCoords.lat)
  const driverX = toSvgX(currentDriverPos.lng)
  const driverY = toSvgY(currentDriverPos.lat)

  // Natural curved trajectory connecting pickup and drop
  const midX = (pickupX + dropX) / 2 + (dropY > pickupY ? 60 : -60)
  const midY = (pickupY + dropY) / 2 + (dropX > pickupX ? -40 : 40)
  const pathD = `M ${pickupX} ${pickupY} Q ${midX} ${midY} ${dropX} ${dropY}`

  // Detect corridor
  const isAnandCorridor = pickupCoords.lat < 22.8 && dropCoords.lat < 22.8
  const isIntercity = Math.abs(pickupCoords.lat - dropCoords.lat) > 0.25

  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-950">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full object-cover transition-colors duration-200"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="gmapGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="1000" height="600" fill={isDark ? '#090d16' : '#f8fafc'} />
        <rect width="1000" height="600" fill="url(#gmapGrid)" />

        {/* Arterial Highways */}
        <path
          d="M 60 160 Q 500 130 940 170"
          stroke={isDark ? '#1e293b' : '#cbd5e1'}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 90 480 Q 480 460 910 500"
          stroke={isDark ? '#1e293b' : '#cbd5e1'}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 280 60 Q 300 300 270 540"
          stroke={isDark ? '#1e293b' : '#cbd5e1'}
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M 720 60 Q 740 300 710 540"
          stroke={isDark ? '#1e293b' : '#cbd5e1'}
          strokeWidth="10"
          fill="none"
        />

        {/* Region Watermark */}
        <text
          x="500"
          y="560"
          textAnchor="middle"
          fill={isDark ? '#334155' : '#cbd5e1'}
          fontSize="15"
          fontWeight="800"
          letterSpacing="2"
        >
          {isAnandCorridor
            ? 'ANAND / VALLABH VIDYANAGAR LOGISTICS CORRIDOR'
            : isIntercity
            ? 'GUJARAT INTERCITY EXPRESS ROUTE'
            : 'GUJARAT METRO LOGISTICS GRID'}
        </text>

        {/* Route Shadow & Active Polyline */}
        <path d={pathD} stroke="#047857" strokeWidth="8" strokeOpacity="0.4" fill="none" />
        <path
          d={pathD}
          stroke="#10b981"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 4"
        />

        {/* Pickup Pin */}
        <circle cx={pickupX} cy={pickupY} r="18" fill="#059669" />
        <circle cx={pickupX} cy={pickupY} r="8" fill="#ffffff" />
        <text
          x={pickupX}
          y={pickupY - 26}
          textAnchor="middle"
          fill={isDark ? '#34d399' : '#047857'}
          fontSize="14"
          fontWeight="900"
        >
          PICKUP
        </text>

        {/* Drop Pin */}
        <circle cx={dropX} cy={dropY} r="18" fill="#0f172a" />
        <circle cx={dropX} cy={dropY} r="8" fill="#10b981" />
        <text
          x={dropX}
          y={dropY - 26}
          textAnchor="middle"
          fill={isDark ? '#ffffff' : '#0f172a'}
          fontSize="14"
          fontWeight="900"
        >
          DROP
        </text>

        {/* Moving Vehicle / Transit Marker */}
        {isMoving && (
          <g transform={`translate(${driverX}, ${driverY})`}>
            <circle r="22" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
            <circle r="16" fill="#059669" stroke="#ffffff" strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  )
}
