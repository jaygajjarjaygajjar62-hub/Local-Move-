import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { OrderStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProofViewerModal } from '@/components/common/ProofViewerModal'
import { Order, OrderStatus } from '@/types'
import { formatDateTime, formatInr } from '@/utils/formatters'
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  XCircle,
  FileText,
  MapPin,
  Clock,
  ShieldCheck,
  Camera,
} from 'lucide-react'

export const AdminOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { orders, drivers, assignDriverToOrder, cancelOrder, updateOrderStatus } = useOrders()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const initialSelectId = searchParams.get('select')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialSelectId) {
      return orders.find((o) => o.id === initialSelectId) || null
    }
    return null
  })

  // Reassignment modal
  const [reassignModalOpen, setReassignModalOpen] = useState(false)
  const [targetDriverId, setTargetDriverId] = useState('')

  // Proofs modal
  const [proofsStage, setProofsStage] = useState<'pickup' | 'drop' | null>(null)

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.sender.name.toLowerCase().includes(search.toLowerCase()) ||
      o.receiver.name.toLowerCase().includes(search.toLowerCase()) ||
      o.item.description.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false
    if (statusFilter === 'all') return true
    return o.status === statusFilter
  })

  const handleReassign = () => {
    if (!selectedOrder || !targetDriverId) return
    assignDriverToOrder(selectedOrder.id, targetDriverId)
    setReassignModalOpen(false)
    showToast({
      title: 'Order Reassigned',
      message: `Order #${selectedOrder.id} successfully reassigned.`,
      type: 'success',
    })
  }

  const handleAdminCancel = () => {
    if (!selectedOrder) return
    cancelOrder(selectedOrder.id, 'Cancelled by Admin Operations')
    setSelectedOrder(null)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Order Dispatch & Tracking
          </h1>
          <p className="text-xs text-slate-500">
            Monitor, reassign, inspect evidence, or resolve exception dispatches
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by ID, party, or keyword..."
            className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-11 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white font-semibold cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="created">Created</option>
          <option value="searching_driver">Searching Driver</option>
          <option value="driver_assigned">Driver Assigned</option>
          <option value="arrived_at_pickup">Arrived at Pickup</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="under_dispute">Under Dispute</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Sender</th>
                <th className="py-3 px-3">Receiver</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3 text-right">Fare Total</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">#{ord.id}</td>
                  <td className="py-3 px-3">
                    <OrderStatusBadge status={ord.status} />
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{ord.sender.name}</div>
                    <div className="text-slate-400 text-[11px]">{ord.sender.phone}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{ord.receiver.name}</div>
                    <div className="text-slate-400 text-[11px]">{ord.receiver.phone}</div>
                  </td>
                  <td className="py-3 px-3 capitalize text-slate-700 font-medium">
                    {ord.vehicleType.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {ord.assignedDriver?.name || (
                      <span className="text-amber-600 font-semibold">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-800">
                    {formatInr(ord.fare.totalCustomerFare)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(ord)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Inspection #${selectedOrder.id}`}
          description={`Created ${formatDateTime(selectedOrder.createdAt)} • Token: ${selectedOrder.trackingToken}`}
          maxWidth="xl"
        >
          <div className="space-y-5 text-left text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-semibold text-slate-700">Current Lifecycle Status:</span>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pickup Sender</span>
                <div className="font-bold text-slate-900">{selectedOrder.sender.name}</div>
                <div className="text-slate-600">{selectedOrder.sender.phone}</div>
                <div className="text-slate-500 pt-1">{selectedOrder.pickupAddress.fullAddress}</div>
                <div className="font-mono text-emerald-800 pt-1">Pickup OTP: {selectedOrder.pickupOtp}</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Drop Receiver</span>
                <div className="font-bold text-slate-900">{selectedOrder.receiver.name}</div>
                <div className="text-slate-600">{selectedOrder.receiver.phone}</div>
                <div className="text-slate-500 pt-1">{selectedOrder.dropAddress.fullAddress}</div>
                <div className="font-mono text-emerald-800 pt-1">Drop OTP: {selectedOrder.dropOtp}</div>
              </div>
            </div>

            {/* Proof Buttons */}
            <div className="p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Recorded Media Proofs:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProofsStage('pickup')}
                  leftIcon={<Camera className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Pickup Proofs ({selectedOrder.proofs.pickupProofs.length})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProofsStage('drop')}
                  leftIcon={<Camera className="w-3.5 h-3.5 text-sky-600" />}
                >
                  Drop Proofs ({selectedOrder.proofs.dropProofs.length})
                </Button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReassignModalOpen(true)}
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Reassign Partner
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleAdminCancel}
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
              >
                Force Cancel Order
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reassign Partner Modal */}
      {reassignModalOpen && (
        <Modal
          isOpen={reassignModalOpen}
          onClose={() => setReassignModalOpen(false)}
          title="Reassign Delivery Partner"
          description="Select an available online driver to take over this job."
          maxWidth="sm"
        >
          <div className="space-y-4">
            <select
              value={targetDriverId}
              onChange={(e) => setTargetDriverId(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Select driver...</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.vehicleNumber} - {d.vehicleModel})
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setReassignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" disabled={!targetDriverId} onClick={handleReassign}>
                Confirm Reassign
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Proofs Viewer */}
      {proofsStage && selectedOrder && (
        <ProofViewerModal
          isOpen={!!proofsStage}
          onClose={() => setProofsStage(null)}
          stage={proofsStage}
          proofs={proofsStage === 'pickup' ? selectedOrder.proofs.pickupProofs : selectedOrder.proofs.dropProofs}
        />
      )}
    </div>
  )
}
