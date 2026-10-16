import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useDemo } from '@/context/DemoContext'
import { useOrders } from '@/context/OrderContext'
import { useTheme } from '@/context/ThemeContext'
import { useGoogleMaps } from '@/context/GoogleMapsContext'
import { Button } from '@/components/ui/Button'
import {
  SlidersHorizontal,
  RotateCcw,
  Users,
  Shield,
  Truck,
  User,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Wifi,
  WifiOff,
  AlertTriangle,
  Sun,
  Moon,
  MapPin,
} from 'lucide-react'

export const DemoControlBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { role, setRole, adminSubRole, setAdminSubRole } = useAuth()
  const { scenarios, toggleScenario, resetAllData, showScenarioPanel, setShowScenarioPanel } =
    useDemo()
  const { orders } = useOrders()
  const { theme, toggleTheme } = useTheme()
  const { hasKey, mapMode, setIsConfigModalOpen } = useGoogleMaps()

  const liveOrder = orders.find((o) => o.status === 'in_transit') || orders[0]

  const handleRoleChange = (newRole: 'customer' | 'driver' | 'admin' | 'receiver') => {
    setRole(newRole)
    if (newRole === 'customer') {
      navigate('/customer/login')
    } else if (newRole === 'driver') {
      navigate('/driver/dashboard')
    } else if (newRole === 'admin') {
      navigate('/admin/overview')
    } else if (newRole === 'receiver') {
      navigate(`/track/${liveOrder?.trackingToken || 'tr_live_9281_aera'}`)
    }
  }

  return (
    <div className="fixed bottom-3 left-3 z-50 non-printable">
      {/* Expanded Scenario Panel */}
      {showScenarioPanel && (
        <div className="mb-2 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 w-80 sm:w-96 text-left animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Demo Control Deck
              </span>
              <p className="text-[11px] text-slate-400">Simulate operational edge cases</p>
            </div>
            <button
              type="button"
              onClick={() => setShowScenarioPanel(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Collapse panel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>


          {/* Role selector inside panel */}
          <div className="py-3 border-b border-slate-800 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-300">Quick Experience View:</span>
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`py-1.5 text-xs font-medium rounded ${
                  location.pathname.startsWith('/customer')
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('driver')}
                className={`py-1.5 text-xs font-medium rounded ${
                  location.pathname.startsWith('/driver')
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Partner
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('receiver')}
                className={`py-1.5 text-xs font-medium rounded ${
                  location.pathname.startsWith('/track')
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Receiver
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-1.5 text-xs font-medium rounded ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Admin Role Scope Switcher */}
          {location.pathname.startsWith('/admin') && (
            <div className="py-2.5 border-b border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-300">Simulate Admin Role:</span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {(['super_admin', 'operations', 'support', 'finance'] as const).map((sr) => (
                  <button
                    key={sr}
                    type="button"
                    onClick={() => setAdminSubRole(sr)}
                    className={`p-1 rounded text-left px-2 capitalize ${
                      adminSubRole === sr
                        ? 'bg-indigo-700 text-white font-semibold'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {sr.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Edge Case Scenario Toggles */}
          <div className="py-3 space-y-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-300 block">Edge Cases & Triggers:</span>

            <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
              <span className="text-slate-300">Simulate Offline Network</span>
              <input
                type="checkbox"
                checked={scenarios.networkOffline}
                onChange={() => toggleScenario('networkOffline')}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
              <span className="text-slate-300">Trigger Payment Gateway Failure</span>
              <input
                type="checkbox"
                checked={scenarios.paymentFailed}
                onChange={() => toggleScenario('paymentFailed')}
                className="rounded accent-rose-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
              <span className="text-slate-300">Simulate No Driver Available</span>
              <input
                type="checkbox"
                checked={scenarios.noDriverAvailable}
                onChange={() => toggleScenario('noDriverAvailable')}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
              <span className="text-slate-300">Simulate Wrong OTP Rejection</span>
              <input
                type="checkbox"
                checked={scenarios.wrongOtp}
                onChange={() => toggleScenario('wrongOtp')}
                className="rounded accent-rose-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Theme Switcher inside panel */}
          <div className="py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300">Theme Appearance:</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors font-semibold"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-300" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Local Move v1.0 • Aera</span>
            <button
              type="button"
              onClick={resetAllData}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo State
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/95 text-white shadow-xl border border-slate-700/80 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setShowScenarioPanel(!showScenarioPanel)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold tracking-tight transition-colors"
          aria-expanded={showScenarioPanel}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Demo Deck</span>
          {showScenarioPanel ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-1 pr-1.5 text-xs">
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                location.pathname.startsWith('/customer')
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('driver')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                location.pathname.startsWith('/driver')
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Partner
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('receiver')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                location.pathname.startsWith('/track')
                  ? 'bg-slate-800 text-sky-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Receiver
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'bg-slate-800 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Google Maps API Key & Engine Config Button */}
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500"
            title="Configure Google Maps API Key or Switch Engine"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">
              {hasKey ? (mapMode === 'google' ? 'GMP Live' : 'Simulated') : 'Maps Key'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors ml-0.5"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
