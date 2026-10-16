import React, { useState, useMemo } from 'react'
import { BookingFormData } from './types'
import { VEHICLE_OPTIONS } from '@/constants/vehicles'
import { VehicleType } from '@/types'
import { useOrders } from '@/context/OrderContext'
import { calculateFareBreakdown } from '@/services/pricingEngine'
import { calculateAccurateRouteDistanceSync } from '@/services/distanceRoutingService'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { formatInr } from '@/utils/formatters'
import {
  Truck,
  Bike,
  Car,
  Boxes,
  Users,
  ShieldCheck,
  Calendar,
  Clock,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Info,
} from 'lucide-react'

interface Step3Props {
  formData: BookingFormData
  onChange: (updates: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export const Step3VehicleExtras: React.FC<Step3Props> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const { pricingConfig } = useOrders()
  const [scheduleError, setScheduleError] = useState('')

  // Compute accurate road distance for the trip
  const routeEstimate = useMemo(() => {
    return calculateAccurateRouteDistanceSync(
      formData.pickupAddress.coords,
      formData.dropAddress.coords,
      formData.vehicleType,
    )
  }, [formData.pickupAddress.coords, formData.dropAddress.coords, formData.vehicleType])

  // Determine auto suggested vehicle based on weight & size
  const getSuggestedVehicle = (): { type: VehicleType; reason: string } => {
    if (formData.itemCategory === 'household_shifting' || formData.approxWeightKg > 1000) {
      return {
        type: 'large_tempo',
        reason: 'Suggested Large Tempo based on household shifting volume & heavy payload (>1000 kg).',
      }
    }
    if (formData.approxWeightKg > 250 || formData.itemSize === 'large') {
      return {
        type: 'mini_truck',
        reason: 'Suggested Mini Truck (Tata Ace) because item weight exceeds 250kg or is large-appliance sized.',
      }
    }
    if (formData.approxWeightKg > 20 || formData.itemSize === 'medium') {
      return {
        type: 'cargo_auto',
        reason: 'Suggested Cargo Auto for medium load (20kg to 250kg) with enclosed weather cover.',
      }
    }
    return {
      type: 'bike',
      reason: 'Suggested Bike / Scooter: Most affordable & fastest for light items under 20kg.',
    }
  }

  const suggestion = getSuggestedVehicle()

  const handleSelectVehicle = (type: VehicleType) => {
    onChange({
      vehicleType: type,
      userOverriddenVehicle: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setScheduleError('')

    if (formData.isScheduled) {
      if (!formData.scheduledDate) {
        setScheduleError('Please pick a scheduled delivery date')
        return
      }
      const todayStr = new Date().toISOString().split('T')[0]
      if (formData.scheduledDate < todayStr) {
        setScheduleError('Scheduled date cannot be in the past')
        return
      }
    }

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Demo Disclosures banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Provisional Demo Configuration:</strong> Vehicle load limits, protection rates, and helper tariffs are editable in Admin and subject to final protocol signoff.
        </div>
      </div>

      {/* Suggested Vehicle Callout */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-800/60 p-4 space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
            System Recommendation
          </span>
        </div>
        <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">{suggestion.reason}</p>
      </div>

      {/* Vehicle Options Grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              1. Vehicle Selection & Pricing
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Trip Distance: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{routeEstimate.formattedDistance}</strong> • Est. Transit: {routeEstimate.formattedDuration}
            </span>
          </div>
          <span className="text-xs text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 px-2.5 py-1 rounded-md font-medium">
            Tap a vehicle to select
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Object.values(VEHICLE_OPTIONS).map((v) => {
            const isSelected = formData.vehicleType === v.type
            const isSuggested = suggestion.type === v.type

            // Calculate estimated trip fare for this specific vehicle
            const vFare = calculateFareBreakdown({
              distanceKm: routeEstimate.distanceKm,
              vehicleType: v.type,
              item: {
                category: formData.itemCategory,
                description: formData.itemDescription,
                quantity: formData.itemQuantity,
                size: formData.itemSize,
                approxWeightKg: formData.approxWeightKg,
                declaredValueInr: formData.declaredValueInr,
                handlingTags: formData.handlingTags,
                customerPhotos: formData.customerPhotos,
              },
              helperCount: formData.helperCount,
              hasPackingService: formData.hasPackingService,
              hasItemProtection: formData.hasItemProtection,
              pricingConfig,
            })

            return (
              <div
                key={v.type}
                onClick={() => handleSelectVehicle(v.type)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600 shadow-sm dark:bg-emerald-950/40 dark:border-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700'
                }`}
              >
                {isSuggested && (
                  <span className="absolute -top-2.5 right-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{v.name}</div>
                  <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {v.type === 'bike' ? (
                      <Bike className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    ) : v.type === 'cargo_auto' ? (
                      <Car className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <Truck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Capacity: Up to {v.capacityWeightKg} kg
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Base ₹{v.baseFare} (first {v.minDistanceKm || 2} km) • ₹{v.perKmRate}/km
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Est. Trip Fare:</span>
                  <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 font-mono">
                    {formatInr(vFare.totalCustomerFare)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Extras: Helpers & Packing */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          2. Packing & Helper Add-ons
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Packing Service Card */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Protective Packing</span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-emerald-400">+₹250</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              On-site multi-layer bubble wrap, edge cardboard cushions, and sealed shrink wrap for electronics, glass, and furniture.
            </p>
            <Checkbox
              checked={formData.hasPackingService}
              onChange={(e) => onChange({ hasPackingService: e.target.checked })}
              label="Add packing service to this booking"
            />
          </div>

          {/* Helpers Card */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Hire Loading Helpers</span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-emerald-400">₹180 / helper</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              Professional moving staff for heavy stairs carriage, floor loading, and placing items in rooms.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Number of Helpers:</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => onChange({ helperCount: count })}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      formData.helperCount === count
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Item Protection & Return Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">Transit Damage Protection</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Covers verified declared item value (up to {formatInr(formData.declaredValueInr)}) against transit accidents and transit scratches.
            </p>
            <Checkbox
              checked={formData.hasItemProtection}
              onChange={(e) => onChange({ hasItemProtection: e.target.checked })}
              label="Enable Item Protection (+1.5% declared value)"
            />
          </div>

          <div className="p-4 rounded-lg border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">Return to Sender Safe Guard</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              If the receiver is unreachable at the destination, safely return parcel to the sender rather than holding at hub.
            </p>
            <Checkbox
              checked={formData.returnToSenderIfFailed}
              onChange={(e) => onChange({ returnToSenderIfFailed: e.target.checked })}
              label="Return item to sender if receiver unavailable"
            />
          </div>
        </div>
      </div>

      {/* Schedule or Instant */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            3. Delivery Timing
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Book immediately or reserve ahead</span>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => onChange({ isScheduled: false })}
            className={`p-3 rounded-lg border text-xs font-bold transition-colors ${
              !formData.isScheduled
                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Dispatch Now (Instant)
          </button>
          <button
            type="button"
            onClick={() => onChange({ isScheduled: true })}
            className={`p-3 rounded-lg border text-xs font-bold transition-colors ${
              formData.isScheduled
                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Schedule for Later
          </button>
        </div>

        {formData.isScheduled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Select Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.scheduledDate || ''}
                onChange={(e) => onChange({ scheduledDate: e.target.value })}
                className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Preferred Time Window
              </label>
              <select
                value={formData.scheduledTimeSlot || '09:00 AM - 11:00 AM'}
                onChange={(e) => onChange({ scheduledTimeSlot: e.target.value })}
                className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="07:00 AM - 09:00 AM">Early Morning (07:00 AM - 09:00 AM)</option>
                <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                <option value="11:00 AM - 01:00 PM">Noon (11:00 AM - 01:00 PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="05:00 PM - 07:00 PM">Evening (05:00 PM - 07:00 PM)</option>
                <option value="08:00 PM - 10:00 PM">Night Shift (08:00 PM - 10:00 PM)</option>
              </select>
            </div>
          </div>
        )}

        {scheduleError && (
          <p className="text-xs font-semibold text-rose-600">{scheduleError}</p>
        )}
      </div>

      {/* Stepper Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Item Details
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Review Fare & Summary
        </Button>
      </div>
    </form>
  )
}
