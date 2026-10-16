import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Coordinates } from '@/types'
import {
  MapPin,
  Search,
  Navigation,
  Loader2,
  Sparkles,
  School,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import { useGoogleMaps } from '@/context/GoogleMapsContext'
import {
  searchKnownLocations,
  resolveAddressCoordinates,
  extractCityFromAddress,
} from '@/services/distanceRoutingService'

export interface SelectedLocation {
  fullAddress: string
  landmark?: string
  coords: Coordinates
  city?: string
}

export interface PredictionItem {
  id: string
  title: string
  subtitle: string
  fullAddress: string
  coords: Coordinates
  city?: string
  source: 'curated' | 'google' | 'photon' | 'custom'
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
  placeholder = 'Search street, campus, society or landmark (e.g. ADIT Anand, GCET, Satellite)...',
  value,
  onChange,
  required = false,
  className = '',
  colorTheme = 'emerald',
}) => {
  const { hasKey, apiKey } = useGoogleMaps()
  const [query, setQuery] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [predictions, setPredictions] = useState<PredictionItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const activeFetchAbortRef = useRef<AbortController | null>(null)

  // Sync query when parent value changes externally (e.g. Saved address selected or draft reset)
  // Only sync if input is not actively being edited by the user to avoid cursor jumping
  useEffect(() => {
    if (!isFocused && value !== query) {
      setQuery(value || '')
    }
  }, [value, isFocused])

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

  // Execute multi-tier address search
  const performSearch = useCallback(
    async (text: string) => {
      const clean = text.trim()
      if (!clean) {
        // Show default popular curated hubs on empty focus
        const defaults = searchKnownLocations('', 6)
        setPredictions(
          defaults.map((m, idx) => ({
            id: `default-${idx}`,
            title: m.title,
            subtitle: `${m.subtitle} • ${m.city}`,
            fullAddress: m.fullAddress,
            coords: m.coords,
            city: m.city,
            source: 'curated',
          })),
        )
        setIsLoading(false)
        return
      }

      // Tier 1: Instant local curated hubs (0ms latency, works 100% offline)
      const localMatches = searchKnownLocations(clean, 5)
      const curatedItems: PredictionItem[] = localMatches.map((m, idx) => ({
        id: `curated-${idx}-${m.coords.lat}`,
        title: m.title,
        subtitle: `${m.subtitle} • ${m.city}`,
        fullAddress: m.fullAddress,
        coords: m.coords,
        city: m.city,
        source: 'curated',
      }))

      // Always include "Use exact custom address" item as an option
      const customItem: PredictionItem = {
        id: `custom-exact`,
        title: `Use entered address: "${clean}"`,
        subtitle: `Set as delivery address (${extractCityFromAddress(clean)})`,
        fullAddress: clean,
        coords: localMatches[0]?.coords || { lat: 22.5528, lng: 72.9242 },
        city: extractCityFromAddress(clean),
        source: 'custom',
      }

      // Show instant results immediately
      setPredictions([customItem, ...curatedItems])
      setIsLoading(true)

      // Cancel previous in-flight fetch
      if (activeFetchAbortRef.current) {
        activeFetchAbortRef.current.abort()
      }
      const abortController = new AbortController()
      activeFetchAbortRef.current = abortController

      const asyncResults: PredictionItem[] = []

      // Tier 2: Photon OpenStreetMap Autocomplete (Global, super fast, zero CORS issues, free)
      const fetchPhoton = async () => {
        try {
          const res = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=5`,
            { signal: abortController.signal },
          )
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data?.features)) {
              data.features.forEach((feat: any, idx: number) => {
                if (feat?.geometry?.coordinates?.length >= 2) {
                  const lng = Number(feat.geometry.coordinates[0].toFixed(5))
                  const lat = Number(feat.geometry.coordinates[1].toFixed(5))
                  const props = feat.properties || {}
                  const name = props.name || [props.street, props.housenumber].filter(Boolean).join(' ') || clean
                  const subParts = [props.street, props.district, props.city, props.state].filter(Boolean)
                  const subtitle = subParts.join(', ') || props.country || 'India'
                  const full = [name, props.city, props.state].filter(Boolean).join(', ')

                  asyncResults.push({
                    id: `photon-${idx}-${lat}-${lng}`,
                    title: name,
                    subtitle,
                    fullAddress: full || subtitle || clean,
                    coords: { lat, lng },
                    city: props.city || extractCityFromAddress(full),
                    source: 'photon',
                  })
                }
              })
            }
          }
        } catch {
          // Ignore network or abort errors
        }
      }

      // Tier 3: Client-side Google Maps AutocompleteService (if loaded via @vis.gl/react-google-maps)
      const fetchGoogleClient = async () => {
        const googleMaps = (window as any).google?.maps
        if (googleMaps?.places?.AutocompleteService) {
          try {
            const autoService = new googleMaps.places.AutocompleteService()
            await new Promise<void>((resolve) => {
              autoService.getPlacePredictions(
                {
                  input: clean,
                  componentRestrictions: { country: 'in' },
                },
                (predictions: any[], status: string) => {
                  if (status === 'OK' && Array.isArray(predictions)) {
                    predictions.slice(0, 4).forEach((p: any) => {
                      asyncResults.push({
                        id: `gclient-${p.place_id}`,
                        title: p.structured_formatting?.main_text || p.description?.split(',')[0] || clean,
                        subtitle: p.description,
                        fullAddress: p.description,
                        coords: { lat: 22.5528, lng: 72.9242 }, // will be geocoded on select
                        city: extractCityFromAddress(p.description),
                        source: 'google',
                      })
                    })
                  }
                  resolve()
                },
              )
            })
          } catch {}
        }
      }

      // Tier 4: Backend Proxy to Google Places API (New) if server is running
      const fetchBackendPlaces = async () => {
        try {
          const res = await fetch('/api/v1/maps/places-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: clean, apiKey }),
            signal: abortController.signal,
          })
          if (res.ok) {
            const json = await res.json()
            const places = json?.data?.places || json?.places
            if (Array.isArray(places)) {
              places.slice(0, 4).forEach((p: any) => {
                asyncResults.push({
                  id: p.id || `gbackend-${p.coords?.lat}`,
                  title: p.title,
                  subtitle: p.subtitle || p.fullAddress,
                  fullAddress: p.fullAddress,
                  coords: p.coords,
                  city: p.city || extractCityFromAddress(p.fullAddress),
                  source: 'google',
                })
              })
            }
          }
        } catch {
          // Backend offline or unreachable - handled gracefully by Tier 1 & 2
        }
      }

      await Promise.allSettled([fetchPhoton(), fetchGoogleClient(), fetchBackendPlaces()])

      if (!abortController.signal.aborted) {
        // Merge and deduplicate by address
        const seen = new Set<string>()
        const combined: PredictionItem[] = []

        // Custom item first
        combined.push(customItem)
        seen.add(customItem.fullAddress.toLowerCase())

        // Add curated items
        curatedItems.forEach((item) => {
          const key = item.title.toLowerCase()
          if (!seen.has(key)) {
            seen.add(key)
            combined.push(item)
          }
        })

        // Add external async items
        asyncResults.forEach((item) => {
          const key = item.title.toLowerCase()
          if (!seen.has(key)) {
            seen.add(key)
            combined.push(item)
          }
        })

        setPredictions(combined.slice(0, 8))
        setIsLoading(false)
      }
    },
    [apiKey],
  )

  // Handle typing in input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setQuery(text)
    setIsOpen(true)
    setSelectedIndex(-1)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!text.trim()) {
      performSearch('')
      // Notify parent of empty input
      onChange({
        fullAddress: '',
        landmark: '',
        coords: { lat: 22.5528, lng: 72.9242 },
        city: '',
      })
      return
    }

    // Debounce search slightly to avoid excessive calls while remaining snappy
    debounceRef.current = setTimeout(() => {
      performSearch(text)
    }, 160)
  }

  // Handle selection of a prediction
  const handleSelect = async (item: PredictionItem) => {
    setQuery(item.fullAddress)
    setIsOpen(false)
    setIsLoading(true)

    try {
      let finalCoords = item.coords

      // If it's a custom address or Google client item needing geocoding
      if (item.source === 'custom' || (item.source === 'google' && !item.coords.lat)) {
        const resolved = await resolveAddressCoordinates(item.fullAddress)
        finalCoords = resolved.coords
      }

      onChange({
        fullAddress: item.fullAddress,
        landmark: item.source === 'custom' ? undefined : item.subtitle,
        coords: finalCoords,
        city: item.city || extractCityFromAddress(item.fullAddress),
      })
    } catch {
      onChange({
        fullAddress: item.fullAddress,
        landmark: item.subtitle,
        coords: item.coords,
        city: item.city || extractCityFromAddress(item.fullAddress),
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle clear input
  const handleClear = () => {
    setQuery('')
    setPredictions([])
    setIsOpen(false)
    onChange({
      fullAddress: '',
      landmark: '',
      coords: { lat: 22.5528, lng: 72.9242 },
      city: '',
    })
    inputRef.current?.focus()
  }

  // On blur: ensure typed custom text is saved to parent state
  const handleBlur = async () => {
    setIsFocused(false)
    if (query.trim() && query.trim() !== value.trim()) {
      try {
        const resolved = await resolveAddressCoordinates(query)
        onChange({
          fullAddress: query.trim(),
          landmark: resolved.landmark || resolved.subtitle,
          coords: resolved.coords,
          city: resolved.city,
        })
      } catch {
        onChange({
          fullAddress: query.trim(),
          coords: { lat: 22.5528, lng: 72.9242 },
          city: extractCityFromAddress(query),
        })
      }
    }
  }

  // Keyboard navigation inside autocomplete dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || predictions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < predictions.length) {
        handleSelect(predictions[selectedIndex])
      } else if (predictions.length > 0) {
        handleSelect(predictions[0])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
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
      async (pos) => {
        const coords: Coordinates = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        }

        // Try reverse geocoding via Google Maps if active
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
          return
        }

        // Try reverse geocoding via Photon API
        try {
          const revRes = await fetch(
            `https://photon.komoot.io/reverse?lat=${coords.lat}&lon=${coords.lng}`,
          )
          if (revRes.ok) {
            const revData = await revRes.json()
            const feat = revData?.features?.[0]
            if (feat?.properties) {
              const p = feat.properties
              const parts = [p.name, p.street, p.district, p.city, p.state].filter(Boolean)
              const formatted = parts.join(', ')
              if (formatted) {
                setIsLocating(false)
                setQuery(formatted)
                onChange({
                  fullAddress: formatted,
                  coords,
                  city: p.city || extractCityFromAddress(formatted),
                })
                return
              }
            }
          }
        } catch {}

        setIsLocating(false)
        setCoordinatesFallback(coords)
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
    const defaultText = `Current Location Pin (${coords.lat}, ${coords.lng}), Gujarat`
    setQuery(defaultText)
    onChange({
      fullAddress: defaultText,
      landmark: 'Detected GPS Location',
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
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true)
            setIsOpen(true)
            if (!query.trim()) {
              performSearch('')
            } else if (predictions.length === 0) {
              performSearch(query)
            }
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className="w-full h-12 pl-11 pr-20 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all shadow-xs"
        />

        {/* Clear & Loading Icons */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {isLoading && <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear address"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute left-0 right-0 z-40 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto animate-in fade-in duration-150">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <Search className="w-3 h-3 text-slate-400" />
              Verified Campuses, Societies & Pan-India Hubs
            </span>
            <span className="text-[10px] text-slate-400">
              {predictions.length} suggestions
            </span>
          </div>

          {predictions.map((p, idx) => {
            const isSelected = selectedIndex === idx
            const isCollege =
              p.title.includes('Institute') ||
              p.title.includes('College') ||
              p.title.includes('University') ||
              p.title.includes('ADIT') ||
              p.title.includes('GCET') ||
              p.title.includes('BVM') ||
              p.title.includes('SPU') ||
              p.title.includes('CHARUSAT')
            const isCustom = p.source === 'custom'

            return (
              <button
                key={p.id || idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(p)
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full p-3 text-left transition-colors flex items-start gap-3 cursor-pointer group ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mt-0.5 shrink-0 transition-colors ${
                    isCustom
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      : isCollege
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isCustom ? (
                    <Compass className="w-4 h-4" />
                  ) : isCollege ? (
                    <School className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span
                      className={`text-sm font-bold truncate ${
                        isCustom
                          ? 'text-amber-900 dark:text-amber-200'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {isCustom ? (
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Custom
                        </span>
                      ) : p.source === 'google' ? (
                        <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          Google Maps
                        </span>
                      ) : p.source === 'photon' ? (
                        <span className="bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Hub
                        </span>
                      )}
                    </span>
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
