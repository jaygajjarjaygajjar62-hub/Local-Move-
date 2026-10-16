import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { Button } from '@/components/ui/Button'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { formatDateTime, formatInr } from '@/utils/formatters'
import {
  Package,
  Truck,
  Boxes,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Phone,
  Tag,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

export const CustomerHomePage: React.FC = () => {
  const navigate = useNavigate()
  const { customer } = useAuth()
  const { orders, activeCustomerOrder, addresses } = useOrders()

  const [quickPickup, setQuickPickup] = useState('')
  const [quickDrop, setQuickDrop] = useState('')

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/customer/book', {
      state: { pickup: quickPickup, drop: quickDrop },
    })
  }

  const services = [
    {
      title: 'Send an Item',
      desc: 'Documents, laptops, groceries & parcels',
      icon: <Package className="w-5 h-5 text-emerald-600" />,
      tag: 'Bike / Auto',
      category: 'documents',
    },
    {
      title: 'Move House',
      desc: '1-3 BHK full house shifting with tempo/truck',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      tag: 'Full Shifting',
      category: 'household_shifting',
    },
    {
      title: 'Packing Service',
      desc: 'Bubble wrap, cartons & edge padding',
      icon: <Boxes className="w-5 h-5 text-emerald-600" />,
      tag: 'Add-on',
      category: 'appliances',
    },
    {
      title: 'Hire Helpers',
      desc: 'Manpower for lifting & stairs carriage',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      tag: '₹180/staff',
      category: 'furniture',
    },
    {
      title: 'Scheduled Delivery',
      desc: 'Book for a specific date or morning shift',
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      tag: 'Advance',
      category: 'other',
    },
  ]

  const recentOrders = orders.slice(0, 4)

  return (
    <div className="space-y-8 text-left">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {customer.name || 'Customer'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Local Move 24×7 Platform • Ahmedabad Metro Hub
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/customer/book">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              New Delivery
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Order Card if ongoing */}
      {activeCustomerOrder && (
        <div className="rounded-xl border-2 border-amber-500/40 bg-white p-5 sm:p-6 shadow-md space-y-4 dark:bg-slate-900 dark:border-amber-500/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Delivery in Progress
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                #{activeCustomerOrder.id}
              </span>
            </div>
            <OrderStatusBadge status={activeCustomerOrder.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Route:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {activeCustomerOrder.pickupAddress.title || activeCustomerOrder.pickupAddress.fullAddress}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                To: {activeCustomerOrder.dropAddress.title || activeCustomerOrder.dropAddress.fullAddress}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Item & Partner:</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {activeCustomerOrder.item.description}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                Partner: {activeCustomerOrder.assignedDriver?.name || 'Searching...'} (
                {activeCustomerOrder.assignedDriver?.vehicleNumber || activeCustomerOrder.vehicleType})
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Sender Verification OTP:</span>
              <div className="font-mono text-base font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 inline-block">
                {activeCustomerOrder.pickupOtp}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Share with partner only at pickup</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Started: {formatDateTime(activeCustomerOrder.createdAt)}
            </span>
            <div className="flex items-center gap-2">
              <Link to={`/customer/orders/${activeCustomerOrder.id}`}>
                <Button size="sm" variant="primary" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open Live Tracking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Booking Bar */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Where would you like to send today?</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Enter locations for an instant vehicle estimate</p>
        </div>

        <form onSubmit={handleStartBooking} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
            <input
              type="text"
              required
              value={quickPickup}
              onChange={(e) => setQuickPickup(e.target.value)}
              placeholder="Pickup landmark / address"
              className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-5 relative">
            <MapPin className="w-4 h-4 text-slate-900 dark:text-slate-300 absolute left-3 top-3.5" />
            <input
              type="text"
              required
              value={quickDrop}
              onChange={(e) => setQuickDrop(e.target.value)}
              placeholder="Drop landmark / address"
              className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" className="w-full h-11 text-sm font-bold">
              Continue
            </Button>
          </div>
        </form>

        {/* Saved Addresses quick pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">Saved Places:</span>
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => {
                if (!quickPickup) setQuickPickup(addr.title || addr.fullAddress)
                else setQuickDrop(addr.title || addr.fullAddress)
              }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md shrink-0 transition-colors"
            >
              {addr.title || addr.fullAddress.slice(0, 20)}
            </button>
          ))}
        </div>
      </div>

      {/* Service Tiles */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Explore Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((srv) => (
            <div
              key={srv.title}
              onClick={() => navigate('/customer/book', { state: { category: srv.category } })}
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 hover:border-emerald-600 cursor-pointer transition-colors shadow-xs group dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-500"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">{srv.icon}</div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {srv.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {srv.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional / Referral Banner (Marked Demo) */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 sm:p-6 shadow-sm border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Demo Promo Offer
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
              LOCALMOVE50
            </span>
          </div>
          <h4 className="text-base font-bold text-white">Flat 50% Off on your next parcel or move</h4>
          <p className="text-xs text-slate-300 max-w-lg">
            Use code <strong>LOCALMOVE50</strong> at checkout for up to ₹50 discount on any bike or tempo booking.
          </p>
        </div>
        <Link to="/customer/book">
          <Button variant="primary" size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shrink-0">
            Apply in Booking
          </Button>
        </Link>
      </div>

      {/* Recent Orders List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Recent Deliveries</h3>
          <Link to="/customer/orders" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            View All Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentOrders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">#{ord.id}</span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-2">
                    {formatDateTime(ord.createdAt)}
                  </span>
                </div>
                <OrderStatusBadge status={ord.status} />
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{ord.item.description}</div>
                <div className="text-slate-500 dark:text-slate-400 line-clamp-1">
                  From: {ord.pickupAddress.title || ord.pickupAddress.fullAddress}
                </div>
                <div className="text-slate-500 dark:text-slate-400 line-clamp-1">
                  To: {ord.dropAddress.title || ord.dropAddress.fullAddress}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{formatInr(ord.fare.totalCustomerFare)}</span>
                <Link to={`/customer/orders/${ord.id}`}>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Support shortcut */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-700 dark:text-slate-300">
            Need help with an ongoing booking? Helpline <strong>+91 9558690109</strong> is active 24×7.
          </span>
        </div>
        <a href="tel:+919558690109" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0">
          Call Customer Care (+91 9558690109)
        </a>
      </div>
    </div>
  )
}
