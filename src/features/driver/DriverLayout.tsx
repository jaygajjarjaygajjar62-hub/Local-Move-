import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { useTheme } from '@/context/ThemeContext'
import { formatInr } from '@/utils/formatters'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  Truck,
  LayoutDashboard,
  Navigation,
  IndianRupee,
  FileText,
  HelpCircle,
  AlertOctagon,
  Power,
  ShieldAlert,
  Wallet,
  Phone,
  Sun,
  Moon,
} from 'lucide-react'

export const DriverLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { driver } = useAuth()
  const { drivers, updateDriverOnlineStatus, activeDriverOrder } = useOrders()
  const { theme, toggleTheme } = useTheme()

  const [sosModalOpen, setSosModalOpen] = useState(false)
  const [sosTriggered, setSosTriggered] = useState(false)

  const currentDriverProfile = drivers.find((d) => d.id === 'drv-1') || drivers[0]
  const isOnline = currentDriverProfile?.isOnline ?? true

  const toggleOnline = () => {
    updateDriverOnlineStatus('drv-1', !isOnline)
  }

  const handleTriggerSos = () => {
    setSosTriggered(true)
  }

  const navItems = [
    { label: 'Dashboard', href: '/driver/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      label: 'Active Job',
      href: activeDriverOrder ? `/driver/job/${activeDriverOrder.id}` : '/driver/dashboard',
      icon: <Navigation className="w-4 h-4" />,
      badge: activeDriverOrder ? '1' : undefined,
    },
    { label: 'Earnings', href: '/driver/earnings', icon: <IndianRupee className="w-4 h-4" /> },
    { label: 'Documents', href: '/driver/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Support', href: '/driver/support', icon: <HelpCircle className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-18 sm:pb-0 transition-colors">
      {/* Mobile-first Driver Top Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-3 sm:px-4 h-16 flex items-center justify-between gap-2 transition-colors w-full max-w-full">
        {/* Left: Partner Logo & Vehicle Number */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/driver/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white tracking-tight block leading-none">
                PARTNER APP
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                {currentDriverProfile.vehicleNumber}
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors relative ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions: Online Toggle, Cash, Theme Switcher & SOS */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Online/Offline Toggle */}
          <button
            type="button"
            onClick={toggleOnline}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-500'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Power className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>

          {/* Cash In Hand (desktop/tablet) */}
          <Link
            to="/driver/wallet"
            className="hidden sm:flex flex-col text-right px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
          >
            <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Cash in Hand</span>
            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {formatInr(currentDriverProfile.cashInHandBalance)}
            </span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>

          {/* Emergency SOS Button */}
          <button
            type="button"
            onClick={() => {
              setSosModalOpen(true)
              setSosTriggered(false)
            }}
            aria-label="Emergency SOS Alert"
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <AlertOctagon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>SOS</span>
          </button>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 text-left overflow-x-hidden">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar for Mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around text-[10px] font-semibold text-slate-500 dark:text-slate-400 shadow-lg transition-colors">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg relative transition-colors ${
                isActive ? 'text-amber-600 dark:text-amber-400 font-bold' : 'hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-amber-500 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* SOS Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title="Emergency Safety Protocol (SOS)"
        description="Simulated emergency alert broadcast to Aera Safety Control Room."
        maxWidth="sm"
      >
        <div className="space-y-4 text-center">
          <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-xs text-rose-900 dark:text-rose-200 text-left">
            <strong>Prototype Disclaimer:</strong> This is a simulation for testing driver safety UI. It does not contact 112 or local police in this test mode.
          </div>

          {!sosTriggered ? (
            <div className="space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto animate-bounce">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Triggering SOS broadcasts your live GPS coordinates, vehicle registration (
                {currentDriverProfile.vehicleNumber}), and active route to the 24×7 Aera Emergency Desk.
              </p>
              <Button
                variant="danger"
                className="w-full h-12 text-sm font-bold"
                onClick={handleTriggerSos}
              >
                Trigger Simulated SOS Alert
              </Button>
            </div>
          ) : (
            <div className="space-y-3 py-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">SOS Alert Dispatched</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Live location beacon transmitted to operations desk. An Aera Safety Officer is attempting to connect to your device.
              </p>
              <a href="tel:+919558690109" className="block pt-2">
                <Button variant="primary" className="w-full" leftIcon={<Phone className="w-4 h-4" />}>
                  Direct Call: +91 9558690109
                </Button>
              </a>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
