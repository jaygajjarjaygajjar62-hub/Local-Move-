import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OTPInput } from '@/components/ui/OTPInput'
import { Truck, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react'

export const DriverLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { loginDriver } = useAuth()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('9825012345')
  const [otp, setOtp] = useState('1234')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter valid 10-digit mobile number')
      return
    }
    setStep('otp')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const res = await loginDriver(phone)
    setIsLoading(false)
    if (res.success) {
      navigate('/driver/dashboard')
    } else {
      setError(res.error || 'Failed to verify')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Truck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-xl font-extrabold text-white">Delivery Partner Login</h1>
          <p className="text-xs text-slate-400">
            Access your active trips, daily earnings, and proof handover console
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Driver Prototype Simulation:</strong> Logging in will connect you as partner{' '}
            <strong>Vikram Patel (GJ-01-BK-8924)</strong>. Any 4-digit code signs in.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs font-semibold text-rose-400">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Partner OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <OTPInput
              length={4}
              value={otp}
              onChange={setOtp}
              autoFocus
              label="Enter 4-Digit Partner OTP"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
              isLoading={isLoading}
            >
              Verify & Open Dashboard
            </Button>
          </form>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
          <Link to="/driver/onboarding" className="text-amber-400 hover:underline font-semibold">
            New Driver? Register Documents
          </Link>
          <Link to="/" className="hover:text-white">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
