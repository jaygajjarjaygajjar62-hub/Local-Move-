import React from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { formatInr } from '@/utils/formatters'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Package,
  Truck,
  IndianRupee,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Radio,
  Phone,
} from 'lucide-react'

export const AdminOverviewPage: React.FC = () => {
  const { orders, drivers } = useOrders()

  const activeOrdersCount = orders.filter((o) =>
    ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(
      o.status,
    ),
  ).length

  const onlineDrivers = drivers.filter((d) => d.isOnline)
  const onlineDriversCount = onlineDrivers.length
  const pendingDriversCount = drivers.filter((d) => d.status === 'pending').length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.fare.totalCustomerFare : 0), 0)

  // 7-day demo volume
  const volumeTrend = [
    { day: 'Mon', orders: 18, rev: 4200 },
    { day: 'Tue', orders: 24, rev: 5900 },
    { day: 'Wed', orders: 31, rev: 7800 },
    { day: 'Thu', orders: 28, rev: 6700 },
    { day: 'Fri', orders: 39, rev: 9400 },
    { day: 'Sat', orders: 48, rev: 12800 },
    { day: 'Sun', orders: 42, rev: 11100 },
  ]
  const maxOrders = Math.max(...volumeTrend.map((v) => v.orders))

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Operations Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time fleet telemetry, order dispatch, and financial overview across Ahmedabad
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/online-drivers">
            <Button variant="outline" size="sm" leftIcon={<Radio className="w-3.5 h-3.5 text-emerald-500" />}>
              Online Fleet ({onlineDriversCount})
            </Button>
          </Link>
          <Link to="/admin/live-ops">
            <Button variant="primary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
              Open Live City Map
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-1 shadow-xs transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Active Orders
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{activeOrdersCount}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% On Schedule</span>
        </div>

        {/* Online Fleet KPI - Clickable directly to Online Drivers */}
        <Link
          to="/admin/online-drivers"
          className="rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-900 p-5 space-y-1 shadow-xs hover:border-emerald-500 transition-all block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online Fleet
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline flex items-center gap-0.5">
              <span>View Roster</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {onlineDriversCount} <span className="text-xs font-normal text-slate-400">/ {drivers.length}</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {onlineDrivers.map(d => d.name.split(' ')[0]).slice(0, 3).join(', ')} online now
          </span>
        </Link>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-1 shadow-xs transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Settled GMV
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{formatInr(totalRevenue + 4520)}</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Provisional Demo GMV</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-1 shadow-xs transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> KYC Verification
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{pendingDriversCount} Pending</div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Review Required</span>
        </div>
      </div>

      {/* Online Drivers Quick Strip */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/20 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Drivers Online Now ({onlineDriversCount})
            </h3>
          </div>
          <Link
            to="/admin/online-drivers"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All Drivers</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {onlineDrivers.map((driver) => (
            <div
              key={driver.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center gap-3 shadow-2xs"
            >
              <div className="relative shrink-0">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {driver.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {driver.vehicleNumber}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                  ★ {driver.rating} • {driver.vehicleModel.split(' ')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Volume Trend Bar Chart */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Daily Order Volume (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dispatch frequency across all vehicle tiers</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
              Total: {volumeTrend.reduce((a, b) => a + b.orders, 0)} Orders
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {volumeTrend.map((v) => {
              const hPct = Math.round((v.orders / maxOrders) * 100)
              return (
                <div key={v.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">{v.orders}</span>
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t h-full flex items-end">
                    <div
                      className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t transition-all"
                      style={{ height: `${hPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{v.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right 4 Cols: Operational Alerts */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Operational Alerts
            </h3>
            <span className="text-xs text-rose-600 font-bold">Live</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Damage Claim Pending
              </div>
              <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                Order #LM-7190 under dispute. Side-by-side inspection ready for review.
              </p>
              <Link to="/admin/claims" className="text-indigo-700 dark:text-indigo-400 font-bold hover:underline block pt-1">
                Inspect Claim Evidence →
              </Link>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Driver KYC Verification
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Mahendra Vaghela submitted Eicher truck documents for approval.
              </p>
              <Link to="/admin/drivers" className="text-indigo-700 dark:text-indigo-400 font-bold hover:underline block pt-1">
                Review Documents →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Dispatches Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Active Orders Feed
          </h3>
          <Link to="/admin/orders" className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
            View All Dispatches
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Sender & Receiver</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Partner</th>
                <th className="py-2.5 px-3 text-right">Fare</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">#{ord.id}</td>
                  <td className="py-2.5 px-3">
                    <OrderStatusBadge status={ord.status} />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{ord.sender.name}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">→ {ord.receiver.name}</div>
                  </td>
                  <td className="py-2.5 px-3 capitalize font-medium text-slate-700 dark:text-slate-300">
                    {ord.vehicleType.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {ord.assignedDriver?.name || 'Unassigned'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-800 dark:text-emerald-400">
                    {formatInr(ord.fare.totalCustomerFare)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link to={`/admin/orders?select=${ord.id}`}>
                      <Button size="sm" variant="outline">
                        Inspect
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
