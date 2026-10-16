import React, { useState, useEffect, useRef } from 'react'
import { Coordinates } from '@/types'
import { MapPin, Search, Navigation, Check, Loader2, Sparkles, Building2, School } from 'lucide-react'
import { useGoogleMaps } from '@/context/GoogleMapsContext'
import {
  searchKnownLocations,
  resolveAddressCoordinates,
  extractCityFromAddress,
  ResolvedLocation,
} from '@/services/distanceRoutingService'

export interface SelectedLocation {
  fullAddress: string
  landmark?: string
  coords: Coordinates
  city?: string
}

interface AddressAutocompleteProps {
  label: string
  placeholder?: string
  value: string
  onChange: (loc: SelectedLocation) => void
  required?: boolean
  className?: string
  colorTheme?: 'emerald' | 'navy'
}

export const AddressAutocompleteInput: React.FC<AddressAutocompleteProps> = ({
  label,
  placeholder = 'Search street, building, campus or landmark (e.g. ADIT Anand, GCET, Satellite)...',
  value,
  onChange,
  required = false,
  className = '',
  colorTheme = 'emerald',
}) => {
  const { hasKey, mapMode, apiKey } = useGoogleMaps()
  const [query, setQuery] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [predictions, setPredictions] = useState<
    Array<{
      title: string
      subtitle: string
      fullAddress: string
      coords: Coordinates
      city?: string
      isGoogleResult?: boolean
    }>
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle typing & query execution
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setQuery(text)
    setIsOpen(true)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!text.trim()) {
      setPredictions([])
      return
    }

    // 1. Instant local search from curated database (Anand, Vidyanagar, Ahmedabad, Vadodara, etc.)
    const localMatches = searchKnownLocations(text, 6)
    if (localMatches.length > 0) {
      setPredictions(
        localMatches.map((m) => ({
          title: m.title,
          subtitle: `${m.subtitle} • ${m.city}`,
          fullAddress: m.fullAddress,
          coords: m.coords,
          city: m.city,
          isGoogleResult: false,
        })),
      )

      // Immediately notify parent with the top match's coords to prevent default 0-km collapse
      const topMatch = localMatches[0]
      onChange({
        fullAddress: text,
        landmark: topMatch.landmark || topMatch.subtitle,
        coords: topMatch.coords,
        city: topMatch.city,
      })
    } else {
      // If no direct local match, detect city and assign realistic local base coordinates
      const city = extractCityFromAddress(text)
      debounceRef.current = setTimeout(async () => {
        try {
          const resolved = await resolveAddressCoordinates(text)
          onChange({
            fullAddress: text,
            landmark: resolved.landmark || resolved.subtitle,
            coords: resolved.coords,
            city: resolved.city,
          })
        } catch {}
      }, 400)
    }

    // 2. Query Google Places API (New) through backend proxy
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/v1/maps/places-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text, apiKey }),
        })
        if (res.ok) {
          const json = await res.json()
          const googlePlaces = json?.data?.places || json?.places
          if (Array.isArray(googlePlaces) && googlePlaces.length > 0) {
            const list = googlePlaces.map((p: any) => ({
              title: p.title,
              subtitle: p.subtitle || p.fullAddress,
              fullAddress: p.fullAddress,
              coords: p.coords,
              city: p.city || extractCityFromAddress(p.fullAddress),
              isGoogleResult: true,
            }))

            setPredictions((prev) => {
              const localOnly = prev.filter((p) => !p.isGoogleResult)
              return [...list, ...localOnly].slice(0, 8)
            })

            // Auto-update coordinates for typed query if not yet selected
            const top = list[0]
            onChange({
              fullAddress: text,
              landmark: top.subtitle,
              coords: top.coords,
              city: top.city,
            })
          }
        }
      } catch (err) {
        console.warn('Google Places search error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 280)
  }

  // Handle selection of a prediction
  const handleSelect = (item: {
    title: string
    subtitle: string
    fullAddress: string
    coords: Coordinates
    city?: string
  }) => {
    setQuery(item.fullAddress)
    setIsOpen(false)
    onChange({
      fullAddress: item.fullAddress,
      landmark: item.subtitle,
      coords: item.coords,
      city: item.city || extractCityFromAddress(item.fullAddress),
    })
  }

  // On blur: eagerly ensure text has resolved coordinates
  const handleBlur = async () => {
    if (query.trim()) {
      try {
        const resolved = await resolveAddressCoordinates(query)
        onChange({
          fullAddress: query,
          landmark: resolved.landmark || resolved.subtitle,
          coords: resolved.coords,
          city: resolved.city,
        })
      } catch {}
    }
  }

  // GPS Device location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: Coordinates = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        }

        // Try reverse geocoding if Google Maps is active
        const win = window as any
        const googleMaps = win?.google?.maps

        if (hasKey && googleMaps?.Geocoder) {
          const geocoder = new googleMaps.Geocoder()
          geocoder.geocode({ location: coords }, (results: any, status: any) => {
            setIsLocating(false)
            if (status === 'OK' && results?.[0]) {
              const formatted = results[0].formatted_address
              setQuery(formatted)
              onChange({
                fullAddress: formatted,
                coords,
                city: extractCityFromAddress(formatted),
              })
            } else {
              setCoordinatesFallback(coords)
            }
          })
        } else {
          setIsLocating(false)
          setCoordinatesFallback(coords)
        }
      },
      (err) => {
        setIsLocating(false)
        console.warn('Geolocation error:', err.message)
        setCoordinatesFallback({ lat: 22.5528, lng: 72.9242 }) // Fallback to Vidyanagar / Anand corridor
      },
      { timeout: 7000 },
    )
  }

  const setCoordinatesFallback = (coords: Coordinates) => {
    const defaultText = `Pin Location (${coords.lat}, ${coords.lng}), Gujarat`
    setQuery(defaultText)
    onChange({
      fullAddress: defaultText,
      landmark: 'Detected GPS Coordinates',
      coords,
      city: extractCityFromAddress(defaultText),
    })
  }

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors disabled:opacity-50"
          title="Detect GPS coordinates using your device"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? 'Locating...' : 'Use Current GPS'}</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-3.5 top-3.5 flex items-center pointer-events-none">
          {colorTheme === 'emerald' ? (
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <MapPin className="w-5 h-5 text-slate-800 dark:text-slate-200" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true)
            } else {
              const defaults = searchKnownLocations('', 5)
              setPredictions(
                defaults.map((m) => ({
                  title: m.title,
                  subtitle: `${m.subtitle} • ${m.city}`,
                  fullAddress: m.fullAddress,
                  coords: m.coords,
                  city: m.city,
                  isGoogleResult: false,
                })),
              )
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          required={required}
          className="w-full h-12 pl-11 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
        />

        {isLoading && (
          <div className="absolute right-3.5 top-3.5">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute left-0 right-0 z-30 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto animate-in fade-in">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <Search className="w-3 h-3 text-slate-400" />
              Verified Campuses & Logistics Hubs
            </span>
            {hasKey && (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-3 h-3" /> Google Maps Active
              </span>
            )}
          </div>

          {predictions.map((p, idx) => {
            const isCollege = p.title.includes('Institute') || p.title.includes('College') || p.title.includes('University') || p.title.includes('ADIT') || p.title.includes('GCET') || p.title.includes('BVM') || p.title.includes('SPU')
            return (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(p)
                }}
                className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 mt-0.5 shrink-0 transition-colors">
                  {isCollege ? (
                    <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {p.title}
                    </span>
                    {p.isGoogleResult && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
                        Google Maps
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {p.subtitle}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
