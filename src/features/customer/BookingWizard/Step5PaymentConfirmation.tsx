import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookingFormData } from './types'
import { useOrders } from '@/context/OrderContext'
import { useDemo } from '@/context/DemoContext'
import { calculateAccurateRouteDistanceSync } from '@/services/distanceRoutingService'
import { calculateFareBreakdown } from '@/services/pricingEngine'
import { formatInr } from '@/utils/formatters'
import { Order, PaymentMethod, Payer } from '@/types'
import { Button } from '@/components/ui/Button'
import {
  Banknote,
  QrCode,
  CreditCard,
  Wallet,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Truck,
  RotateCcw,
  Calendar,
  AlertTriangle,
} from 'lucide-react'

interface Step5Props {
  formData: BookingFormData
  onChange: (updates: Partial<BookingFormData>) => void
  onBack: () => void
  onComplete: () => void
}

export const Step5PaymentConfirmation: React.FC<Step5Props> = ({
  formData,
  onChange,
  onBack,
  onComplete,
}) => {
  const navigate = useNavigate()
  const { createOrder, pricingConfig, walletBalance } = useOrders()
  const { scenarios } = useDemo()

  const [paymentPhase, setPaymentPhase] = useState<'select' | 'processing' | 'finding_driver' | 'failed' | 'no_driver'>(
    'select',
  )
  const [createdOrderId, setCreatedOrderId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const routeEstimate = calculateAccurateRouteDistanceSync(
    formData.pickupAddress.coords,
    formData.dropAddress.coords,
    formData.vehicleType,
  )
  const distanceKm = routeEstimate.distanceKm

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

  const paymentOptions: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'upi',
      label: 'UPI (GPay / PhonePe / Paytm)',
      desc: 'Instant QR or UPI ID simulation',
      icon: <QrCode className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'cash',
      label: 'Cash on Handover',
      desc: 'Pay delivery partner directly in cash',
      icon: <Banknote className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'card',
      label: 'Credit / Debit Card',
      desc: 'Simulated sandbox tokenization',
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'wallet',
      label: 'Local Move Wallet',
      desc: `Balance: ${formatInr(walletBalance)}`,
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: 'receiver_pays',
      label: 'Receiver Pays at Drop',
      desc: 'Recipient settles via cash or online link upon delivery',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
    },
  ]

  const handleExecutePayment = async () => {
    setPaymentPhase('processing')

    // Simulated network delay
    await new Promise((r) => setTimeout(r, 1200))

    if (scenarios.paymentFailed && formData.paymentMethod !== 'cash') {
      setPaymentPhase('failed')
      setErrorMessage('Bank server declined the transaction (Simulated Scenario Active).')
      return
    }

    setPaymentPhase('finding_driver')

    const newOrderId = 'LM-' + Math.floor(1000 + Math.random() * 9000)
    const newOrder: Order = {
      id: newOrderId,
      trackingToken: `tr_${newOrderId.toLowerCase()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'searching_driver',
      customer: {
        id: 'cust-demo',
        name: formData.sender.name,
        phone: formData.sender.phone,
      },
      sender: formData.sender,
      receiver: formData.receiver,
      pickupAddress: formData.pickupAddress,
      dropAddress: formData.dropAddress,
      item: {
        category: formData.itemCategory,
        description: formData.itemDescription,
        quantity: formData.itemQuantity,
        size: formData.itemSize,
        dimensions: formData.dimensions,
        approxWeightKg: formData.approxWeightKg,
        declaredValueInr: formData.declaredValueInr,
        handlingTags: formData.handlingTags,
        customerPhotos: formData.customerPhotos,
      },
      vehicleType: formData.vehicleType,
      helpersCount: formData.helperCount,
      hasPackingService: formData.hasPackingService,
      hasItemProtection: formData.hasItemProtection,
      isScheduled: formData.isScheduled,
      scheduledTime: formData.isScheduled
        ? `${formData.scheduledDate} ${formData.scheduledTimeSlot}`
        : undefined,
      returnToSenderIfFailed: formData.returnToSenderIfFailed,
      fare,
      paymentMethod: formData.paymentMethod,
      paymentStatus: 'success',
      payer: formData.payer,
      pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
      dropOtp: String(Math.floor(1000 + Math.random() * 9000)),
      proofs: {
        pickupOtpVerified: false,
        pickupSenderNameConfirmed: false,
        pickupProofs: [],
        pickupCustomerApproved: false,
        dropOtpVerified: false,
        dropReceiverNameConfirmed: false,
        dropProofs: [],
        dropReceiverAcknowledged: false,
      },
      timeline: [
        {
          status: 'created',
          timestamp: new Date().toISOString(),
          note: `Booking confirmed. Mode: ${formData.paymentMethod.toUpperCase()}`,
        },
      ],
    }

    setCreatedOrderId(newOrderId)

    // Wait 2 seconds for radar search
    setTimeout(async () => {
      if (scenarios.noDriverAvailable) {
        setPaymentPhase('no_driver')
        createOrder(newOrder)
      } else {
        await createOrder(newOrder)
        onComplete()
        navigate(`/customer/orders/${newOrderId}`)
      }
    }, 2200)
  }

  return (
    <div className="space-y-6 text-left">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong>Simulated Sandbox Payments:</strong> No actual card details, banking credentials, or financial deductions are made.
        </div>
      </div>

      {paymentPhase === 'select' && (
        <div className="space-y-6">
          {/* Payer Selection */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Who is paying for this delivery?
            </h3>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => onChange({ payer: 'sender' })}
                className={`p-3 rounded-lg border text-xs font-bold transition-colors ${
                  formData.payer === 'sender'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Sender Pays Now
              </button>
              <button
                type="button"
                onClick={() => onChange({ payer: 'receiver', paymentMethod: 'receiver_pays' })}
                className={`p-3 rounded-lg border text-xs font-bold transition-colors ${
                  formData.payer === 'receiver'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Receiver Pays at Drop
              </button>
            </div>
          </div>

          {/* Payment Method List */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Select Payment Mode
              </h3>
              <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400">
                Amount: {formatInr(fare.totalCustomerFare)}
              </span>
            </div>

            <div className="space-y-2.5">
              {paymentOptions.map((opt) => {
                const isSelected = formData.paymentMethod === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ paymentMethod: opt.id })}
                    className={`w-full p-3.5 rounded-xl border text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">{opt.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</div>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back to Fare Review
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleExecutePayment}
              className="text-sm font-bold"
            >
              Confirm & Book Order ({formatInr(fare.totalCustomerFare)})
            </Button>
          </div>
        </div>
      )}

      {/* Payment Processing State */}
      {paymentPhase === 'processing' && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Processing Simulated Payment...</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Securing gateway handshake and verifying authorization for {formatInr(fare.totalCustomerFare)}.
          </p>
        </div>
      )}

      {/* Finding Delivery Partner State */}
      {paymentPhase === 'finding_driver' && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Truck className="w-7 h-7" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Finding your delivery partner...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Connecting to nearest verified {formData.vehicleType.replace('_', ' ')} partners near {formData.pickupAddress.fullAddress.slice(0, 30)}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300 max-w-xs mx-auto">
            Broadcasting Job • Order #{createdOrderId}
          </div>
        </div>
      )}

      {/* Payment Failed State */}
      {paymentPhase === 'failed' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/40 dark:border-rose-900 p-8 text-center space-y-4 shadow-sm">
          <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200">Payment Failed (Simulated)</h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 max-w-sm mx-auto">{errorMessage}</p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => setPaymentPhase('select')}>
              Change Payment Mode
            </Button>
            <Button variant="primary" onClick={handleExecutePayment}>
              Retry Transaction
            </Button>
          </div>
        </div>
      )}

      {/* No Driver Available State */}
      {paymentPhase === 'no_driver' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/40 dark:border-amber-900 p-8 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">No Nearby Partner Available Right Now</h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 max-w-sm mx-auto">
              Demand in this sector is currently peak. You can retry matching or schedule for a preferred time slot.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setPaymentPhase('finding_driver')
                setTimeout(() => {
                  onComplete()
                  navigate(`/customer/orders/${createdOrderId}`)
                }, 1500)
              }}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Widen Search Radius & Retry
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onComplete()
                navigate('/customer/orders')
              }}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Convert to Scheduled Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
