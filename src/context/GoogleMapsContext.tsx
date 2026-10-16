import React, { createContext, useContext, useState, useEffect } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'

interface GoogleMapsContextValue {
  apiKey: string
  setApiKey: (key: string) => void
  clearApiKey: () => void
  isConfigModalOpen: boolean
  setIsConfigModalOpen: (open: boolean) => void
  hasKey: boolean
  mapMode: 'google' | 'simulated'
  setMapMode: (mode: 'google' | 'simulated') => void
  attributionId: string
}

const STORAGE_KEY = 'localmove_gmaps_api_key'
const MAP_MODE_KEY = 'localmove_map_mode_v1'
const ATTRIBUTION_ID = 'gmp_git_agentskills_v1'

const GoogleMapsContext = createContext<GoogleMapsContextValue | undefined>(undefined)

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return stored.trim()
    } catch {}
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY
    return (envKey || 'AIzaSyBbyqtpPJXKzeeCMjM1uTU1m1IWxli0eeg').trim()
  })

  const [mapMode, setMapModeState] = useState<'google' | 'simulated'>(() => {
    try {
      const stored = localStorage.getItem(MAP_MODE_KEY)
      if (stored === 'simulated' || stored === 'google') return stored
    } catch {}
    return 'google'
  })

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const setApiKey = (key: string) => {
    const cleaned = key.trim()
    setApiKeyState(cleaned)
    try {
      if (cleaned) {
        localStorage.setItem(STORAGE_KEY, cleaned)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {}
  }

  const clearApiKey = () => {
    setApiKeyState('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const setMapMode = (mode: 'google' | 'simulated') => {
    setMapModeState(mode)
    try {
      localStorage.setItem(MAP_MODE_KEY, mode)
    } catch {}
  }

  const hasKey = apiKey.length > 5

  const contextValue: GoogleMapsContextValue = {
    apiKey,
    setApiKey,
    clearApiKey,
    isConfigModalOpen,
    setIsConfigModalOpen,
    hasKey,
    mapMode,
    setMapMode,
    attributionId: ATTRIBUTION_ID,
  }

  // If a key is present, wrap the app tree with official APIProvider
  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {hasKey ? (
        <APIProvider
          apiKey={apiKey}
          libraries={['places', 'routes', 'geometry', 'marker']}
          solutionChannel={ATTRIBUTION_ID}
          region="IN"
          language="en"
        >
          {children}
        </APIProvider>
      ) : (
        children
      )}
    </GoogleMapsContext.Provider>
  )
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider')
  }
  return context
}
