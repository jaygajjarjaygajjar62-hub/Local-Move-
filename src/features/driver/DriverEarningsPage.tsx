import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { formatInr, formatDateTime } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { IndianRupee, TrendingUp, Award, Calendar, AlertTriangle, ArrowUpRight } from 'lucide-react'

export const DriverEarningsPage: React.FC = () => {
  const { drivers, orders } = useOrders()
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today')

  const profile = drivers.find((d) => d.id === 'drv-1') || drivers[0]
  const completedOrders = orders.filter((o) => o.status === 'completed')

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Earnings & Trip History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transparent breakdown: 80% fare share + 100% of customer tips
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          {(['today', 'week', 'month'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md font-bold uppercase tracking-wider capitalize transition-colors ${
                filter === f ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-2xs transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
            Net Trip Earnings
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatInr(filter === 'today' ? profile.todayEarnings : profile.todayEarnings * 5.2)}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Excludes platform commissions</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-2xs transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
            Customer Tips (100% Yours)
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {formatInr(filter === 'today' ? 100 : 450)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Directly deposited to bank</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-2xs transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
            Cash-in-Hand Balance
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatInr(profile.cashInHandBalance)}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400">Company share owed: {formatInr(profile.companyShareOwed)}</span>
        </div>
      </div>

      {/* Completed Trip History List */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs transition-colors">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Completed Trips Breakdown
        </h3>

        <div className="space-y-3 text-xs">
          {completedOrders.length === 0 ? (
            <p className="text-slate-500 py-4 text-center">No completed trips logged yet today.</p>
          ) : (
            completedOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">#{ord.id}</span>
                    <span className="text-slate-500 dark:text-slate-400">• {formatDateTime(ord.updatedAt)}</span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">{ord.item.description}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ord.pickupAddress.title || ord.pickupAddress.fullAddress.slice(0, 24)} →{' '}
                    {ord.dropAddress.title || ord.dropAddress.fullAddress.slice(0, 24)} ({ord.fare.distanceKm} km)
                  </div>
                </div>

                <div className="sm:text-right space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Trip Earning</span>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    +{formatInr(ord.fare.driverShare)}
                  </div>
                  {ord.driverRating?.tipInr && ord.driverRating.tipInr > 0 && (
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      +₹{ord.driverRating.tipInr} Tip
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
