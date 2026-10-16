import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { DriverProfile } from '@/types'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDateTime, formatInr } from '@/utils/formatters'
import {
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CreditCard,
  Truck,
  Camera,
  CheckCircle2,
  XCircle,
  Eye,
  Radio,
  ArrowUpRight,
} from 'lucide-react'

export const AdminDriversPage: React.FC = () => {
  const { drivers, updateDriverVerification, updateDriverOnlineStatus } = useOrders()
  const { showToast } = useToast()

  const [filter, setFilter] = useState<'all' | 'online' | 'pending' | 'approved' | 'suspended'>('all')
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const onlineCount = drivers.filter((d) => d.isOnline).length
  const pendingCount = drivers.filter((d) => d.status === 'pending').length
  const approvedCount = drivers.filter((d) => d.status === 'approved').length
  const suspendedCount = drivers.filter((d) => d.status === 'suspended').length

  const filteredDrivers = useMemo(() => {
    return drivers.filter((drv) => {
      if (filter === 'online') return drv.isOnline
      if (filter === 'pending') return drv.status === 'pending'
      if (filter === 'approved') return drv.status === 'approved'
      if (filter === 'suspended') return drv.status === 'suspended'
      return true
    })
  }, [drivers, filter])

  const handleApprove = (driverId: string) => {
    updateDriverVerification(driverId, 'approved')
    setSelectedDriver(null)
    showToast({
      title: 'Partner Approved',
      message: 'Driver KYC verified and activated for dispatches.',
      type: 'success',
    })
  }

  const handleReject = () => {
    if (!selectedDriver || !rejectReason.trim()) return
    updateDriverVerification(selectedDriver.id, 'rejected', undefined, rejectReason)
    setRejectModalOpen(false)
    setSelectedDriver(null)
    setRejectReason('')
  }

  const handleSuspend = (driverId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'approved' : 'suspended'
    updateDriverVerification(driverId, newStatus)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Driver Verification & Fleet KYC
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review document compliance, verify masked Aadhaar, and manage fleet online status
          </p>
        </div>

        <Link to="/admin/online-drivers">
          <Button variant="primary" size="sm" leftIcon={<Radio className="w-3.5 h-3.5 text-emerald-300" />} rightIcon={<ArrowUpRight className="w-3 h-3" />}>
            Open Online Fleet Roster ({onlineCount})
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Fleet ({drivers.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('online')}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            filter === 'online'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online Drivers ({onlineCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Pending Review ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            filter === 'approved'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Approved ({approvedCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter('suspended')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            filter === 'suspended'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Suspended ({suspendedCount})
        </button>
      </div>

      {/* Grid of Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrivers.map((drv) => (
          <div
            key={drv.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={drv.avatar}
                    alt={drv.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                      drv.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                    title={drv.isOnline ? 'Online' : 'Offline'}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{drv.name}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    +91 {drv.phone} • ★ {drv.rating}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    drv.isOnline ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {drv.isOnline ? 'Online' : 'Offline'}
                </span>

                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    drv.status === 'approved'
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : drv.status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {drv.status}
                </span>
              </div>
            </div>

            {/* Document Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Vehicle</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{drv.vehicleModel}</div>
                <div className="font-mono text-slate-500 dark:text-slate-400">{drv.vehicleNumber}</div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Aadhaar (Masked)</span>
                <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {drv.documents.aadhaar.maskedNumber}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">UIDAI Validated</div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <Button size="sm" variant="outline" onClick={() => setSelectedDriver(drv)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                Review KYC Documents
              </Button>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={drv.isOnline ? 'outline' : 'primary'}
                  onClick={() => updateDriverOnlineStatus(drv.id, !drv.isOnline)}
                >
                  {drv.isOnline ? 'Set Offline' : 'Set Online'}
                </Button>

                <Button
                  size="sm"
                  variant={drv.status === 'suspended' ? 'outline' : 'danger'}
                  onClick={() => handleSuspend(drv.id, drv.status)}
                >
                  {drv.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Documents Modal */}
      {selectedDriver && (
        <Modal
          isOpen={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          title={`KYC Inspection: ${selectedDriver.name}`}
          description={`Vehicle: ${selectedDriver.vehicleNumber} (${selectedDriver.vehicleModel})`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-left">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
              <strong>Masked UIDAI Security Rule:</strong> Aadhaar numbers are displayed only in masked format (XXXX-XXXX-XXXX).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* DL */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Driving Licence
                </div>
                <div className="font-mono text-slate-800 dark:text-slate-200">{selectedDriver.documents.licence.number || 'GJ01 20180041289'}</div>
                <div className="text-slate-500 dark:text-slate-400">Expiry: {selectedDriver.documents.licence.expiryDate || '2034-08-15'}</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">RTO Validated</div>
              </div>

              {/* Aadhaar */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Aadhaar (UIDAI Masked)
                </div>
                <div className="font-mono text-slate-800 dark:text-slate-200">{selectedDriver.documents.aadhaar.maskedNumber}</div>
                <div className="text-slate-500 dark:text-slate-400">Identity Match: Passed</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">Compliance Clear</div>
              </div>

              {/* RC */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  Vehicle Registration (RC)
                </div>
                <div className="font-mono text-slate-800 dark:text-slate-200">{selectedDriver.vehicleNumber}</div>
                <div className="text-slate-500 dark:text-slate-400">Class: {selectedDriver.vehicleType}</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">Insurance Active</div>
              </div>

              {/* Live Selfie */}
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  Live Face Match
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-semibold">98.4% Biometric Confidence</div>
                <div className="text-slate-500 dark:text-slate-400">Doorstep Liveness: Verified</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] uppercase">Face Verified</div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                className="flex-1 text-rose-700 border-rose-300"
                onClick={() => setRejectModalOpen(true)}
              >
                Reject with Reason
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleApprove(selectedDriver.id)}
              >
                Approve & Activate Driver
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Driver Application"
          description="Specify why this document set was rejected."
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <textarea
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Expired driving licence or blurred vehicle RC..."
              className="w-full h-20 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" disabled={!rejectReason} onClick={handleReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
