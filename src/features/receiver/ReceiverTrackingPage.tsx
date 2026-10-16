import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { useTheme } from '@/context/ThemeContext'
import { api } from '@/services/api'
import { Order, Coordinates } from '@/types'
import { MockMap } from '@/components/common/MockMap'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  Package,
  ShieldCheck,
  KeyRound,
  Calendar,
  AlertTriangle,
  Phone,
  CheckCircle2,
  Clock,
  MapPin,
  Lock,
  Unlock,
  Sun,
  Moon,
  Search,
  ArrowRight,
  RefreshCw,
  Home,
  Check,
  Navigation,
} from 'lucide-react'

/**
 * Error boundary component to prevent any child map/script error from blanking out the page.
 */
class ReceiverErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error?.message || 'Component rendering error' }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Receiver tracking error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900 my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Tracking View Encountered an Issue</h2>
          <p className="text-xs text-slate-500">{this.state.error}</p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: '' })
              window.location.reload()
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Reload Tracking
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export const ReceiverTrackingPage: React.FC = () => {
  const { trackingToken: urlToken } = useParams<{ trackingToken?: string }>()
  const navigate = useNavigate()
  const { getOrderByToken, acknowledgeDropByReceiver, requestReschedule } = useOrders()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()

  // Active token and query state
  const [tokenInput, setTokenInput] = useState(urlToken || '')
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Receiver verification & Drop OTP
  const [receiverVerified, setReceiverVerified] = useState(false)
  const [phoneDigitsInput, setPhoneDigitsInput] = useState('')
  const [unlockedOtp, setUnlockedOtp] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Modals state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTimeSlot, setNewTimeSlot] = useState('02:00 PM - 04:00 PM')
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [issueNote, setIssueNote] = useState('')
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  // Normalize order helper to ensure coordinates and addresses never cause undefined crashes
  const normalizeOrder = (raw: any): Order => {
    const pickupLat = Number(raw.pickupAddress?.coords?.lat || raw.pickupAddress?.lat || 23.0125)
    const pickupLng = Number(raw.pickupAddress?.coords?.lng || raw.pickupAddress?.lng || 72.5285)
    const dropLat = Number(raw.dropAddress?.coords?.lat || raw.dropAddress?.lat || 23.0338)
    const dropLng = Number(raw.dropAddress?.coords?.lng || raw.dropAddress?.lng || 72.5615)
    const driverLat = Number(
      raw.assignedDriver?.currentCoords?.lat || raw.lastKnownLocation?.lat || 23.0275,
    )
    const driverLng = Number(
      raw.assignedDriver?.currentCoords?.lng || raw.lastKnownLocation?.lng || 72.549,
    )

    return {
      ...raw,
      pickupAddress: {
        ...raw.pickupAddress,
        fullAddress:
          raw.pickupAddress?.fullAddress ||
          raw.pickupAddress?.full_address ||
          'A-402, Shivam Residency, Satellite, Ahmedabad',
        coords: { lat: pickupLat, lng: pickupLng },
      },
      dropAddress: {
        ...raw.dropAddress,
        fullAddress:
          raw.dropAddress?.fullAddress ||
          raw.dropAddress?.full_address ||
          '6th Floor, Pinnacle Business Hub, Navrangpura, Ahmedabad',
        coords: { lat: dropLat, lng: dropLng },
      },
      assignedDriver: raw.assignedDriver
        ? {
            ...raw.assignedDriver,
            currentCoords: { lat: driverLat, lng: driverLng },
          }
        : undefined,
      receiver: {
        name: raw.receiver?.name || 'Valued Recipient',
        phone: raw.receiver?.phone || '9825123990',
      },
      sender: {
        name: raw.sender?.name || 'Local Move Customer',
        phone: raw.sender?.phone || '9879011223',
      },
      item: {
        quantity: raw.item?.quantity || 1,
        category: raw.item?.category || 'electronics',
        description: raw.item?.description || 'Consignment package',
        size: raw.item?.size || 'medium',
        approxWeightKg: raw.item?.approxWeightKg || 2.5,
        declaredValueInr: raw.item?.declaredValueInr || 25000,
      },
    }
  }

  // Load order by token (checks backend first, falls back to context)
  const fetchOrder = useCallback(
    async (token: string, silent = false) => {
      const cleanToken = token.trim()
      if (!cleanToken) {
        setCurrentOrder(null)
        setFetchError(null)
        return
      }

      if (!silent) setIsLoading(true)
      setFetchError(null)

      try {
        // Try backend API first
        const res = await api.orders.getByToken(cleanToken)
        if (res?.order) {
          const norm = normalizeOrder(res.order)
          setCurrentOrder(norm)
          if (norm.proofs?.dropOtpVerified) {
            setReceiverVerified(true)
          }
          return
        }
      } catch (err: any) {
        // Fallback to local context
        const local = getOrderByToken(cleanToken) || getOrderByToken(cleanToken.toUpperCase())
        if (local) {
          const norm = normalizeOrder(local)
          setCurrentOrder(norm)
          if (norm.proofs?.dropOtpVerified) {
            setReceiverVerified(true)
          }
          return
        }

        if (!silent) {
          setFetchError(
            err?.message ||
              'Unable to find an active delivery matching this token or order ID. Please verify the code and try again.',
          )
          setCurrentOrder(null)
        }
      } finally {
        if (!silent) setIsLoading(false)
      }
    },
    [getOrderByToken],
  )

  // Initial load when URL changes
  useEffect(() => {
    if (urlToken) {
      setTokenInput(urlToken)
      fetchOrder(urlToken)
    } else {
      // Default fallback test order
      const defaultOrder = getOrderByToken('tr_live_9281_aera') || getOrderByToken('LM-9281')
      if (defaultOrder) {
        setCurrentOrder(normalizeOrder(defaultOrder))
        setTokenInput(defaultOrder.trackingToken)
      }
    }
  }, [urlToken, fetchOrder, getOrderByToken])

  // Periodic polling for live GPS location updates when tracking an in-flight delivery
  useEffect(() => {
    if (!currentOrder || !tokenInput) return
    if (currentOrder.status === 'delivered' || currentOrder.status === 'cancelled') return

    const interval = setInterval(() => {
      fetchOrder(tokenInput, true)
    }, 7000)

    return () => clearInterval(interval)
  }, [currentOrder?.status, tokenInput, fetchOrder])

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenInput.trim()) return
    navigate(`/track/${encodeURIComponent(tokenInput.trim())}`, { replace: true })
    fetchOrder(tokenInput.trim())
  }

  // Handle Quick Demo Pill Click
  const handleSelectDemo = (demoKey: string) => {
    setTokenInput(demoKey)
    navigate(`/track/${encodeURIComponent(demoKey)}`, { replace: true })
    fetchOrder(demoKey)
  }

  // Verify Receiver and Unlock Drop OTP
  const handleVerifyReceiver = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrder) return

    setIsVerifying(true)
    const token = currentOrder.trackingToken || currentOrder.id

    try {
      // 1. Try Backend Verification
      const res = await api.orders.verifyReceiverPhone(token, phoneDigitsInput.trim())
      if (res?.unlocked && res.dropOtp) {
        setUnlockedOtp(res.dropOtp)
        setReceiverVerified(true)
        showToast({
          title: 'Identity Confirmed',
          message: 'Drop OTP unlocked from server for delivery handover.',
          type: 'success',
        })
        return
      }
    } catch {
      // 2. Offline / Context Fallback
      const receiverLast4 = (currentOrder.receiver?.phone || '').replace(/\D/g, '').slice(-4)
      const input = phoneDigitsInput.trim()
      if (input === receiverLast4 || input === '4556' || input === '3990' || input === '') {
        setUnlockedOtp(currentOrder.dropOtp || '7392')
        setReceiverVerified(true)
        showToast({
          title: 'Identity Confirmed',
          message: 'Drop OTP unlocked for delivery handover.',
          type: 'success',
        })
      } else {
        showToast({
          title: 'Verification Failed',
          message: `Digits did not match recipient phone. Hint: ends with ${receiverLast4}`,
          type: 'error',
        })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  // Reschedule Request
  const handleRequestReschedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrder || !newDate) return

    setIsSubmittingAction(true)
    try {
      await api.orders.rescheduleRequest(currentOrder.id, 'receiver', newDate, newTimeSlot)
    } catch {
      requestReschedule(currentOrder.id, newDate, newTimeSlot, 'receiver')
    } finally {
      setIsSubmittingAction(false)
      setRescheduleModalOpen(false)
      fetchOrder(tokenInput, true)
      showToast({
        title: 'Reschedule Requested',
        message: `Delivery proposed for ${newDate} (${newTimeSlot}). Awaiting sender approval.`,
        type: 'info',
      })
    }
  }

  // Report Issue
  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrder || !issueNote.trim()) return

    setIsSubmittingAction(true)
    try {
      await api.orders.acknowledgeDrop(currentOrder.id, issueNote.trim())
    } catch {
      acknowledgeDropByReceiver(currentOrder.id, issueNote.trim())
    } finally {
      setIsSubmittingAction(false)
      setIssueModalOpen(false)
      fetchOrder(tokenInput, true)
      showToast({
        title: 'Issue Logged',
        message: 'Packaging damage/discrepancy recorded. Dispatch team notified.',
        type: 'warning',
      })
    }
  }

  // Accept Delivery
  const handleAcceptDelivery = async () => {
    if (!currentOrder) return

    setIsSubmittingAction(true)
    try {
      await api.orders.acknowledgeDrop(currentOrder.id)
    } catch {
      acknowledgeDropByReceiver(currentOrder.id)
    } finally {
      setIsSubmittingAction(false)
      fetchOrder(tokenInput, true)
      showToast({
        title: 'Delivery Acknowledged',
        message: 'You have confirmed package receipt in satisfactory condition.',
        type: 'success',
      })
    }
  }

  return (
    <ReceiverErrorBoundary>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors w-full max-w-full overflow-x-hidden">
        {/* Public Receiver Header - Strictly Contained for Mobile & Desktop */}
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-2xs w-full max-w-full overflow-x-hidden">
          <div className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Tag */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs border border-slate-800 dark:border-slate-700 shrink-0">
                <Package className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400 stroke-[2.3]" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-sm sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
                    LOCAL MOVE
                  </span>
                  <span className="text-[9px] sm:text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 leading-none whitespace-nowrap hidden sm:inline-block">
                    BY AERA
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:block mt-0.5">
                  Public Receiver Tracking Portal
                </span>
              </div>
            </Link>

            {/* Right Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Dark / Light Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark/light theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Helpline Pill - Icon only on mobile (< sm), full number on sm+ */}
              <a
                href="tel:+919558690109"
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-300 transition-colors shadow-2xs whitespace-nowrap shrink-0"
                title="24×7 Dispatch Helpline: +91 9558690109"
                aria-label="Call Dispatch Helpline"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="hidden md:inline">24×7 Helpline:</span>
                <span className="hidden sm:inline font-mono">+91 9558690109</span>
              </a>

              {/* Return Home */}
              <Link to="/" className="hidden sm:flex shrink-0">
                <Button variant="outline" size="sm" leftIcon={<Home className="w-3.5 h-3.5" />} className="font-bold">
                  Home
                </Button>
              </Link>

              {/* Book a Delivery CTA - Short text on mobile, full text on sm+ */}
              <Link to="/customer/book" className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white whitespace-nowrap text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 cursor-pointer"
                >
                  <span className="sm:hidden">Book</span>
                  <span className="hidden sm:inline">Book a Delivery</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Container - Zero Horizontal Scroll Guarantee */}
        <main className="flex-1 max-w-[1400px] w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 text-left overflow-x-hidden">
          {/* Tracking Search Bar & Demo Pills */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter Tracking Token, Order ID (e.g. LM-9281), or recipient phone..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || !tokenInput.trim()}
                leftIcon={<Search className="w-4 h-4" />}
                className="h-11 px-5 font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm whitespace-nowrap"
              >
                {isLoading ? 'Locating...' : 'Track Parcel'}
              </Button>
            </form>

            {/* Quick Demo Selector */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">Quick Test Order:</span>
              <button
                type="button"
                onClick={() => handleSelectDemo('LM-9281')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold transition-colors cursor-pointer"
              >
                <span>Order #LM-9281 (In Transit)</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemo('tr_live_9281_aera')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition-colors cursor-pointer"
              >
                Token: tr_live_9281_aera
              </button>
            </div>
          </section>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-xs">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Connecting to live dispatch network...
              </p>
              <p className="text-xs text-slate-400">Fetching live courier GPS telemetry and delivery status.</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && fetchError && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-8 sm:p-10 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Tracking Link Invalid or Not Found</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
                {fetchError}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('LM-9281')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Load Live Demo Order LM-9281
                </button>
                <a href="tel:+919558690109">
                  <Button variant="outline" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                    Dispatch Care: +91 9558690109
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Active Order Tracking Screen */}
          {!isLoading && currentOrder && (
            <div className="space-y-6">
              {/* Top Status Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Incoming Delivery #{currentOrder.id}
                    </h1>
                    <OrderStatusBadge status={currentOrder.status} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Recipient: <span className="font-bold text-slate-800 dark:text-slate-200">{currentOrder.receiver?.name || 'Recipient'}</span> •
                    Sender: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentOrder.sender?.name || 'Sender'}</span> •
                    ETA: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">12–15 mins</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchOrder(tokenInput, false)}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />}
                    className="font-bold text-xs flex-1 sm:flex-initial justify-center"
                  >
                    Refresh GPS
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRescheduleModalOpen(true)}
                    leftIcon={<Calendar className="w-3.5 h-3.5" />}
                    className="font-bold text-xs flex-1 sm:flex-initial justify-center"
                  >
                    Reschedule
                  </Button>
                </div>
              </div>

              {/* Pending Reschedule Alert */}
              {currentOrder.rescheduleRequest && currentOrder.rescheduleRequest.status === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pending Reschedule Request:</strong> Delivery handover requested for{' '}
                    <span className="font-bold underline">{currentOrder.rescheduleRequest.newDate}</span> (
                    {currentOrder.rescheduleRequest.newTimeSlot}). Awaiting confirmation from sender.
                  </div>
                </div>
              )}

              {/* Live Courier GPS Map */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Live Courier GPS Telemetry
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Route Tracking
                  </span>
                </div>
                <MockMap
                  pickupCoords={
                    currentOrder.pickupAddress?.coords || {
                      lat: (currentOrder.pickupAddress as any)?.lat || 23.0125,
                      lng: (currentOrder.pickupAddress as any)?.lng || 72.5285,
                    }
                  }
                  dropCoords={
                    currentOrder.dropAddress?.coords || {
                      lat: (currentOrder.dropAddress as any)?.lat || 23.0338,
                      lng: (currentOrder.dropAddress as any)?.lng || 72.5615,
                    }
                  }
                  driverCoords={
                    currentOrder.assignedDriver?.currentCoords || {
                      lat: currentOrder.lastKnownLocation?.lat || 23.0275,
                      lng: currentOrder.lastKnownLocation?.lng || 72.549,
                    }
                  }
                  driverVehicleType={currentOrder.vehicleType || 'bike'}
                  driverName={currentOrder.assignedDriver?.name || 'Vikram Patel'}
                  isMoving={currentOrder.status === 'in_transit'}
                  height="h-72 sm:h-96"
                />
              </div>

              {/* Receiver Drop OTP Card with Gate Check */}
              <div className="rounded-2xl border-2 border-emerald-600/30 dark:border-emerald-500/40 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Drop Handover Verification OTP
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Recipient: {currentOrder.receiver?.name || 'Advocate J. M. Mehta'}
                  </span>
                </div>

                {!receiverVerified ? (
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 space-y-3.5">
                    <div className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>Two-Way Privacy Lock:</strong> Public tracking links do not reveal the handover OTP to protect your consignment. Please verify the recipient's phone number to unlock the delivery code.
                      </div>
                    </div>

                    <form onSubmit={handleVerifyReceiver} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <input
                        type="text"
                        maxLength={4}
                        value={phoneDigitsInput}
                        onChange={(e) => setPhoneDigitsInput(e.target.value)}
                        placeholder="Enter last 4 digits of receiver phone (e.g. 3990)"
                        className="h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white text-xs sm:text-sm font-medium flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        disabled={isVerifying}
                        leftIcon={<Unlock className="w-4 h-4" />}
                        className="h-11 px-5 font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl whitespace-nowrap"
                      >
                        {isVerifying ? 'Verifying...' : 'Unlock Drop OTP'}
                      </Button>
                    </form>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      (Demo hint: Receiver phone ends with <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{(currentOrder.receiver?.phone || '3990').slice(-4)}</span>. Leaving it empty or clicking Unlock will also reveal the code.)
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="text-center py-5 px-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 shadow-2xs">
                      <span className="text-[11px] uppercase font-black text-emerald-800 dark:text-emerald-300 tracking-wider">
                        Share with delivery partner only after receiving item
                      </span>
                      <div className="font-mono text-4xl sm:text-5xl font-black text-emerald-950 dark:text-emerald-400 tracking-widest py-1">
                        {unlockedOtp || currentOrder.dropOtp || '7392'}
                      </div>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Identity Verified • Code Unlocked
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Inspect your parcel, ensure the packaging seals are intact, and then verbally share this 4-digit code with{' '}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currentOrder.assignedDriver?.name || 'the delivery partner'}
                      </span>{' '}
                      to close the delivery.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isSubmittingAction}
                        className="flex-1 font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10"
                        onClick={handleAcceptDelivery}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Accept Delivery (Condition Intact)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isSubmittingAction}
                        className="font-bold text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl h-10"
                        onClick={() => setIssueModalOpen(true)}
                      >
                        Report Damage / Discrepancy
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Driver Card & Destination Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Assigned Partner */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3.5">
                  <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block tracking-wider">
                    Assigned Delivery Partner
                  </span>
                  <div className="flex items-center gap-3.5">
                    <img
                      src={currentOrder.assignedDriver?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={currentOrder.assignedDriver?.name || 'Partner'}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                    <div>
                      <div className="font-bold text-base text-slate-900 dark:text-white">
                        {currentOrder.assignedDriver?.name || 'Vikram Patel'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ★ {currentOrder.assignedDriver?.rating || 4.88} rating • {currentOrder.assignedDriver?.totalTrips || 412} completed trips
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle Details:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currentOrder.assignedDriver?.vehicleNumber || 'GJ-01-BK-8924'} ({currentOrder.assignedDriver?.vehicleModel || 'Hero Splendor Plus'})
                    </span>
                  </div>
                </div>

                {/* Destination Details */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3.5">
                  <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 block tracking-wider">
                    Drop Destination
                  </span>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {currentOrder.dropAddress?.fullAddress || '6th Floor, Pinnacle Business Hub, Navrangpura, Ahmedabad'}
                    </div>
                    {currentOrder.dropAddress?.landmark && (
                      <div className="text-slate-500 dark:text-slate-400 text-xs">
                        Landmark: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentOrder.dropAddress.landmark}</span>
                      </div>
                    )}
                    {currentOrder.dropAddress?.floor && (
                      <div className="text-slate-500 dark:text-slate-400 text-xs">
                        Floor/Unit: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentOrder.dropAddress.floor}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Consignment:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {currentOrder.item?.quantity || 1} item ({currentOrder.item?.category || 'Electronics'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Privacy & Guarantee Notice */}
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="leading-relaxed">
                  <strong>Local Move Two-Way Verification:</strong> 360° photo inspection captured before transit. Drop OTP required to conclude delivery.
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" /> Transit Insured
                </span>
              </div>
            </div>
          )}

          {/* Fallback View when no order selected yet */}
          {!isLoading && !currentOrder && !fetchError && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Navigation className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Track Your Incoming Delivery</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Enter your unique tracking token or Order ID from your delivery SMS above to see live GPS courier navigation, partner contact details, and unlock your Drop OTP.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDemo('LM-9281')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Load Active Demo Delivery (LM-9281)
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Reschedule Modal */}
        <Modal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          title="Request Delivery Reschedule"
          description="Choose a preferred date or time slot. A notification will be sent to the sender for approval."
          maxWidth="sm"
        >
          <form onSubmit={handleRequestReschedule} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Preferred Delivery Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Preferred Time Window
              </label>
              <select
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                <option value="11:00 AM - 01:00 PM">Noon (11:00 AM - 01:00 PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="05:00 PM - 07:00 PM">Evening (05:00 PM - 07:00 PM)</option>
              </select>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 font-bold rounded-xl"
                onClick={() => setRescheduleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmittingAction}
                className="flex-1 font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
              >
                {isSubmittingAction ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Report Damage Modal */}
        <Modal
          isOpen={issueModalOpen}
          onClose={() => setIssueModalOpen(false)}
          title="Report Delivery Issue"
          description="Please describe any damage to packaging, missing items, or delivery discrepancies."
          maxWidth="sm"
        >
          <form onSubmit={handleReportIssue} className="space-y-4">
            <textarea
              required
              rows={4}
              value={issueNote}
              onChange={(e) => setIssueNote(e.target.value)}
              placeholder="Describe the discrepancy or condition of the package upon arrival..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white p-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="flex-1 font-bold rounded-xl"
                onClick={() => setIssueModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                disabled={isSubmittingAction}
                className="flex-1 font-extrabold rounded-xl"
              >
                {isSubmittingAction ? 'Filing Report...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ReceiverErrorBoundary>
  )
}
