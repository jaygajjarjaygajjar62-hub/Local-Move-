import React from 'react'
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { formatInr } from '@/utils/formatters'
import {
  Package,
  Home,
  PlusCircle,
  Clock,
  Wallet,
  MapPin,
  Bell,
  HelpCircle,
  User,
  Phone,
  LogOut,
} from 'lucide-react'

export const CustomerLayout: React.FC = () => {
  const location = useLocation()
  const { customer, logoutCustomer } = useAuth()
  const { walletBalance, activeCustomerOrder } = useOrders()

  // Route Guard: Require customer login before accessing customer portal
  if (!customer.isLoggedIn) {
    return <Navigate to="/customer/login" replace />
  }

  const tabs = [
    { label: 'Home', href: '/customer/home', icon: <Home className="w-4 h-4" /> },
    { label: 'Book Delivery', href: '/customer/book', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'My Orders', href: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Wallet', href: '/customer/wallet', icon: <Wallet className="w-4 h-4" /> },
    { label: 'Addresses', href: '/customer/addresses', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Support', href: '/customer/help', icon: <HelpCircle className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Sub-header navigation bar for Customer Portal */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-20 sm:top-22 z-30 shadow-xs">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-14 overflow-x-auto no-scrollbar gap-3">
            {/* Horizontal Tabs */}
            <nav className="flex items-center space-x-1 sm:space-x-2 text-sm font-bold shrink-0">
              {tabs.map((tab) => {
                const isActive =
                  location.pathname === tab.href ||
                  (tab.href === '/customer/orders' && location.pathname.startsWith('/customer/orders/'))
                return (
                  <Link
                    key={tab.label}
                    to={tab.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Wallet pill, Active Order Quick badge & Profile / Logout */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-sm">
              {activeCustomerOrder && (
                <Link
                  to={`/customer/orders/${activeCustomerOrder.id}`}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Order #{activeCustomerOrder.id} Active</span>
                </Link>
              )}

              <Link
                to="/customer/wallet"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors font-bold text-xs"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">{formatInr(walletBalance)}</span>
              </Link>

              <Link
                to="/customer/notifications"
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
              </Link>

              {/* Customer Profile Chip */}
              <Link
                to="/customer/profile"
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
                aria-label="Profile"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {customer.name ? customer.name.slice(0, 1) : 'C'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{customer.name || 'Account'}</span>
              </Link>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logoutCustomer}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                title="Log Out of Customer Account"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Outlet */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
