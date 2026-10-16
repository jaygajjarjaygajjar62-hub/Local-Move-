import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { VEHICLE_OPTIONS } from '@/constants/vehicles'
import { VehicleType } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  FileText,
  CreditCard,
  Truck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

export const DriverOnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('9825099887')
  const [email, setEmail] = useState('new.driver@example.com')
  const [name, setName] = useState('Suresh Solanki')
  const [vehicleType, setVehicleType] = useState<VehicleType>('bike')
  const [vehicleNumber, setVehicleNumber] = useState('GJ-01-BK-9912')

  // Document fields (Synthetic previews)
  const [dlNumber, setDlNumber] = useState('GJ01 20190019284')
  const [dlExpiry, setDlExpiry] = useState('2035-12-31')
  const [dlFront, setDlFront] = useState<string | null>(
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
  )
  const [aadhaarLast4, setAadhaarLast4] = useState('8921')
  const [aadhaarFront, setAadhaarFront] = useState<string | null>(
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
  )
  const [rcFront, setRcFront] = useState<string | null>(
    'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80',
  )
  const [selfie, setSelfie] = useState<string | null>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({
      title: 'Documents Submitted',
      message: 'Your partner KYC has been submitted for Aera operations verification.',
      type: 'success',
    })
    navigate('/driver/verification-status')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-4">
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Delivery Partner Onboarding
        </h1>
        <p className="text-xs text-slate-400">
          Only 3 compulsory documents required: Driving Licence, Aadhaar, and RC Book
        </p>
      </div>

      {/* Safety Compliance Warning */}
      <div className="bg-amber-950/60 border border-amber-800/80 rounded-xl p-4 text-xs text-amber-300 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Synthetic Sample Documents Only:</span>
        </div>
        <p className="leading-relaxed">
          For your privacy and security, do NOT upload real government IDs into this browser demonstration. Pre-loaded synthetic mock previews are provided for testing. Aadhaar numbers are masked by default.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Contact */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            1. Contact Details (Compulsory)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number (OTP)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Compulsory)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Step 2: Vehicle Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            2. Vehicle Category & Plate Number
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Category</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full h-11 px-3 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Object.values(VEHICLE_OPTIONS).map((v) => (
                  <option key={v.type} value={v.type}>
                    {v.name} (Max {v.capacityWeightKg}kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Plate (RC)</label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Compulsory Documents */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            3. KYC Document Uploads
          </h3>

          {/* Driving Licence */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Driving Licence (DL)
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Sample Attached</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value)}
                placeholder="DL Number"
                className="h-9 px-3 rounded bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <input
                type="date"
                value={dlExpiry}
                onChange={(e) => setDlExpiry(e.target.value)}
                className="h-9 px-3 rounded bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Aadhaar Card */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                Aadhaar Card (Only Masked Number Shown)
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Masked XXXX-XXXX-{aadhaarLast4}</span>
            </div>
            <div className="text-xs text-slate-400">
              Only the last 4 digits are processed per UIDAI compliance guidelines.
            </div>
          </div>

          {/* Vehicle RC */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Vehicle Registration Certificate (RC)
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Uploaded</span>
            </div>
            <div className="text-xs text-slate-400">
              Matches plate number: <strong>{vehicleNumber}</strong>
            </div>
          </div>

          {/* Live Selfie */}
          <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                Live Doorstep Selfie Check
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Verified</span>
            </div>
            <div className="text-xs text-slate-400">
              Face match verified against Driving Licence photo record.
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Submit Application for Verification
        </Button>
      </form>
    </div>
  )
}
