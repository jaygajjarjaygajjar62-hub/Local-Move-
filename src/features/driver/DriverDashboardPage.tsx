import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useAuth } from '@/context/AuthContext'
import { formatInr, formatDistanceKm } from '@/utils/formatters'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Truck,
  IndianRupee,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldAlert,
  Award,
} from 'lucide-react'

export const DriverDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { drivers, orders, activeDriverOrder, assignDriverToOrder } = useOrders()
  const { driver } = useAuth()

  const profile = drivers.find((d) => d.id === 'drv-1') || drivers[0]
  const [incomingJobTimer, setIncomingJobTimer] = useState(25)
  const [showIncomingModal, setShowIncomingModal] = useState(false)

  // Find if there is an unassigned order waiting for matching
  const waitingOrder = orders.find((o) => o.status === 'searching_driver')

  useEffect(() => {
    let interval: any
    if (waitingOrder && profile.isOnline && !activeDriverOrder) {
      setShowIncomingModal(true)
      interval = setInterval(() => {
        setIncomingJobTimer((prev) => {
          if (prev <= 1) {
            setShowIncomingModal(false)
            return 25
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setShowIncomingModal(false)
    }
    return () => clearInterval(interval)
  }, [waitingOrder, profile.isOnline, activeDriverOrder])

  const handleAcceptJob = () => {
    if (!waitingOrder) return
    assignDriverToOrder(waitingOrder.id, profile.id)
    setShowIncomingModal(false)
    navigate(`/driver/job/${waitingOrder.id}`)
  }

  const handleRejectJob = () => {
    setShowIncomingModal(false)
  }

  // Earnings data for chart
  const weeklyEarnings = [
    { day: 'Mon', amount: 820 },
    { day: 'Tue', amount: 940 },
    { day: 'Wed', amount: 1150 },
    { day: 'Thu', amount: 760 },
    { day: 'Fri', amount: 1320 },
    { day: 'Sat', amount: 1540 },
    { day: 'Sun', amount: profile.todayEarnings || 840 },
  ]
  const maxWeekly = Math.max(...weeklyEarnings.map((w) => w.amount), 1600)

  return (
    <div className="space-y-6 text-left">
      {/* Driver Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Partner Console: {profile.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {profile.vehicleModel} • {profile.vehicleNumber} • Rating ★ {profile.rating}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
              profile.isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                profile.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-500'
              }`}
            />
            <span>{profile.isOnline ? 'Available for Jobs' : 'Offline'}</span>
          </span>
        </div>
      </div>

      {/* Cash Limit Warning if near limit */}
      {profile.cashInHandBalance >= 1200 && (
        <div className="bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong>Cash in Hand Warning ({formatInr(profile.cashInHandBalance)} / ₹1,500 limit):</strong>
            <p className="text-[11px] text-amber-800 dark:text-amber-400">
              Please deposit the company share (₹{profile.companyShareOwed}) via UPI in the Wallet tab to continue accepting cash bookings.
            </p>
          </div>
        </div>
      )}

      {/* Active Ongoing Job Card */}
      {activeDriverOrder && (
        <div className="rounded-xl border-2 border-amber-500 bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm dark:shadow-lg space-y-4 transition-colors w-full overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Current Assigned Delivery Job
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">#{activeDriverOrder.id}</span>
            </div>
            <OrderStatusBadge status={activeDriverOrder.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="min-w-0">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Pickup Landmark</span>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {activeDriverOrder.pickupAddress.fullAddress}
              </div>
              <div className="text-slate-500 dark:text-slate-400 truncate">Sender: {activeDriverOrder.sender.name}</div>
            </div>

            <div className="min-w-0">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Drop Landmark</span>
              <div className="font-bold text-slate-900 dark:text-white truncate">
                {activeDriverOrder.dropAddress.fullAddress}
              </div>
              <div className="text-slate-500 dark:text-slate-400 truncate">Receiver: {activeDriverOrder.receiver.name}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs flex items-center justify-between sm:justify-start gap-1">
              <span className="text-slate-500 dark:text-slate-400">Your Guaranteed Earning: </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {formatInr(activeDriverOrder.fare.driverShare)}
              </span>
            </div>

            <Link to={`/driver/job/${activeDriverOrder.id}`} className="w-full sm:w-auto">
              <Button size="sm" variant="primary" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Resume Job Workflow
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 space-y-1 shadow-2xs transition-colors min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> Today's Earning
          </span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {formatInr(profile.todayEarnings)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">80% fare + tips</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 space-y-1 shadow-2xs transition-colors min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
            <Truck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" /> Completed
          </span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">{profile.totalTrips}</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Lifetime deliveries</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 space-y-1 shadow-2xs transition-colors min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
            <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" /> Moving Time
          </span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {Math.floor(profile.activeDeliveryMinutes / 60)}h {profile.activeDeliveryMinutes % 60}m
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">Online: {Math.floor(profile.onlineMinutes / 60)}h</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 space-y-1 shadow-2xs transition-colors min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
            <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" /> Score
          </span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">{profile.acceptanceRate}%</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block truncate">★ {profile.rating}</span>
        </div>
      </div>

      {/* Weekly Earnings Chart (SVG Bar Chart) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-5 space-y-4 shadow-2xs transition-colors w-full overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Weekly Income Trend (7 Days)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Trip earnings + customer tips</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Total: {formatInr(weeklyEarnings.reduce((a, b) => a + b.amount, 0))}
          </span>
        </div>

        {/* Responsive Bar Graphic */}
        <div className="h-40 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-1 sm:px-2 w-full">
          {weeklyEarnings.map((item, idx) => {
            const barHeightPct = Math.round((item.amount / maxWeekly) * 100)
            const isToday = idx === weeklyEarnings.length - 1
            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-1.5 h-full justify-end min-w-0">
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold truncate">
                  ₹{item.amount}
                </span>
                <div className="w-full max-w-[28px] sm:max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full transition-all duration-500 rounded-t ${
                      isToday ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-bold ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.day}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Incoming Job Pop-up Card */}
      {showIncomingModal && waitingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-left space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 dark:text-amber-400 animate-bounce" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">NEW DELIVERY REQUEST</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                {incomingJobTimer}s
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Consignment:</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{waitingOrder.item.description}</div>
                <div className="text-slate-500 dark:text-slate-400">
                  Weight: ~{waitingOrder.item.approxWeightKg}kg • Vehicle: {waitingOrder.vehicleType}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PICKUP</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {waitingOrder.pickupAddress.fullAddress}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">DROP</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {waitingOrder.dropAddress.fullAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-sm">
                <span className="text-emerald-800 dark:text-emerald-300 font-semibold">Your Trip Earning:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatInr(waitingOrder.fare.driverShare)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={handleRejectJob}
              >
                Pass / Decline
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                onClick={handleAcceptJob}
              >
                Accept Delivery ({incomingJobTimer}s)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
