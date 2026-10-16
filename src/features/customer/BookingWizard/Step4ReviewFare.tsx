import React, { useState, useMemo } from 'react'
import { BookingFormData } from './types'
import { useOrders } from '@/context/OrderContext'
import { calculateAccurateRouteDistanceSync } from '@/services/distanceRoutingService'
import { calculateFareBreakdown } from '@/services/pricingEngine'
import { formatInr } from '@/utils/formatters'
import { DEMO_PROMO_CODES } from '@/constants/pricing'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import {
  ShieldAlert,
  Camera,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  FileText,
  Wallet,
  Info,
  Clock,
  Navigation,
} from 'lucide-react'

interface Step4Props {
  formData: BookingFormData
  onChange: (updates: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export const Step4ReviewFare: React.FC<Step4Props> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const { pricingConfig, walletBalance } = useOrders()
  const [promoInput, setPromoInput] = useState(formData.promoCode || '')
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  )
  const [validationError, setValidationError] = useState('')

  // Calculate real driving road distance and transit duration
  const routeEstimate = useMemo(() => {
    return calculateAccurateRouteDistanceSync(
      formData.pickupAddress.coords,
      formData.dropAddress.coords,
      formData.vehicleType,
    )
  }, [formData.pickupAddress.coords, formData.dropAddress.coords, formData.vehicleType])

  const distanceKm = routeEstimate.distanceKm

  // Calculate fare breakdown
  const fare = calculateFareBreakdown({
    distanceKm,
    vehicleType: formData.vehicleType,
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
    promoCode: formData.promoCode,
    applyWalletBalance: formData.useWallet ? walletBalance : 0,
    pricingConfig,
  })

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    const code = promoInput.trim().toUpperCase()
    if (!code) return

