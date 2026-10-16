import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { useTheme } from '@/context/ThemeContext'
import { AdminSubRole } from '@/types'
import {
  LayoutDashboard,
  Map,
  Package,
  Users,
  ShieldCheck,
  Tag,
  Coins,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  FileText,
  UserCheck,
  Menu,
  X,
  Shield,
  Layers,
  Sun,
  Moon,
  Radio,
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
  const location = useLocation()
  const { adminSubRole, setAdminSubRole } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { drivers } = useOrders()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const onlineDriversCount = drivers.filter((d) => d.isOnline).length

  const navItems = [
    { label: 'Overview', href: '/admin/overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      label: 'Online Drivers',
      href: '/admin/online-drivers',
      icon: <Radio className="w-4 h-4 text-emerald-400" />,
      badge: onlineDriversCount > 0 ? `${onlineDriversCount} Online` : undefined,
    },
    { label: 'Live Operations', href: '/admin/live-ops', icon: <Map className="w-4 h-4" /> },
    { label: 'Orders & Dispatch', href: '/admin/orders', icon: <Package className="w-4 h-4" /> },
    { label: 'Driver Verification', href: '/admin/drivers', icon: <UserCheck className="w-4 h-4" /> },
    { label: 'Pricing & Zones', href: '/admin/pricing', icon: <Tag className="w-4 h-4" /> },
    { label: 'Commissions & Payouts', href: '/admin/commissions', icon: <Coins className="w-4 h-4" /> },
    { label: 'Claims & Disputes', href: '/admin/claims', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Support Desk', href: '/admin/support', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Analytics Reports', href: '/admin/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Helper Staff', href: '/admin/helpers', icon: <Users className="w-4 h-4" /> },
    { label: 'Policies & Content', href: '/admin/content', icon: <FileText className="w-4 h-4" /> },
    { label: 'Roles & Audit Log', href: '/admin/roles', icon: <Shield className="w-4 h-4" /> },
  ]

  // Filter navigation visible based on sub-role simulation
  const visibleNav = navItems.filter((item) => {
    if (adminSubRole === 'finance') {
      return ['Overview', 'Orders & Dispatch', 'Pricing & Zones', 'Commissions & Payouts', 'Analytics Reports'].includes(item.label)
    }
    if (adminSubRole === 'support') {
      return ['Overview', 'Orders & Dispatch', 'Claims & Disputes', 'Support Desk', 'Policies & Content'].includes(item.label)
    }
    if (adminSubRole === 'operations') {
      return ['Overview', 'Online Drivers', 'Live Operations', 'Orders & Dispatch', 'Driver Verification', 'Helper Staff', 'Claims & Disputes'].includes(item.label)
    }
    return true // Super admin sees all
  })

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans transition-colors">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin/overview" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
              LM
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm text-white tracking-tight block leading-none">
                LOCAL MOVE OPS
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold">AERA CONTROL DECK</span>
            </div>
          </Link>
        </div>

        {/* Sub-Role Selector & Disclaimer */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400 hidden sm:inline">Role Scope:</span>
            <select
              value={adminSubRole}
              onChange={(e) => setAdminSubRole(e.target.value as AdminSubRole)}
              className="bg-transparent text-indigo-300 font-bold focus:outline-none cursor-pointer text-xs uppercase"
              aria-label="Simulate Admin Role"
            >
              <option value="super_admin" className="bg-slate-900 text-white">Super Admin</option>
              <option value="operations" className="bg-slate-900 text-white">Operations</option>
              <option value="support" className="bg-slate-900 text-white">Support</option>
              <option value="finance" className="bg-slate-900 text-white">Finance</option>
            </select>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          <Link to="/" className="text-xs text-slate-400 hover:text-white hidden md:inline">
            Public Website →
          </Link>
        </div>
      </header>

      {/* Main Admin Body with Sidebar */}
      <div className="flex-1 flex max-w-[1760px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 p-4 space-y-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Navigation ({adminSubRole.replace('_', ' ')})
            </span>
            <nav className="space-y-0.5 pt-2">
              {visibleNav.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Quick Stats Widget */}
          <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60 text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              System Health
            </span>
            <div className="flex justify-between">
              <span className="text-slate-400">Ahmedabad Hub:</span>
              <span className="font-bold text-emerald-400">99.98% 24×7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Online Fleet:</span>
              <Link to="/admin/online-drivers" className="font-bold text-emerald-400 hover:underline">
                {onlineDriversCount} Online →
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="relative w-72 bg-slate-900 text-slate-300 p-5 space-y-4 z-10 text-left overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-white">Navigation Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {visibleNav.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Admin View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden text-left bg-slate-100 dark:bg-slate-950 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
