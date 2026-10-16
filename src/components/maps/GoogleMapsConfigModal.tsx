import React, { useState } from 'react'
import { useGoogleMaps } from '@/context/GoogleMapsContext'
import { Button } from '@/components/ui/Button'
import {
  MapPin,
  Key,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react'

export const GoogleMapsConfigModal: React.FC = () => {
  const {
    apiKey,
    setApiKey,
    clearApiKey,
    isConfigModalOpen,
    setIsConfigModalOpen,
    hasKey,
    mapMode,
    setMapMode,
    attributionId,
  } = useGoogleMaps()

  const [inputKey, setInputKey] = useState(apiKey)
  const [saveSuccess, setSaveSuccess] = useState(false)

  if (!isConfigModalOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setApiKey(inputKey)
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setIsConfigModalOpen(false)
    }, 1200)
  }

  const handleRemove = () => {
    clearApiKey()
    setInputKey('')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gmaps-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-left space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <MapPin className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2
                id="gmaps-modal-title"
                className="text-xl font-black text-slate-900 dark:text-white tracking-tight"
              >
                Google Maps Platform Integration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Live street navigation, exact address autocomplete & real-time tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                hasKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Active Map Engine
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {hasKey
                  ? mapMode === 'google'
                    ? 'Google Maps Platform (Live SDK Active)'
                    : 'High-Fidelity Simulated Vector Map'
                  : 'Simulated Vector Engine (Ready for API Key)'}
              </span>
            </div>
          </div>

          {hasKey && (
            <div className="flex gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMapMode('google')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mapMode === 'google'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Google Maps
              </button>
              <button
                type="button"
                onClick={() => setMapMode('simulated')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mapMode === 'simulated'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Simulated
              </button>
            </div>
          )}
        </div>

        {/* Key Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Google Maps API Key or Demo Key
            </label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy... (Paste Google Maps API key or Maps Demo Key)"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              Key is securely stored in your browser's local storage and used directly with the official Google Maps JavaScript SDK.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5"
            >
              {saveSuccess ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Connected Successfully!
                </span>
              ) : (
                'Save & Activate Google Maps'
              )}
            </Button>

            {hasKey && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleRemove}
                className="font-bold border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
              >
                Disconnect Key
              </Button>
            )}
          </div>
        </form>

        {/* Free Maps Demo Key & Google Cloud Instructions */}
        <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Need a Key for Prototyping? Get a Free Maps Demo Key</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Google provides a zero-cost <strong>Maps Demo Key</strong> without requiring any Google Cloud billing account or credit card setup:
          </p>
          <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium pl-1">
            <li>
              Open{' '}
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 dark:text-emerald-400 font-bold underline inline-flex items-center gap-0.5"
              >
                mapsplatform.google.com/maps-demo-key
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Sign in with your Google account and accept the Demo Project Terms.</li>
            <li>Click to reveal your key, copy it, and paste it into the field above.</li>
          </ol>
          <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            For production deployment, create a restricted key in the{' '}
            <a
              href="https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 dark:text-emerald-400 font-bold underline inline-flex items-center gap-0.5"
            >
              Google Cloud Console
              <ExternalLink className="w-3 h-3" />
            </a>{' '}
            with HTTP referrer restrictions.
          </div>
        </div>

        {/* Enabled Features List */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
            Integrated Google Maps Platform APIs:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Maps JavaScript API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Places API (New Autocomplete)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Routes API (Polyline & Distance)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AdvancedMarkerElement (`DEMO_MAP_ID`)</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
            Usage Attribution ID: <code className="font-mono font-bold text-slate-600 dark:text-slate-300">{attributionId}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
