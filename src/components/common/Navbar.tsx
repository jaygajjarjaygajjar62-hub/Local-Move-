import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useGoogleMaps } from '@/context/GoogleMapsContext'
import { Button } from '@/components/ui/Button'
import {
  Package,
  Phone,
  Globe,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  MapPin,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { customer, language, setLanguage } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { hasKey, setIsConfigModalOpen } = useGoogleMaps()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation Links with priority thresholds for clean responsive layout
  const navLinks = [
    { label: 'Services', href: '/#services', visibility: 'lg:inline-block' },
    { label: 'Track Order', href: '/receiver', visibility: 'lg:inline-block' },
    {
      label: customer?.isLoggedIn ? 'Customer Portal' : 'Customer Login',
      href: customer?.isLoggedIn ? '/customer/home' : '/customer/login',
      visibility: 'lg:inline-block',
    },
    { label: 'Vehicles', href: '/#vehicles', visibility: 'hidden xl:inline-block' },
    { label: 'Drive with Us', href: '/driver/login', visibility: 'lg:inline-block' },
    { label: 'How It Works', href: '/#how-it-works', visibility: 'hidden 2xl:inline-block' },
    { label: 'Help', href: '/customer/help', visibility: 'hidden 2xl:inline-block' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors w-full max-w-full overflow-x-hidden">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
          {/* Brand Logo - Crisp & Legible */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors border border-slate-800 dark:border-slate-700 shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 stroke-[2.3]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-base sm:text-xl xl:text-2xl tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
                  LOCAL MOVE
                </span>
                <span className="text-[9px] sm:text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold px-1.5 sm:px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 tracking-wider leading-none whitespace-nowrap hidden sm:inline-block">
                  BY AERA
                </span>
              </div>
              <span className="hidden 2xl:block text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide mt-1 whitespace-nowrap">
                24×7 Local Logistics & Relocation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Responsive priorities prevent horizontal blowout */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2.5 text-[13px] xl:text-[14px] 2xl:text-[15px] font-bold text-slate-700 dark:text-slate-200 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors whitespace-nowrap ${link.visibility}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Cluster - Clean, Uncluttered, with 'Book a Delivery' Prominently in Place */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 2xl:gap-3 shrink-0">
            {/* Google Maps Configuration Button */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
              aria-label="Google Maps Settings"
              title={hasKey ? 'Google Maps Platform Active' : 'Connect Google Maps API Key'}
            >
              <MapPin className={`w-4 h-4 ${hasKey ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400'}`} />
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Selector (on 2xl+) */}
            <div className="hidden 2xl:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-750 rounded-xl px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors shrink-0">
              <Globe className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Interface Language"
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer text-xs pr-1"
              >
                <option value="en" className="dark:bg-slate-900">English</option>
                <option value="hi" className="dark:bg-slate-900">हिंदी</option>
                <option value="gu" className="dark:bg-slate-900">ગુજરાતી</option>
              </select>
            </div>

            {/* Helpline Dial */}
            <a
              href="tel:+919558690109"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs xl:text-sm font-extrabold text-emerald-950 dark:text-emerald-300 transition-colors shadow-2xs shrink-0 whitespace-nowrap"
              title="24×7 Dispatch Helpline: +91 9558690109"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-mono tracking-tight hidden xl:inline">+91 9558690109</span>
              <span className="font-bold hidden lg:inline xl:hidden">Helpline</span>
            </a>
          </div>

          {/* Mobile / Tablet Header (< lg) - Compact & Clean */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Google Maps Configuration Button */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shrink-0"
              aria-label="Google Maps Settings"
              title={hasKey ? 'Google Maps Platform Active' : 'Connect Google Maps API Key'}
            >
              <MapPin className={`w-4 h-4 ${hasKey ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-400'}`} />
            </button>

            {/* Dark / Light mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 shrink-0"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Quick Helpline Call Button */}
            <a
              href="tel:+919558690109"
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold text-emerald-950 dark:text-emerald-300 shrink-0"
              title="Call +91 9558690109"
              aria-label="Call Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono hidden sm:inline">+91 9558690109</span>
            </a>

            {/* Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 animate-in fade-in shadow-xl w-full max-w-full">
          <nav className="flex flex-col space-y-1.5 text-base font-bold text-slate-800 dark:text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </nav>

          {/* Language Selector in Drawer */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Language:</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              aria-label="Select Interface Language"
              className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer text-sm"
            >
              <option value="en" className="dark:bg-slate-900">English</option>
              <option value="hi" className="dark:bg-slate-900">हिंदी (Hindi)</option>
              <option value="gu" className="dark:bg-slate-900">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <a
              href="tel:+919558690109"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-sm font-extrabold text-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Customer Care: +91 9558690109</span>
            </a>
            <div className="flex gap-2">
              <Link to="/customer/book" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white" size="md">
                  Book a Delivery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
