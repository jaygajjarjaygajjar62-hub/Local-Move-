import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { formatInr } from '@/utils/formatters'
import { DriverProfile } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Truck,
  Power,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Star,
  Clock,
  Layers,
  Radio,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Coins,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react'

export const AdminOnlineDriversPage: React.FC = () => {
  const { drivers, orders, updateDriverOnlineStatus } = useOrders()
  const { showToast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'online' | 'all' | 'on_trip' | 'available' | 'offline'>('online')
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')

  // Find active orders with assigned drivers
  const activeOrdersByDriver = useMemo(() => {
    const map = new Map<string, string>()
    orders.forEach((o) => {
      if (
        o.assignedDriver?.id &&
        ['driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(o.status)
      ) {
        map.set(o.assignedDriver.id, o.id)
      }
    })
    return map
  }, [orders])

  // Key fleet metrics
  const totalDrivers = drivers.length
  const onlineDrivers = drivers.filter((d) => d.isOnline)
  const onlineCount = onlineDrivers.length
  const offlineCount = totalDrivers - onlineCount
  const onTripCount = drivers.filter((d) => d.isOnline && activeOrdersByDriver.has(d.id)).length
  const availableCount = onlineCount - onTripCount

  // Filtered driver list
  const filteredDrivers = useMemo(() => {
    return drivers.filter((drv) => {
      // 1. Status Filter
      if (statusFilter === 'online' && !drv.isOnline) return false
      if (statusFilter === 'offline' && drv.isOnline) return false
      if (statusFilter === 'on_trip' && (!drv.isOnline || !activeOrdersByDriver.has(drv.id))) return false
      if (statusFilter === 'available' && (!drv.isOnline || activeOrdersByDriver.has(drv.id))) return false

      // 2. Vehicle Filter
      if (vehicleFilter !== 'all' && drv.vehicleType !== vehicleFilter) return false

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = drv.name.toLowerCase().includes(q)
        const matchesPhone = drv.phone.includes(q)
        const matchesVehicle = drv.vehicleNumber.toLowerCase().includes(q) || drv.vehicleModel.toLowerCase().includes(q)
        if (!matchesName && !matchesPhone && !matchesVehicle) return false
      }

      return true
    })
  }, [drivers, statusFilter, vehicleFilter, searchQuery, activeOrdersByDriver])

  const handleToggleOnline = (driver: DriverProfile) => {
    const newStatus = !driver.isOnline
    updateDriverOnlineStatus(driver.id, newStatus)
    showToast({
      title: newStatus ? 'Partner is Now Online' : 'Partner Taken Offline',
      message: `${driver.name} is now ${newStatus ? 'ONLINE and ready for dispatch' : 'OFFLINE'}.`,
      type: newStatus ? 'success' : 'info',
    })
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Online Fleet & Driver Roster
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status of delivery partners currently online with name, vehicle telemetry, active deliveries, and dispatch availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/live-ops">
            <Button variant="outline" size="sm" leftIcon={<MapPin className="w-3.5 h-3.5" />}>
              View Live Map
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              showToast({
                title: 'Fleet Telemetry Refreshed',
                message: 'Active driver GPS and status updated.',
                type: 'info',
              })
            }}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setStatusFilter('online')}
          className={`rounded-xl border p-4 transition-all cursor-pointer ${
            statusFilter === 'online'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online Drivers
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600">
              {Math.round((onlineCount / (totalDrivers || 1)) * 100)}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {onlineCount} <span className="text-xs font-normal text-slate-400">/ {totalDrivers} total</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Active in Ahmedabad network
          </p>
        </div>

        <div
          onClick={() => setStatusFilter('on_trip')}
          className={`rounded-xl border p-4 transition-all cursor-pointer ${
            statusFilter === 'on_trip'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> On Active Trip
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {onTripCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Fulfilling deliveries currently
          </p>
        </div>

        <div
          onClick={() => setStatusFilter('available')}
          className={`rounded-xl border p-4 transition-all cursor-pointer ${
            statusFilter === 'available'
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" /> Available for Dispatch
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {availableCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Idle & ready for next job
          </p>
        </div>

        <div
          onClick={() => setStatusFilter('offline')}
          className={`rounded-xl border p-4 transition-all cursor-pointer ${
            statusFilter === 'offline'
              ? 'border-slate-400 bg-slate-100 dark:bg-slate-800 shadow-xs'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5 text-slate-400" /> Offline Drivers
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {offlineCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Not accepting new dispatches
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by driver name, phone, or vehicle number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Vehicle Dropdown Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Vehicle:</span>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              aria-label="Filter by vehicle type"
              className="h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Vehicles</option>
              <option value="bike">Bike / 2W</option>
              <option value="cargo_auto">Cargo Auto</option>
              <option value="mini_truck">Tata Ace / Mini Truck</option>
              <option value="truck_eicher">Eicher / 14ft Truck</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('online')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'online'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Online Drivers ({onlineCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Fleet ({totalDrivers})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('on_trip')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'on_trip'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>On Delivery ({onTripCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'available'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Available ({availableCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('offline')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'offline'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Offline ({offlineCount})
          </button>
        </div>
      </div>

      {/* Driver List Roster */}
      {filteredDrivers.length === 0 ? (
        <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No drivers found matching criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No driver currently matches &ldquo;{searchQuery || statusFilter}&rdquo;. Try clearing filters or bringing a partner online.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('online')
                setVehicleFilter('all')
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDrivers.map((driver) => {
            const activeOrderId = activeOrdersByDriver.get(driver.id)
            const isOnline = driver.isOnline

            return (
              <div
                key={driver.id}
                className={`rounded-xl border p-4 sm:p-5 space-y-4 transition-all shadow-xs ${
                  isOnline
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-slate-900 hover:border-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                }`}
              >
                {/* Header: Driver Name & Live Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-13 h-13 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`}
                        title={isOnline ? 'Driver is Online' : 'Driver is Offline'}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                          {driver.name}
                        </h3>
                        {driver.status === 'approved' && (
                          <span title="KYC Verified">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <a
                        href={`tel:${driver.phone}`}
                        className="text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>+91 {driver.phone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Online / Offline Pill */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 flex items-center gap-1 ${
                      isOnline
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
                      }`}
                    />
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                {/* Vehicle & Assignment Status */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      Vehicle & Registration
                    </span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-[10px] border border-amber-200 dark:border-amber-800">
                      {driver.vehicleNumber}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{driver.vehicleModel}</span>
                  </div>

                  {/* Active Job Status */}
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Job Assignment:</span>
                    {activeOrderId ? (
                      <Link
                        to="/admin/orders"
                        className="font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/40 px-2 py-0.5 rounded flex items-center gap-1 hover:underline"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>Trip #{activeOrderId}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    ) : isOnline ? (
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Ready for Dispatch</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Not Active</span>
                    )}
                  </div>
                </div>

                {/* Key Metrics: Rating, Completed, Cash in Hand */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Rating</span>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{driver.rating}</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Lifetime</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {driver.totalTrips} trips
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Cash in Hand</span>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                      {formatInr(driver.cashInHandBalance)}
                    </div>
                  </div>
                </div>

                {/* GPS Coordinates */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>
                      {driver.currentCoords.lat.toFixed(4)}, {driver.currentCoords.lng.toFixed(4)}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Ahmedabad Hub</span>
                </div>

                {/* Actions: Admin Status Toggle */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant={isOnline ? 'danger' : 'primary'}
                    className="flex-1 font-bold text-xs"
                    leftIcon={<Power className="w-3.5 h-3.5" />}
                    onClick={() => handleToggleOnline(driver)}
                  >
                    {isOnline ? 'Switch to Offline' : 'Set to Online'}
                  </Button>

                  <a href={`tel:${driver.phone}`} className="shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      title={`Call ${driver.name}`}
                      aria-label={`Call ${driver.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    </Button>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
