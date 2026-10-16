import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { MockMap } from '@/components/common/MockMap'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatInr } from '@/utils/formatters'
import { Map, Truck, Navigation, Users, ShieldCheck, Filter } from 'lucide-react'

export const AdminLiveOpsPage: React.FC = () => {
  const { orders, drivers } = useOrders()
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')

  const activeOrders = orders.filter((o) =>
    ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(
      o.status,
    ),
  )

  const activeOrder = activeOrders[0] || orders[0]

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live City Operations Map
          </h1>
          <p className="text-xs text-slate-500">
            Real-time fleet tracking, geofence status, and active deliveries across Ahmedabad
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Filter Vehicle:</span>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none"
          >
            <option value="all">All Vehicle Classes</option>
            <option value="bike">Bikes (2W)</option>
            <option value="cargo_auto">Cargo Autos</option>
            <option value="mini_truck">Mini Trucks</option>
            <option value="large_tempo">Large Tempos</option>
          </select>
        </div>
      </div>

      {/* Grid: Map and Fleet Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <MockMap
            pickupCoords={activeOrder.pickupAddress.coords}
            dropCoords={activeOrder.dropAddress.coords}
            driverCoords={activeOrder.assignedDriver?.currentCoords}
            driverVehicleType={activeOrder.vehicleType}
            driverName={activeOrder.assignedDriver?.name}
            isMoving={activeOrder.status === 'in_transit'}
            height="h-[480px]"
            additionalMarkers={drivers.map((d) => ({
              id: d.id,
              title: `${d.name} (${d.vehicleNumber})`,
              coords: d.currentCoords,
              status: d.isOnline ? 'online' : 'offline',
              vehicle: d.vehicleType,
            }))}
          />

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Tracking Focused on Order #{activeOrder.id}</span>
              <span className="text-slate-500">({activeOrder.item.description})</span>
            </div>
            <OrderStatusBadge status={activeOrder.status} />
          </div>
        </div>

        {/* Right 4 Cols: Fleet Status Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Active Fleet Status ({drivers.length})
            </h3>

            <div className="space-y-3">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span>{drv.name}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        drv.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {drv.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  <div className="text-slate-600 flex justify-between">
                    <span>{drv.vehicleModel}</span>
                    <span className="font-mono font-semibold">{drv.vehicleNumber}</span>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Cash Balance: {formatInr(drv.cashInHandBalance)}</span>
                    <span className="text-emerald-700 font-semibold">★ {drv.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
