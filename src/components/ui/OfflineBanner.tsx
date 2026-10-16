import React from 'react'
import { WifiOff, AlertTriangle } from 'lucide-react'
import { useDemo } from '@/context/DemoContext'

export const OfflineBanner: React.FC = () => {
  const { scenarios } = useDemo()

  if (!scenarios.networkOffline) return null

  return (
    <div
      role="alert"
      className="bg-amber-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50 animate-in fade-in"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        <strong>Simulated Offline Mode Active:</strong> You are currently disconnected. Actions and media uploads will queue locally and sync once network returns.
      </span>
      <span className="hidden sm:inline bg-amber-700 px-2 py-0.5 rounded text-[10px] tracking-wide uppercase font-semibold">
        Demo Scenario
      </span>
    </div>
  )
}
