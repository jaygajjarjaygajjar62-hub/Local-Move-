import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { MockMap } from '@/components/common/MockMap'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ChatModal } from '@/components/common/ChatModal'
import { MaskedCallModal } from '@/components/common/MaskedCallModal'
import { ProofViewerModal } from '@/components/common/ProofViewerModal'
import { Modal } from '@/components/ui/Modal'
import { formatDateTime, formatInr } from '@/utils/formatters'
import {
  Phone,
  MessageSquare,
  Share2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Truck,
  RotateCcw,
} from 'lucide-react'

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { getOrderById, cancelOrder } = useOrders()
  const { showToast } = useToast()

  const [chatOpen, setChatOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const [proofsModal, setProofsModal] = useState<'pickup' | 'drop' | null>(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const order = getOrderById(orderId || '')

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500">The requested order ID does not exist.</p>
        <Link to="/customer/orders">
          <Button variant="primary">Return to Orders</Button>
        </Link>
      </div>
    )
  }

  const receiverTrackingUrl = `${window.location.origin}/track/${order.trackingToken}`

  const handleCopyReceiverLink = () => {
    navigator.clipboard.writeText(receiverTrackingUrl)
    showToast({
      title: 'Link Copied',
      message: 'Receiver live tracking URL copied to clipboard.',
      type: 'success',
    })
  }

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return
    const res = cancelOrder(order.id, cancelReason)
    if (res.success) {
      setCancelModalOpen(false)
    } else {
      showToast({
        title: 'Cancellation Restricted',
        message: res.error || 'Cannot cancel at this stage',
        type: 'error',
      })
    }
  }

  const isOrderTerminal = ['completed', 'cancelled', 'failed_returned'].includes(order.status)
  const canCancel = ['created', 'searching_driver', 'driver_assigned', 'arrived_at_pickup'].includes(
    order.status,
  )

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Delivery #{order.id}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Placed on {formatDateTime(order.createdAt)} • Token: {order.trackingToken}
          </p>
        </div>

        {/* Share Link Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyReceiverLink}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
          >
            Share Receiver Link
          </Button>

          <a href="tel:+919558690109">
            <Button variant="ghost" size="sm" leftIcon={<Phone className="w-3.5 h-3.5 text-emerald-600" />}>
              Support (+91 9558690109)
            </Button>
          </a>
        </div>
      </div>

      {/* Main Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Map & Driver Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
              <span>Live Vehicle Navigation</span>
              <span className="text-emerald-700 dark:text-emerald-400">Estimated ETA: 12-15 mins</span>
            </div>
            <MockMap
              pickupCoords={order.pickupAddress.coords}
              dropCoords={order.dropAddress.coords}
              driverCoords={order.assignedDriver?.currentCoords}
              driverVehicleType={order.vehicleType}
              driverName={order.assignedDriver?.name}
              isMoving={order.status === 'in_transit'}
              height="h-72 sm:h-96"
            />
          </div>

          {/* Assigned Driver Card */}
          {order.assignedDriver ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={order.assignedDriver.avatar}
                    alt={order.assignedDriver.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {order.assignedDriver.name}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      ★ {order.assignedDriver.rating} ({order.assignedDriver.totalTrips} deliveries)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                    {order.assignedDriver.vehicleNumber}
                  </span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {order.assignedDriver.vehicleModel}
                  </div>
                </div>
              </div>

              {/* Actions: Chat & Private Call */}
              <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setChatOpen(true)}
                  leftIcon={<MessageSquare className="w-4 h-4 text-slate-700 dark:text-slate-300" />}
                >
                  Message Partner
                </Button>
                <Button
                  className="flex-1"
                  variant="primary"
                  onClick={() => setCallOpen(true)}
                  leftIcon={<Phone className="w-4 h-4" />}
                >
                  Call (Private Proxy)
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30 p-6 text-center space-y-2">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto animate-spin" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-amber-200">Broadcasting to Nearby Drivers</h3>
              <p className="text-xs text-slate-600 dark:text-amber-300 max-w-sm mx-auto">
                Finding the nearest verified {order.vehicleType.replace('_', ' ')} driver in your locality.
              </p>
            </div>
          )}

          {/* Handover Proof Evidence Buttons */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Doorstep Handover Verification & Proofs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProofsModal('pickup')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-600 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-500 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    Pickup Photos & Video
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {order.proofs.pickupProofs.length} recorded media files
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setProofsModal('drop')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-600 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-emerald-500 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
                    Drop Photos & Video
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {order.proofs.dropProofs.length} recorded media files
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: OTPs, Timeline & Fare */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sender OTP Card (Crucial Security Rule: Only visible to sender) */}
          <div className="rounded-xl border-2 border-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-800/60 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                Pickup Handover OTP
              </span>
              {order.proofs.pickupOtpVerified ? (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                  SHARE AT PICKUP
                </span>
              )}
            </div>

            <div className="text-center py-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <span className="font-mono text-3xl font-black text-emerald-900 dark:text-emerald-400 tracking-widest">
                {order.pickupOtp}
              </span>
            </div>

            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-normal">
              Give this 4-digit OTP to {order.assignedDriver?.name || 'the delivery partner'} only when they physically arrive at the pickup doorstep.
            </p>
          </div>

          {/* Receiver Tracking Link Share box */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Receiver Tracking Link
              </span>
              <button
                type="button"
                onClick={handleCopyReceiverLink}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Receiver can track live in browser without installing the app. Drop OTP will be verified before handover.
            </p>
            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
              {receiverTrackingUrl}
            </div>
          </div>

          {/* Live Order Timeline */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 dark:bg-slate-900 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Order Lifecycle Timeline
            </h3>

            <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 text-xs">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span className="capitalize">{step.status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                      {formatDateTime(step.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Fare Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs text-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>Fare Total</span>
              <span className="text-emerald-800 dark:text-emerald-400 text-sm">
                {formatInr(order.fare.totalCustomerFare)} ({order.paymentMethod.toUpperCase()})
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Item:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{order.item.description}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Vehicle:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{order.vehicleType.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Cancellation Control if eligible */}
          {canCancel && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancelModalOpen(true)}
                className="w-full text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Cancel This Delivery
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {order.assignedDriver && (
        <>
          <ChatModal
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            recipientName={order.assignedDriver.name}
            recipientRole="Delivery Partner"
            orderId={order.id}
          />
          <MaskedCallModal
            isOpen={callOpen}
            onClose={() => setCallOpen(false)}
            contactName={order.assignedDriver.name}
            contactRole="Delivery Partner"
            orderId={order.id}
          />
        </>
      )}

      {proofsModal && (
        <ProofViewerModal
          isOpen={!!proofsModal}
          onClose={() => setProofsModal(null)}
          stage={proofsModal}
          proofs={proofsModal === 'pickup' ? order.proofs.pickupProofs : order.proofs.dropProofs}
        />
      )}

      {/* Cancel Order Dialog */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Delivery Request"
        description="Are you sure you want to cancel this booking?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200">
            Cancellation before driver arrival is free. If cancelled after driver has travelled to pickup, a nominal compensation fee of ₹25 applies.
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Reason for Cancellation
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="">Select cancellation reason...</option>
              <option value="Item not ready yet">Item not ready yet</option>
              <option value="Changed drop location">Changed drop location</option>
              <option value="Booked by mistake">Booked by mistake</option>
              <option value="Driver delayed">Driver delayed</option>
              <option value="Other personal reason">Other personal reason</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              disabled={!cancelReason}
              onClick={handleConfirmCancel}
            >
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
