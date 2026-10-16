import React, { useState, useMemo } from 'react'
import { BookingFormData } from './types'
import { useOrders } from '@/context/OrderContext'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { MockMap } from '@/components/common/MockMap'
import { AddressAutocompleteInput } from '@/components/maps/AddressAutocompleteInput'
import {
  calculateAccurateRouteDistanceSync,
  resolveAddressCoordinates,
} from '@/services/distanceRoutingService'
import { User, Phone, Bookmark, Route, Clock, Loader2 } from 'lucide-react'

interface Step1Props {
  formData: BookingFormData
  onChange: (updates: Partial<BookingFormData>) => void
  onNext: () => void
}

export const Step1Locations: React.FC<Step1Props> = ({ formData, onChange, onNext }) => {
  const { addresses } = useOrders()
  const [error, setError] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  const handleSelectSavedPickup = (addrId: string) => {
    const found = addresses.find((a) => a.id === addrId)
    if (found) {
      onChange({ pickupAddress: found })
    }
  }

  const handleSelectSavedDrop = (addrId: string) => {
    const found = addresses.find((a) => a.id === addrId)
    if (found) {
      onChange({ dropAddress: found })
    }
  }

  // Calculate live road route distance and transit time
  const routeEstimate = useMemo(() => {
    return calculateAccurateRouteDistanceSync(
      formData.pickupAddress.coords,
      formData.dropAddress.coords,
      formData.vehicleType,
    )
  }, [formData.pickupAddress.coords, formData.dropAddress.coords, formData.vehicleType])

  // Dynamic regional delivery zone detection
  const regionLabel = useMemo(() => {
    const pCity = (formData.pickupAddress.city || '').toLowerCase()
    const dCity = (formData.dropAddress.city || '').toLowerCase()
    const pAddr = formData.pickupAddress.fullAddress.toLowerCase()
    const dAddr = formData.dropAddress.fullAddress.toLowerCase()

    if (
      pCity === 'anand' ||
      dCity === 'anand' ||
      pAddr.includes('anand') ||
      dAddr.includes('anand') ||
      pAddr.includes('vidyanagar') ||
      dAddr.includes('vidyanagar')
    ) {
      if (
        (pCity === 'ahmedabad' || pAddr.includes('ahmedabad')) ||
        (dCity === 'ahmedabad' || dAddr.includes('ahmedabad'))
      ) {
        return 'Ahmedabad - Anand Expressway Logistics Corridor'
      }
      return 'Anand / Vallabh Vidyanagar Logistics Grid'
    }

    if (pCity && dCity && pCity !== dCity) {
      return `${formData.pickupAddress.city} ↔ ${formData.dropAddress.city} Intercity Corridor`
    }

    return `${formData.pickupAddress.city || 'Gujarat'} Metro Grid`
  }, [
    formData.pickupAddress.city,
    formData.dropAddress.city,
    formData.pickupAddress.fullAddress,
    formData.dropAddress.fullAddress,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.pickupAddress.fullAddress.trim()) {
      setError('Please provide a complete pickup address')
      return
    }
    if (!formData.dropAddress.fullAddress.trim()) {
      setError('Please provide a complete drop address')
      return
    }
    if (!formData.sender.name || !formData.sender.phone) {
      setError('Sender name and mobile number are required')
      return
    }
    if (!formData.receiver.name || !formData.receiver.phone) {
      setError('Receiver name and mobile number are required for OTP handover')
      return
    }

    // Resolve accurate geocoding before transitioning to Step 2
    setIsResolving(true)
    try {
      const [pRes, dRes] = await Promise.all([
        resolveAddressCoordinates(formData.pickupAddress.fullAddress),
        resolveAddressCoordinates(formData.dropAddress.fullAddress),
      ])

      onChange({
        pickupAddress: {
          ...formData.pickupAddress,
          landmark: formData.pickupAddress.landmark || pRes.landmark,
          coords: pRes.coords,
          city: pRes.city,
        },
        dropAddress: {
          ...formData.dropAddress,
          landmark: formData.dropAddress.landmark || dRes.landmark,
          coords: dRes.coords,
          city: dRes.city,
        },
      })
    } catch (err) {
      console.warn('Geocoding resolution fallback:', err)
    } finally {
      setIsResolving(false)
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Map visual showing current pickup/drop pins and true route telemetry */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <Route className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Route Overview Preview</span>
          </div>
          <span className="font-semibold text-emerald-800 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px]">
            {regionLabel}
          </span>
        </div>

        <MockMap
          pickupCoords={formData.pickupAddress.coords}
          dropCoords={formData.dropAddress.coords}
          height="h-60 sm:h-72"
          showTelemetry={true}
          pickupAddressLabel={formData.pickupAddress.title || formData.pickupAddress.fullAddress}
          dropAddressLabel={formData.dropAddress.title || formData.dropAddress.fullAddress}
        />

        {/* Live Distance and ETA pill indicator */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl dark:bg-slate-900/60 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span className="text-slate-600 dark:text-slate-300">
              Verified Road Distance:{' '}
              <strong className="text-slate-900 dark:text-white font-mono text-sm">
                {routeEstimate.formattedDistance}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Est. Transit Time:{' '}
              <strong className="text-slate-900 dark:text-white">
                {routeEstimate.formattedDuration}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Pickup Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              1. Pickup Location
            </h3>
          </div>
          {addresses.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              <select
                onChange={(e) => handleSelectSavedPickup(e.target.value)}
                className="bg-slate-100 text-slate-700 font-medium rounded px-2 py-1 focus:outline-none text-xs cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:border dark:border-slate-700"
                defaultValue=""
              >
                <option value="" disabled>
                  Use saved address...
                </option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title || a.fullAddress.slice(0, 24)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AddressAutocompleteInput
            label="Pickup Address / Building / Society / Campus"
            required
            value={formData.pickupAddress.fullAddress}
            onChange={(loc) =>
              onChange({
                pickupAddress: {
                  ...formData.pickupAddress,
                  fullAddress: loc.fullAddress,
                  landmark: loc.landmark || formData.pickupAddress.landmark,
                  coords: loc.coords,
                  city: loc.city || formData.pickupAddress.city,
                },
              })
            }
            placeholder="Search campus, society, or landmark (e.g. ADIT Anand, GCET, Satellite)..."
            colorTheme="emerald"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Floor / Flat / Unit Number"
              value={formData.pickupAddress.floor || ''}
              onChange={(e) =>
                onChange({
                  pickupAddress: { ...formData.pickupAddress, floor: e.target.value },
                })
              }
              placeholder="e.g. 4th Floor, Lift available"
            />
            <Input
              label="Nearby Landmark"
              value={formData.pickupAddress.landmark || ''}
              onChange={(e) =>
                onChange({
                  pickupAddress: { ...formData.pickupAddress, landmark: e.target.value },
                })
              }
              placeholder="e.g. Near CVM Satellite Campus"
            />
          </div>

          <Input
            label="Pickup Gate / Society Instructions (Optional)"
            value={formData.pickupAddress.instructions || ''}
            onChange={(e) =>
              onChange({
                pickupAddress: {
                  ...formData.pickupAddress,
                  instructions: e.target.value,
                },
              })
            }
            placeholder="e.g. Enter through Gate 2, ask for Admin Block"
          />
        </div>
      </div>

      {/* Drop Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white inline-block" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              2. Drop Location
            </h3>
          </div>
          {addresses.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              <select
                onChange={(e) => handleSelectSavedDrop(e.target.value)}
                className="bg-slate-100 text-slate-700 font-medium rounded px-2 py-1 focus:outline-none text-xs cursor-pointer dark:bg-slate-800 dark:text-slate-200 dark:border dark:border-slate-700"
                defaultValue=""
              >
                <option value="" disabled>
                  Use saved address...
                </option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title || a.fullAddress.slice(0, 24)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AddressAutocompleteInput
            label="Drop Address / Building / Society / Campus"
            required
            value={formData.dropAddress.fullAddress}
            onChange={(loc) =>
              onChange({
                dropAddress: {
                  ...formData.dropAddress,
                  fullAddress: loc.fullAddress,
                  landmark: loc.landmark || formData.dropAddress.landmark,
                  coords: loc.coords,
                  city: loc.city || formData.dropAddress.city,
                },
              })
            }
            placeholder="Search campus, society, or landmark (e.g. GCET Anand, Navrangpura)..."
            colorTheme="navy"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Floor / Unit"
              value={formData.dropAddress.floor || ''}
              onChange={(e) =>
                onChange({
                  dropAddress: { ...formData.dropAddress, floor: e.target.value },
                })
              }
              placeholder="e.g. Ground Floor, Reception Desk"
            />
            <Input
              label="Nearby Landmark"
              value={formData.dropAddress.landmark || ''}
              onChange={(e) =>
                onChange({
                  dropAddress: { ...formData.dropAddress, landmark: e.target.value },
                })
              }
              placeholder="e.g. Opp. BVM Ground, Bakrol Road"
            />
          </div>

          <Input
            label="Drop Delivery Notes (Optional)"
            value={formData.dropAddress.instructions || ''}
            onChange={(e) =>
              onChange({
                dropAddress: { ...formData.dropAddress, instructions: e.target.value },
              })
            }
            placeholder="e.g. Call receiver 5 mins before reaching"
          />
        </div>
      </div>

      {/* Contacts Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            3. Contact Verification Details
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Used for pickup & drop OTP verification
          </span>
        </div>

        {/* Book on behalf toggle */}
        <Checkbox
          checked={formData.isBookingForOther}
          onChange={(e) => onChange({ isBookingForOther: e.target.checked })}
          label="I am booking on behalf of another sender"
          description="Enable to enter a different sender name and contact number for pickup"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Sender */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Sender Details (Pickup OTP recipient)
            </span>
            <Input
              label="Sender Full Name"
              required
              value={formData.sender.name}
              onChange={(e) =>
                onChange({ sender: { ...formData.sender, name: e.target.value } })
              }
              placeholder="e.g. Kunal Shah"
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="Sender Mobile Number"
              type="tel"
              required
              value={formData.sender.phone}
              onChange={(e) =>
                onChange({ sender: { ...formData.sender, phone: e.target.value } })
              }
              placeholder="10-digit number"
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Receiver */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Receiver Details (Drop OTP recipient)
            </span>
            <Input
              label="Receiver Full Name"
              required
              value={formData.receiver.name}
              onChange={(e) =>
                onChange({ receiver: { ...formData.receiver, name: e.target.value } })
              }
              placeholder="e.g. Pooja Trivedi"
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="Receiver Mobile Number"
              type="tel"
              required
              value={formData.receiver.phone}
              onChange={(e) =>
                onChange({ receiver: { ...formData.receiver, phone: e.target.value } })
              }
              placeholder="10-digit number"
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>
      </div>

      {/* Navigation action */}
      <div className="flex justify-end pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={isResolving}>
          {isResolving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying Route...
            </span>
          ) : (
            'Continue to Item Details'
          )}
        </Button>
      </div>
    </form>
  )
}