    if (DEMO_PROMO_CODES[code]) {
      onChange({ promoCode: code })
      setPromoMessage({
        type: 'success',
        text: `Promo code ${code} applied successfully!`,
      })
    } else {
      setPromoMessage({
        type: 'error',
        text: 'Invalid promo code. Try "LOCALMOVE50" or "FIRSTMOVE".',
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!formData.prohibitedItemsAcknowledged) {
      setValidationError('You must acknowledge that the parcel does not contain prohibited items')
      return
    }
    if (!formData.recordingConsentAcknowledged) {
      setValidationError('You must consent to handover photo & video recording for proof of condition')
      return
    }

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {validationError && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          {validationError}
        </div>
      )}

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Route Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Route Summary
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded font-mono">
              {fare.distanceKm} km • {routeEstimate.formattedDuration}
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup From</span>
              <div className="font-semibold text-slate-800 dark:text-white">{formData.pickupAddress.fullAddress}</div>
              <div className="text-slate-500 dark:text-slate-400">
                Contact: {formData.sender.name} ({formData.sender.phone})
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Drop To</span>
              <div className="font-semibold text-slate-800 dark:text-white">{formData.dropAddress.fullAddress}</div>
              <div className="text-slate-500 dark:text-slate-400">
                Contact: {formData.receiver.name} ({formData.receiver.phone})
              </div>
            </div>
          </div>
        </div>

        {/* Item & Vehicle Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Item & Vehicle
            </span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 dark:text-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded capitalize">
              {formData.vehicleType.replace('_', ' ')}
            </span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-slate-900 dark:text-white">{formData.itemDescription}</div>
            <div className="text-slate-600 dark:text-slate-400">
              Weight: ~{formData.approxWeightKg} kg • Declared Value: {formatInr(formData.declaredValueInr)}
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Services: {formData.helperCount > 0 ? `${formData.helperCount} helper(s)` : 'No helpers'},{' '}
              {formData.hasPackingService ? 'Packing included' : 'No packing'},{' '}
              {formData.hasItemProtection ? 'Transit protected' : 'No protection'}
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Fare Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Itemized Fare Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">100% transparent pricing with zero surprise charges</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 px-2 py-0.5 rounded">
            Verified Estimate
          </span>
        </div>

        <div className="space-y-2.5 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex justify-between py-1">
            <div>
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                Base Transport Fare ({formData.vehicleType.replace('_', ' ')})
              </span>
              <span className="text-[11px] text-slate-400">
                Covers mobilization & initial {fare.includedKm || 2} km
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{formatInr(fare.baseFare)}</span>
          </div>
          <div className="flex justify-between py-1">
            <div>
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                Additional Distance Charge
              </span>
              <span className="text-[11px] text-slate-400">
                {fare.additionalKm && fare.additionalKm > 0
                  ? `${fare.additionalKm} km beyond included base @ ₹${fare.perKmRate}/km`
                  : `Route within included ${fare.includedKm || 2} km`}
              </span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {fare.distanceCharge > 0 ? formatInr(fare.distanceCharge) : '₹0 (Included)'}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <div>
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                Doorstep Handling & Safe Verification Fee
              </span>
              <span className="text-[11px] text-slate-400">Digital two-way OTP & photo/video proof record</span>
            </div>
            <span className="font-medium text-slate-900 dark:text-white font-mono">{formatInr(fare.handlingFee)}</span>
          </div>
          {fare.weightSurcharge && fare.weightSurcharge > 0 && (
            <div className="flex justify-between py-1">
              <div>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block">
                  Cargo Weight Surcharge
                </span>
                <span className="text-[11px] text-slate-400">Heavy payload exceeds vehicle rating</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white font-mono">{formatInr(fare.weightSurcharge)}</span>
            </div>
          )}
          {fare.helperCharge > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Loading Helpers ({fare.helperCount} staff)</span>
              <span className="font-medium text-slate-900 dark:text-white font-mono">{formatInr(fare.helperCharge)}</span>
            </div>
          )}
          {fare.packingCharge > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Protective Packing Service</span>
              <span className="font-medium text-slate-900 dark:text-white font-mono">{formatInr(fare.packingCharge)}</span>
            </div>
          )}
          {fare.itemProtectionFee > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Transit Damage Protection Cover</span>
              <span className="font-medium text-slate-900 dark:text-white font-mono">{formatInr(fare.itemProtectionFee)}</span>
            </div>
          )}
          {fare.nightSurgeAdjustment > 0 && (
            <div className="flex justify-between py-1 text-amber-700 dark:text-amber-400">
              <span>Night Hours Transit Surcharge (11 PM - 6 AM)</span>
              <span className="font-mono">{formatInr(fare.nightSurgeAdjustment)}</span>
            </div>
          )}
          {fare.discount > 0 && (
            <div className="flex justify-between py-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <span>Promo Discount ({fare.promoCodeApplied})</span>
              <span className="font-mono">-{formatInr(fare.discount)}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-slate-600 dark:text-slate-400">Applicable Taxes (5% GST Transport)</span>
            <span className="font-medium text-slate-900 dark:text-white font-mono">{formatInr(fare.taxesGst)}</span>
          </div>
          {fare.walletDeduction > 0 && (
            <div className="flex justify-between py-1 text-indigo-700 dark:text-indigo-400 font-semibold">
              <span>Local Move Wallet Balance Used</span>
              <span className="font-mono">-{formatInr(fare.walletDeduction)}</span>
            </div>
          )}
        </div>

        {/* Promo Code Entry & Wallet Toggle */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code (e.g. LOCALMOVE50)"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <Button type="button" size="sm" variant="outline" onClick={handleApplyPromo}>
              Apply Code
            </Button>
          </div>

          {promoMessage && (
            <p
              className={`text-xs font-semibold ${
                promoMessage.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {promoMessage.text}
            </p>
          )}

          {walletBalance > 0 && (
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                <span className="text-xs text-indigo-900 dark:text-indigo-200">
                  Wallet Balance Available: <strong>{formatInr(walletBalance)}</strong>
                </span>
              </div>
              <Checkbox
                checked={formData.useWallet}
                onChange={(e) => onChange({ useWallet: e.target.checked })}
                label="Apply to Fare"
              />
            </div>
          )}

          {/* Grand Total */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">Total Payable Amount</span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Driver earning separate ({formatInr(fare.driverShare)} share guaranteed)
              </span>
            </div>
            <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
              {formatInr(fare.totalCustomerFare)}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory Checkboxes */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Mandatory Safety Acknowledgements
        </h3>

        <div className="space-y-3 pt-1">
          <Checkbox
            required
            checked={formData.prohibitedItemsAcknowledged}
            onChange={(e) => onChange({ prohibitedItemsAcknowledged: e.target.checked })}
            label="Prohibited Items Declaration"
            description="I certify that this consignment does not contain illegal goods, explosives, firearms, narcotics, cash, or live animals. Delivery partners reserve the right to inspect."
          />

          <Checkbox
            required
            checked={formData.recordingConsentAcknowledged}
            onChange={(e) => onChange({ recordingConsentAcknowledged: e.target.checked })}
            label="Handover Recording & Photo Consent"
            description="I consent to the delivery partner capturing photos and a brief condition video at pickup and drop as tamper-proof evidence for damage protection."
          />
        </div>
      </div>

      {/* Stepper Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Vehicle & Extras
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Proceed to Payment ({formatInr(fare.totalCustomerFare)})
        </Button>
      </div>
    </form>
  )
}
