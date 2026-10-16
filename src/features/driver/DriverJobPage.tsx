import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { MockMap } from '@/components/common/MockMap'
import { ProofCaptureModal } from '@/components/common/ProofCaptureModal'
import { OTPInput } from '@/components/ui/OTPInput'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatInr, formatDateTime } from '@/utils/formatters'
import { ProofMedia } from '@/types'
import {
  Navigation,
  MapPin,
  CheckCircle2,
  Camera,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Banknote,
  Truck,
  Phone,
  MessageSquare,
  ArrowRight,
  WifiOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

export const DriverJobPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const {
    getOrderById,
    updateOrderStatus,
    verifyPickupOtp,
    confirmPickupSenderName,
    addPickupProof,
    approvePickupByCustomer,
    startTripInTransit,
    verifyDropOtp,
    confirmDropReceiverName,
    addDropProof,
    acknowledgeDropByReceiver,
    confirmCashCollection,
    completeDelivery,
  } = useOrders()
  const { showToast } = useToast()

  const order = getOrderById(orderId || '')

  // Step modal states
  const [proofCaptureStage, setProofCaptureStage] = useState<'pickup' | 'drop' | null>(null)
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpLockout, setOtpLockout] = useState(false)
  const [wrongOtpAttempts, setWrongOtpAttempts] = useState(0)

  // Mismatch modal state
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false)
  const [mismatchNote, setMismatchNote] = useState('')

  // Receiver unavailable modal
  const [unavailableModalOpen, setUnavailableModalOpen] = useState(false)

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job Not Found</h2>
        <Link to="/driver/dashboard">
          <Button variant="primary">Return to Console</Button>
        </Link>
      </div>
    )
  }

  // Derive workflow step number (1 to 15)
  const getWorkflowStep = (): number => {
    if (order.status === 'completed') return 15
    if (order.status === 'arrived_at_drop') {
      if (!order.proofs.dropReceiverNameConfirmed) return 10
      if (!order.proofs.dropOtpVerified) return 11
      if (order.proofs.dropProofs.length === 0) return 12
      if (!order.proofs.dropReceiverAcknowledged) return 13
      if (order.paymentMethod === 'cash' && !order.proofs.cashCollectedConfirmed) return 14
      return 15
    }
    if (order.status === 'in_transit') return 9
    if (order.status === 'picked_up') return 8
    if (order.status === 'arrived_at_pickup') {
      if (!order.proofs.pickupSenderNameConfirmed) return 4
      if (!order.proofs.pickupOtpVerified) return 5
      if (order.proofs.pickupProofs.length === 0) return 6
      if (!order.proofs.pickupCustomerApproved) return 7
      return 8
    }
    if (order.status === 'driver_assigned') return 2
    return 1
  }

  const stepNumber = getWorkflowStep()

  // Workflow Handlers
  const handleMarkPickupArrival = () => {
    updateOrderStatus(order.id, 'arrived_at_pickup', 'Delivery partner arrived at pickup doorstep')
    showToast({
      title: 'Arrived at Pickup',
      message: 'Sender notified of your doorstep arrival.',
      type: 'info',
    })
  }

  const handleConfirmSenderName = () => {
    confirmPickupSenderName(order.id)
    showToast({
      title: 'Sender Identity Verified',
      message: `Confirmed person handing over is ${order.sender.name}.`,
      type: 'success',
    })
  }

  const handleVerifyPickupOtp = () => {
    setOtpError('')
    if (otpLockout) {
      setOtpError('Screen locked due to 3 consecutive wrong attempts. Call support +91 9558690109.')
      return
    }

    const res = verifyPickupOtp(order.id, otpInput)
    if (res.success) {
      setOtpInput('')
      setWrongOtpAttempts(0)
      showToast({
        title: 'Pickup OTP Verified',
        message: 'Authorised to collect item from sender.',
        type: 'success',
      })
    } else {
      const attempts = wrongOtpAttempts + 1
      setWrongOtpAttempts(attempts)
      if (attempts >= 3) {
        setOtpLockout(true)
        setOtpError('Security lock: 3 invalid attempts. Call Customer Care at +91 9558690109.')
      } else {
        setOtpError(`${res.error || 'Invalid OTP'} (${3 - attempts} attempts remaining)`)
      }
    }
  }

  const handleProofCaptured = (proof: ProofMedia) => {
    if (proof.stage === 'pickup') {
      addPickupProof(order.id, proof)
    } else {
      addDropProof(order.id, proof)
    }
  }

  const handleApprovePickupByCustomer = () => {
    approvePickupByCustomer(order.id)
  }

  const handleStartTrip = () => {
    const res = startTripInTransit(order.id)
    if (!res.success) {
      showToast({
        title: 'Gate Incomplete',
        message: res.error,
        type: 'error',
      })
    }
  }

  const handleMarkDropArrival = () => {
    updateOrderStatus(order.id, 'arrived_at_drop', 'Delivery partner reached drop destination')
    showToast({
      title: 'Arrived at Drop',
      message: 'Receiver notified. Ready for handover inspection.',
      type: 'info',
    })
  }

  const handleConfirmReceiverName = () => {
    confirmDropReceiverName(order.id)
    showToast({
      title: 'Receiver Name Verified',
      message: `Confirmed recipient is ${order.receiver.name}.`,
      type: 'success',
    })
  }

  const handleVerifyDropOtp = () => {
    setOtpError('')
    const res = verifyDropOtp(order.id, otpInput)
    if (res.success) {
      setOtpInput('')
      showToast({
        title: 'Drop OTP Verified',
        message: 'Handover authorized by receiver.',
        type: 'success',
      })
    } else {
      setOtpError(res.error || 'Invalid drop OTP entered')
    }
  }

  const handleReceiverAcknowledge = () => {
    acknowledgeDropByReceiver(order.id)
    showToast({
      title: 'Handover Acknowledged',
      message: 'Receiver signed off on delivered condition.',
      type: 'success',
    })
  }

  const handleConfirmCashCollection = () => {
    confirmCashCollection(order.id, order.fare.totalCustomerFare)
  }

  const handleCompleteDelivery = () => {
    const res = completeDelivery(order.id)
    if (res.success) {
      showToast({
        title: 'Trip Closed',
        message: `₹${order.fare.driverShare} credited to your earnings wallet.`,
        type: 'success',
      })
    } else {
      showToast({
        title: 'Cannot Close Trip',
        message: res.error,
        type: 'error',
      })
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Active Job Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Active Delivery #{order.id}</h1>
            <span className="text-xs bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase">
              Step {stepNumber} of 15
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consignment: {order.item.description} (~{order.item.approxWeightKg}kg)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Guaranteed Earning:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
            {formatInr(order.fare.driverShare)}
          </span>
        </div>
      </div>

      {/* Map Guidance */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-2">
        <MockMap
          pickupCoords={order.pickupAddress.coords}
          dropCoords={order.dropAddress.coords}
          driverCoords={order.assignedDriver?.currentCoords}
          driverVehicleType={order.vehicleType}
          driverName="You"
          isMoving={order.status === 'in_transit'}
          height="h-56 sm:h-64"
        />
      </div>

      {/* 15-Step Workflow Action Card */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-md dark:shadow-xl space-y-5 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {stepNumber <= 8 ? 'Pickup Protocol Gates' : 'Drop Protocol Gates'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Gated Verification Required</span>
        </div>

        {/* ================= STEP 2: NAVIGATE TO PICKUP ================= */}
        {stepNumber === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Destination: Pickup Location
              </span>
              <div className="text-sm font-bold text-white">{order.pickupAddress.fullAddress}</div>
              {order.pickupAddress.landmark && (
                <div className="text-xs text-slate-400">Landmark: {order.pickupAddress.landmark}</div>
              )}
              <div className="text-xs text-slate-300 pt-1">
                Sender: <strong>{order.sender.name}</strong> ({order.sender.phone})
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleMarkPickupArrival}
              leftIcon={<Navigation className="w-4 h-4" />}
            >
              Mark 'Arrived at Pickup'
            </Button>
          </div>
        )}

        {/* ================= STEP 4: CONFIRM SENDER NAME ================= */}
        {stepNumber === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Doorstep Security Check 1: Name Verification
              </span>
              <p className="text-xs text-slate-300">
                Ask the person handing over the package for their name. Confirm it matches the booking sender.
              </p>
              <div className="p-3 bg-slate-950 rounded border border-slate-700 text-sm font-bold text-emerald-400">
                Booking Sender: {order.sender.name}
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleConfirmSenderName}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Sender Name Matches
            </Button>
          </div>
        )}

        {/* ================= STEP 5: VERIFY PICKUP OTP ================= */}
        {stepNumber === 5 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Doorstep Security Check 2: Enter Pickup OTP
              </span>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Ask sender <strong>{order.sender.name}</strong> for the 4-digit code displayed on their app screen.
              </p>

              <div className="py-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  className="w-44 h-12 text-center text-xl font-bold font-mono tracking-widest rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mx-auto"
                />
              </div>

              {otpError && (
                <p className="text-xs font-bold text-rose-400">{otpError}</p>
              )}
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleVerifyPickupOtp}
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Verify Pickup OTP Code
            </Button>
          </div>
        )}

        {/* ================= STEP 6: CAPTURE PICKUP PHOTO/VIDEO ================= */}
        {stepNumber === 6 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Doorstep Evidence 3: Mandatory Photo & Video Proof
              </span>
              <p className="text-xs text-slate-300">
                Capture 360° photos and a short inspection video of the package condition before loading into vehicle.
              </p>
              <div className="text-[11px] text-slate-400">
                Proofs Captured: <strong>{order.proofs.pickupProofs.length}</strong>
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={() => setProofCaptureStage('pickup')}
              leftIcon={<Camera className="w-4 h-4" />}
            >
              Open Camera Proof Inspection
            </Button>
          </div>
        )}

        {/* ================= STEP 7: CUSTOMER APPROVAL ================= */}
        {stepNumber === 7 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Handover Agreement: Sender Approval
              </span>
              <p className="text-xs text-slate-300">
                Photos recorded. Sender has acknowledged the condition of the parcel before travel.
              </p>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleApprovePickupByCustomer}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Sender Packaging Sign-Off
            </Button>
          </div>
        )}

        {/* ================= STEP 8: START TRIP ================= */}
        {stepNumber === 8 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Pickup Handover Complete
              </span>
              <p className="text-xs text-emerald-300">
                All pickup gates verified. You are now authorized to depart toward the drop destination.
              </p>
            </div>

            <Button
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              onClick={handleStartTrip}
              leftIcon={<Truck className="w-4 h-4" />}
            >
              Depart Pickup • Start Live Transit Trip
            </Button>
          </div>
        )}

        {/* ================= STEP 9: IN TRANSIT / NAVIGATE TO DROP ================= */}
        {stepNumber === 9 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                In Transit to Destination
              </span>
              <div className="text-sm font-bold text-white">{order.dropAddress.fullAddress}</div>
              {order.dropAddress.instructions && (
                <div className="text-xs text-slate-400">Notes: {order.dropAddress.instructions}</div>
              )}
              <div className="text-xs text-slate-300 pt-1">
                Receiver: <strong>{order.receiver.name}</strong> ({order.receiver.phone})
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleMarkDropArrival}
              leftIcon={<Navigation className="w-4 h-4" />}
            >
              Mark 'Arrived at Drop Destination'
            </Button>
          </div>
        )}

        {/* ================= STEP 10: CONFIRM RECEIVER NAME ================= */}
        {stepNumber === 10 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Drop Security Gate 1: Confirm Receiver Name
              </span>
              <p className="text-xs text-slate-300">
                Confirm recipient person matches registered receiver name to prevent wrong handovers.
              </p>
              <div className="p-3 bg-slate-950 rounded border border-slate-700 text-sm font-bold text-emerald-400">
                Registered Receiver: {order.receiver.name}
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleConfirmReceiverName}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Receiver Name Matches
            </Button>
          </div>
        )}

        {/* ================= STEP 11: VERIFY DROP OTP ================= */}
        {stepNumber === 11 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Drop Security Gate 2: Enter Drop OTP
              </span>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Collect the 4-digit Drop OTP from <strong>{order.receiver.name}</strong>.
              </p>

              <div className="py-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit Drop OTP"
                  className="w-44 h-12 text-center text-xl font-bold font-mono tracking-widest rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mx-auto"
                />
              </div>

              {otpError && <p className="text-xs font-bold text-rose-400">{otpError}</p>}
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleVerifyDropOtp}
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Verify Drop OTP Code
            </Button>
          </div>
        )}

        {/* ================= STEP 12: CAPTURE DROP PHOTO/VIDEO ================= */}
        {stepNumber === 12 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Drop Security Gate 3: Doorstep Condition Photo & Video
              </span>
              <p className="text-xs text-slate-300">
                Record final condition of package at the drop address before closing handover.
              </p>
              <div className="text-[11px] text-slate-400">
                Proofs Captured: <strong>{order.proofs.dropProofs.length}</strong>
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={() => setProofCaptureStage('drop')}
              leftIcon={<Camera className="w-4 h-4" />}
            >
              Open Camera Drop Proof Inspection
            </Button>
          </div>
        )}

        {/* ================= STEP 13: RECEIVER ACKNOWLEDGEMENT ================= */}
        {stepNumber === 13 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Receiver Sign-Off
              </span>
              <p className="text-xs text-slate-300">
                Receiver {order.receiver.name} has inspected package condition.
              </p>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleReceiverAcknowledge}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Record Receiver Acceptance
            </Button>
          </div>
        )}

        {/* ================= STEP 14: CASH COLLECTION (IF CASH) ================= */}
        {stepNumber === 14 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-800 space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Cash Collection Required
              </span>
              <p className="text-xs text-slate-300">
                Collect exact cash amount from {order.payer === 'sender' ? 'sender' : 'receiver'}:
              </p>
              <div className="text-2xl font-black text-amber-300 py-1 font-mono">
                {formatInr(order.fare.totalCustomerFare)}
              </div>
            </div>

            <Button
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={handleConfirmCashCollection}
              leftIcon={<Banknote className="w-4 h-4" />}
            >
              Confirm Cash Collection of {formatInr(order.fare.totalCustomerFare)}
            </Button>
          </div>
        )}

        {/* ================= STEP 15: COMPLETE TRIP ================= */}
        {stepNumber === 15 && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">All Protocol Gates Satisfied</h3>
              <p className="text-xs text-emerald-300">
                Your earning of <strong>{formatInr(order.fare.driverShare)}</strong> will be credited upon closure.
              </p>
            </div>

            <Button
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base"
              onClick={handleCompleteDelivery}
            >
              Complete Trip & Close Order
            </Button>
          </div>
        )}

        {/* Exceptions & Support shortcuts */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => setMismatchModalOpen(true)}
            className="hover:text-amber-400 underline"
          >
            Item Size/Weight Mismatch?
          </button>

          <a href="tel:+919558690109" className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">
            <Phone className="w-3.5 h-3.5" /> Dispatch Desk: +91 9558690109
          </a>
        </div>
      </div>

      {/* Proof Capture Modal */}
      {proofCaptureStage && (
        <ProofCaptureModal
          isOpen={!!proofCaptureStage}
          onClose={() => setProofCaptureStage(null)}
          stage={proofCaptureStage}
          onCapture={handleProofCaptured}
        />
      )}

      {/* Item Mismatch Modal */}
      <Modal
        isOpen={mismatchModalOpen}
        onClose={() => setMismatchModalOpen(false)}
        title="Report Size/Weight Mismatch"
        description="If item exceeds declared size/weight, request price adjustment requiring customer approval."
        maxWidth="sm"
      >
        <div className="space-y-3 text-xs">
          <p className="text-slate-600">
            Current declared weight: <strong>{order.item.approxWeightKg} kg</strong>. Enter estimated actual weight:
          </p>
          <input
            type="number"
            placeholder="Actual weight in kg"
            className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs"
          />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setMismatchModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setMismatchModalOpen(false)
                showToast({
                  title: 'Adjustment Requested',
                  message: 'Customer notified to approve fare adjustment.',
                  type: 'info',
                })
              }}
            >
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
