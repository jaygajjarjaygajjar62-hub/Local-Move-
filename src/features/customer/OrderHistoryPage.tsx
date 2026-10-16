import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { InvoiceModal } from '@/components/common/InvoiceModal'
import { Modal } from '@/components/ui/Modal'
import { Order } from '@/types'
import { formatDateTime, formatInr } from '@/utils/formatters'
import {
  Search,
  Filter,
  FileText,
  Star,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

export const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate()
  const { orders, rateOrderDriver, raiseDamageClaim } = useOrders()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null)

  // Rating modal state
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null)
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')
  const [tip, setTip] = useState(50)

  // Damage claim modal state
  const [claimOrder, setClaimOrder] = useState<Order | null>(null)
  const [claimDescription, setClaimDescription] = useState('')
  const [claimedAmount, setClaimedAmount] = useState<number>(500)

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.dropAddress.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter === 'all') return true
    if (statusFilter === 'active') {
      return ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(
        ord.status,
      )
    }
    if (statusFilter === 'completed') return ord.status === 'completed'
    if (statusFilter === 'disputed') return ord.status === 'under_dispute'
    if (statusFilter === 'cancelled') return ord.status === 'cancelled'
    return true
  })

  const handleBookAgain = (ord: Order) => {
    navigate('/customer/book', {
      state: {
        pickup: ord.pickupAddress.fullAddress,
        drop: ord.dropAddress.fullAddress,
        vehicle: ord.vehicleType,
        category: ord.item.category,
      },
    })
  }

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ratingOrder) return
    rateOrderDriver(ratingOrder.id, stars, comment, tip)
    setRatingOrder(null)
    setComment('')
  }

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimOrder || !claimDescription.trim()) return
    raiseDamageClaim({
      orderId: claimOrder.id,
      customerId: claimOrder.customer.id,
      customerName: claimOrder.customer.name,
      customerPhone: claimOrder.customer.phone,
      driverName: claimOrder.assignedDriver?.name || 'Assigned Partner',
      itemDescription: claimOrder.item.description,
      declaredValueInr: claimOrder.item.declaredValueInr,
      claimedAmountInr: claimedAmount,
      pickupPhotos: claimOrder.proofs.pickupProofs.map((p) => p.url),
      dropPhotos: claimOrder.proofs.dropProofs.map((p) => p.url),
      description: claimDescription,
    })
    setClaimOrder(null)
    setClaimDescription('')
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Order History
          </h1>
          <p className="text-xs text-slate-500">
            Track past consignments, download tax invoices, and manage claims
          </p>
        </div>
        <Link to="/customer/book">
          <Button variant="primary" size="sm">
            Book New Delivery
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, item, or address..."
            className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white text-slate-800 font-semibold cursor-pointer"
          >
            <option value="all">All Orders</option>
            <option value="active">Active In-Progress</option>
            <option value="completed">Completed</option>
            <option value="disputed">Under Dispute</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order List Cards */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No orders matching your criteria</p>
          <p className="text-xs text-slate-400">Try adjusting your search query or filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">#{ord.id}</span>
                  <span className="text-xs text-slate-500">• {formatDateTime(ord.createdAt)}</span>
                </div>
                <OrderStatusBadge status={ord.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Item & Route</span>
                  <div className="font-bold text-slate-900 line-clamp-1">{ord.item.description}</div>
                  <div className="text-slate-500 line-clamp-1">To: {ord.dropAddress.fullAddress}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Partner & Mode</span>
                  <div className="font-semibold text-slate-800">
                    {ord.assignedDriver?.name || 'Matching fleet'} ({ord.vehicleType.replace('_', ' ')})
                  </div>
                  <div className="text-slate-500">
                    Payment: {ord.paymentMethod.toUpperCase()} ({ord.payer.toUpperCase()} PAYS)
                  </div>
                </div>

                <div className="space-y-1 md:text-right">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Total Fare</span>
                  <div className="text-base font-extrabold text-emerald-800">
                    {formatInr(ord.fare.totalCustomerFare)}
                  </div>
                  <div className="text-[11px] text-slate-500">{ord.fare.distanceKm} km transit</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link to={`/customer/orders/${ord.id}`}>
                    <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Tracking & Proofs
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleBookAgain(ord)}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Book Again
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {ord.status === 'completed' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                      >
                        Tax Invoice
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRatingOrder(ord)}
                        leftIcon={<Star className="w-3.5 h-3.5 text-amber-500" />}
                      >
                        Rate & Tip
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setClaimOrder(ord)}
                        className="text-rose-700 hover:bg-rose-50"
                      >
                        Report Issue
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />
      )}

      {/* Rate & Tip Modal */}
      {ratingOrder && (
        <Modal
          isOpen={!!ratingOrder}
          onClose={() => setRatingOrder(null)}
          title={`Rate Partner: ${ratingOrder.assignedDriver?.name || 'Partner'}`}
          description="Rate your delivery experience and optionally add a tip (100% credited to driver)."
          maxWidth="sm"
        >
          <form onSubmit={handleSubmitRating} className="space-y-4">
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStars(st)}
                  className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${st <= stars ? 'text-amber-500 fill-amber-500' : ''}`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Add Feedback Note
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Very careful handling and on-time arrival!"
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Add Tip for Partner
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 30, 50, 100].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={`py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                      tip === t
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {t === 0 ? 'No tip' : `₹${t}`}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Submit Review
            </Button>
          </form>
        </Modal>
      )}

      {/* Damage Claim Modal */}
      {claimOrder && (
        <Modal
          isOpen={!!claimOrder}
          onClose={() => setClaimOrder(null)}
          title={`File Claim for Order #${claimOrder.id}`}
          description="Submit a damage report. Pickup & drop video and photo proofs will be inspected by Aera operations."
          maxWidth="md"
        >
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
              <div className="font-semibold text-slate-900">Item: {claimOrder.item.description}</div>
              <div className="text-slate-600">
                Declared Transit Value: {formatInr(claimOrder.item.declaredValueInr)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Claim Description & Damage Particulars
              </label>
              <textarea
                required
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
                placeholder="Explain the damage observed upon drop handover..."
                className="w-full h-24 rounded-lg border border-slate-300 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Requested Compensation Amount (₹)
              </label>
              <input
                type="number"
                min={100}
                max={claimOrder.item.declaredValueInr}
                value={claimedAmount}
                onChange={(e) => setClaimedAmount(Number(e.target.value) || 0)}
                className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <Button type="submit" variant="danger" className="w-full">
              Submit Damage Claim
            </Button>
          </form>
        </Modal>
      )}
    </div>
  )
}
