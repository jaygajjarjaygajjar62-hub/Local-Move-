import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BookingFormData } from './types'
import { DEMO_ADDRESSES } from '@/constants/mockData'
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from '@/services/storage'
import { Step1Locations } from './Step1Locations'
import { Step2ItemDetails } from './Step2ItemDetails'
import { Step3VehicleExtras } from './Step3VehicleExtras'
import { Step4ReviewFare } from './Step4ReviewFare'
import { Step5PaymentConfirmation } from './Step5PaymentConfirmation'
import { searchKnownLocations, extractCityFromAddress } from '@/services/distanceRoutingService'
import { Check, RotateCcw } from 'lucide-react'

const INITIAL_FORM_DATA: BookingFormData = {
  isBookingForOther: false,
  sender: {
    name: 'Kunal Shah',
    phone: '9879011223',
  },
  receiver: {
    name: 'Pooja Trivedi',
    phone: '9924044556',
  },
  pickupAddress: DEMO_ADDRESSES[0], // Satellite
  dropAddress: DEMO_ADDRESSES[1], // Navrangpura

  itemCategory: 'electronics',
  itemDescription: 'Dell XPS 15 Laptop in black protective sleeve with adapter',
  itemQuantity: 1,
  itemSize: 'small',
  dimensions: { length: 38, width: 26, height: 4 },
  approxWeightKg: 2.5,
  declaredValueInr: 65000,
  handlingTags: ['fragile', 'keep_upright'],
  customerPhotos: [],

  vehicleType: 'bike',
  userOverriddenVehicle: false,
  helperCount: 0,
  hasPackingService: false,
  hasItemProtection: true,
  returnToSenderIfFailed: true,
  isScheduled: false,
  scheduledDate: '',
  scheduledTimeSlot: '09:00 AM - 11:00 AM',

  promoCode: '',
  useWallet: false,
  prohibitedItemsAcknowledged: true,
  recordingConsentAcknowledged: true,

  paymentMethod: 'upi',
  payer: 'sender',
}

export const BookingWizardPage: React.FC = () => {
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(() => {
    const saved = loadBookingDraft<BookingFormData>()
    if (saved) return saved

    // If pre-filled from landing page quick card
    const state = location.state as any
    if (state) {
      const pMatch = state.pickup ? searchKnownLocations(state.pickup)[0] : null
      const dMatch = state.drop ? searchKnownLocations(state.drop)[0] : null
      return {
        ...INITIAL_FORM_DATA,
        pickupAddress: state.pickup
          ? {
              ...DEMO_ADDRESSES[0],
              fullAddress: state.pickup,
              coords: pMatch?.coords || DEMO_ADDRESSES[0].coords,
              city: pMatch?.city || extractCityFromAddress(state.pickup),
            }
          : DEMO_ADDRESSES[0],
        dropAddress: state.drop
          ? {
              ...DEMO_ADDRESSES[1],
              fullAddress: state.drop,
              coords: dMatch?.coords || DEMO_ADDRESSES[1].coords,
              city: dMatch?.city || extractCityFromAddress(state.drop),
            }
          : DEMO_ADDRESSES[1],
        vehicleType: state.vehicle || INITIAL_FORM_DATA.vehicleType,
        itemCategory: state.category || INITIAL_FORM_DATA.itemCategory,
      }
    }

    return INITIAL_FORM_DATA
  })

  // Auto-save draft on changes (accidental data loss prevention)
  useEffect(() => {
    saveBookingDraft(formData)
  }, [formData])

  const handleUpdate = (updates: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const handleResetDraft = () => {
    clearBookingDraft()
    setFormData(INITIAL_FORM_DATA)
    setCurrentStep(1)
  }

  const steps = [
    { number: 1, title: 'Locations & Contacts' },
    { number: 2, title: 'Item Details' },
    { number: 3, title: 'Vehicle & Extras' },
    { number: 4, title: 'Fare & Review' },
    { number: 5, title: 'Payment' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Reset Draft */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Book a Delivery / Move
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Guaranteed two-way OTP & photo/video evidence trail
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetDraft}
          className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-semibold self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form Draft</span>
        </button>
      </div>

      {/* Accessible Stepper */}
      <nav aria-label="Booking Progress" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <ol className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          {steps.map((st) => {
            const isCompleted = currentStep > st.number
            const isCurrent = currentStep === st.number
            return (
              <li key={st.number} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={st.number > currentStep}
                  onClick={() => setCurrentStep(st.number)}
                  className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-slate-900 dark:bg-slate-800 text-white'
                      : isCompleted
                      ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : st.number}
                  </span>
                  <span className="hidden md:inline">{st.title}</span>
                </button>
                {st.number < steps.length && (
                  <span className="text-slate-300 dark:text-slate-700 text-xs hidden sm:inline">/</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <div className="pt-2">
        {currentStep === 1 && (
          <Step1Locations
            formData={formData}
            onChange={handleUpdate}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step2ItemDetails
            formData={formData}
            onChange={handleUpdate}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3VehicleExtras
            formData={formData}
            onChange={handleUpdate}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4ReviewFare
            formData={formData}
            onChange={handleUpdate}
            onNext={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <Step5PaymentConfirmation
            formData={formData}
            onChange={handleUpdate}
            onBack={() => setCurrentStep(4)}
            onComplete={() => clearBookingDraft()}
          />
        )}
      </div>
    </div>
  )
}
