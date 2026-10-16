import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { DamageClaim } from '@/types'
import { ProofComparator } from '@/components/common/ProofComparator'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatDateTime, formatInr } from '@/utils/formatters'
import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Eye } from 'lucide-react'

export const AdminClaimsPage: React.FC = () => {
  const { claims, resolveDamageClaim, getOrderById } = useOrders()
  const { showToast } = useToast()

  const [selectedClaim, setSelectedClaim] = useState<DamageClaim | null>(null)
  const [approvedAmount, setApprovedAmount] = useState<number>(2500)
  const [resolutionNote, setResolutionNote] = useState('Approved under transit protection protocol.')

  const handleResolve = (isApproved: boolean) => {
    if (!selectedClaim) return
    const amount = isApproved ? approvedAmount : 0
    const note = isApproved ? resolutionNote : 'Claim rejected after photo proof comparison: damage pre-existed pickup.'
    resolveDamageClaim(selectedClaim.id, amount, note)
    setSelectedClaim(null)
  }

  const activeOrder = selectedClaim ? getOrderById(selectedClaim.orderId) : null

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Claims & Damage Disputes
          </h1>
          <p className="text-xs text-slate-500">
            Compare pickup and drop handover proof side-by-side to determine transit liability
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {claims.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            No claims filed. All deliveries are spotless!
          </div>
        ) : (
          claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">#{claim.id}</span>
                  <span className="text-xs text-slate-500">Linked Order #{claim.orderId}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                    claim.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : claim.status === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {claim.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Claim Particulars</span>
                  <div className="font-bold text-slate-900">{claim.itemDescription}</div>
                  <p className="text-slate-600 mt-1 line-clamp-2">{claim.description}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Parties Involved</span>
                  <div className="font-semibold text-slate-800">Customer: {claim.customerName}</div>
                  <div className="text-slate-500">Partner: {claim.driverName}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{formatDateTime(claim.createdAt)}</div>
                </div>

                <div className="md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Value & Claim Amount</span>
                  <div className="text-base font-extrabold text-slate-900">
                    Claimed: {formatInr(claim.claimedAmountInr)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Declared Value: {formatInr(claim.declaredValueInr)}
                  </div>
                  {claim.approvedCompensationInr && (
                    <div className="text-xs font-bold text-emerald-700 mt-1">
                      Settled: {formatInr(claim.approvedCompensationInr)}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedClaim(claim)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Inspect Side-by-Side Proofs
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Claim Detail & Proof Comparator Modal */}
      {selectedClaim && (
        <Modal
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title={`Claim Evidence Review #${selectedClaim.id}`}
          description={`Order #${selectedClaim.orderId} • Claimed ${formatInr(selectedClaim.claimedAmountInr)}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs text-left">
            {/* Side-by-side proofs */}
            <ProofComparator
              pickupProofs={activeOrder?.proofs.pickupProofs || []}
              dropProofs={activeOrder?.proofs.dropProofs || []}
              itemName={selectedClaim.itemDescription}
            />

            {/* Claim details */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Customer Reported Grievance:</span>
              <p className="text-slate-700 leading-relaxed">{selectedClaim.description}</p>
            </div>

            {/* Resolution Form if under review */}
            {selectedClaim.status === 'under_review' && (
              <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50/50 space-y-3">
                <h4 className="font-bold text-indigo-900">Resolution Decision:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Approved Compensation Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(Number(e.target.value) || 0)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Internal Resolution Note
                    </label>
                    <input
                      type="text"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="danger" className="flex-1" onClick={() => handleResolve(false)}>
                    Reject Claim
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={() => handleResolve(true)}>
                    Approve Compensation of {formatInr(approvedAmount)}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
