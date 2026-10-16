import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { OTPInput } from '@/components/ui/OTPInput'
import {
  Package,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  Sparkles,
  LogOut,
  Phone,
  User,
} from 'lucide-react'

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { customer, loginCustomer, logoutCustomer, language, setLanguage } = useAuth()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('9879011223')
  const [name, setName] = useState('Kunal Shah')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let interval: any
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // Fast One-Click Demo Login
  const handleQuickDemoLogin = async () => {
    setIsLoading(true)
    setErrorMessage('')
    const res = await loginCustomer('9879011223', 'Kunal Shah')
    setIsLoading(false)
    if (res.success) {
      navigate('/customer/home')
    } else {
      setErrorMessage(res.error || 'Failed to authenticate')
    }
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep('otp')
      setResendTimer(30)
      setOtp('4821') // Prefilled demo OTP for tester convenience
    }, 500)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setOtpError(false)

    if (otp.length < 4) {
      setOtpError(true)
      setErrorMessage('Please enter the 4-digit verification code')
      return
    }

    setIsLoading(true)
    const res = await loginCustomer(phone, name || 'Kunal Shah')
    setIsLoading(false)

    if (res.success) {
      navigate('/customer/home')
    } else {
      setOtpError(true)
      setErrorMessage(res.error || 'Invalid OTP. Please try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 w-full">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-left space-y-6 transition-colors">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
            <Package className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {customer.isLoggedIn
              ? 'Customer Account Active'
              : step === 'phone'
              ? 'Customer Sign In'
              : 'Verify Mobile OTP'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {customer.isLoggedIn
              ? 'You are currently authenticated as a Local Move customer.'
              : step === 'phone'
              ? 'Sign in to book instant city deliveries, track live orders, and manage shipments.'
              : `Enter the 4-digit verification code sent to +91 ${phone.replace(/\D/g, '')}`}
          </p>
        </div>

        {/* If already logged in, show quick resume or switch user */}
        {customer.isLoggedIn ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {customer.name ? customer.name.slice(0, 1) : 'C'}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                  Logged In Customer
                </span>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {customer.name || 'Customer'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  +91 {customer.phone}
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                className="w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/customer/home')}
              >
                Go to Customer Dashboard
              </Button>

              <button
                type="button"
                onClick={() => {
                  logoutCustomer()
                  setStep('phone')
                }}
                className="w-full py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Use Different Account</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Demo One-Click Sign In Card */}
            {step === 'phone' && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Instant Demo Access</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                    1-Click
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  Skip OTP entry and log in immediately as demo customer <strong>Kunal Shah (+91 9879011223)</strong>.
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  isLoading={isLoading}
                  onClick={handleQuickDemoLogin}
                  className="w-full font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Quick Sign-In as Kunal Shah
                </Button>
              </div>
            )}

            {/* Simulated Auth notice */}
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-left">
                <strong>Local Move Authentication:</strong>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Enter any 10-digit mobile number. The default test OTP code is <strong>4821</strong>.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {errorMessage}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kunal Shah"
                />

                <Input
                  label="Mobile Number"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  leftIcon={<span className="text-xs font-bold text-slate-500 dark:text-slate-400">+91</span>}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send OTP & Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <OTPInput
                  length={4}
                  value={otp}
                  onChange={setOtp}
                  error={otpError}
                  autoFocus
                  label="Enter 4-Digit OTP"
                />

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                  >
                    ← Change Number
                  </button>

                  {resendTimer > 0 ? (
                    <span>Resend code in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResendTimer(30)
                        setOtp('4821')
                      }}
                      className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Resend OTP
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                  isLoading={isLoading}
                >
                  Verify & Enter Customer Portal
                </Button>
              </form>
            )}
          </>
        )}

        {/* Security Trust Footer */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Two-way OTP verification protects all parcel pickups & deliveries</span>
        </div>
      </div>
    </div>
  )
}
