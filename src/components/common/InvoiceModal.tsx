import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Order } from '@/types'
import { formatDateTime, formatInr } from '@/utils/formatters'
import { Printer, Download, ShieldCheck } from 'lucide-react'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Generate text/csv representation or trigger printable view
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Tax Invoice"
      description="Itemized electronic invoice for tax and company reimbursement purposes."
      maxWidth="xl"
    >
      <div className="space-y-6 printable-area bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">LOCAL MOVE</span>
              <span className="text-[10px] bg-slate-900 dark:bg-slate-700 text-white font-semibold px-1.5 py-0.5 rounded">
                BY AERA
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aera Mobility & Logistics Solutions</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ahmedabad, Gujarat • Helpline: +91 9558690109</p>
          </div>
          <div className="sm:text-right">
            <span className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 mb-1">
              PAID INVOICE
            </span>
            <p className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">INV-{order.id.replace('LM-', '')}-2026</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <span><strong>Notice:</strong> This is a synthetic demonstration invoice issued by Local Move prototype.</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">GSTIN: 24AAACA0000A1Z5</span>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Billed To (Sender)</div>
            <div className="font-bold text-slate-900 dark:text-white">{order.sender.name}</div>
            <div className="text-slate-600 dark:text-slate-300">{order.sender.phone}</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-2">{order.pickupAddress.fullAddress}</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Shipped To (Receiver)</div>
            <div className="font-bold text-slate-900 dark:text-white">{order.receiver.name}</div>
            <div className="text-slate-600 dark:text-slate-300">{order.receiver.phone}</div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-2">{order.dropAddress.fullAddress}</div>
          </div>
        </div>

        {/* Trip & Vehicle Metadata */}
        <div className="grid grid-cols-3 gap-2 text-xs p-3 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Assigned Partner</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{order.assignedDriver?.name || 'Local Move Fleet'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Vehicle / Reg No.</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{order.assignedDriver?.vehicleNumber || 'Verified Vehicle'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Total Distance</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{order.fare.distanceKm} km</span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3">Base Transport Fare ({order.vehicleType.replace('_', ' ')})</td>
                <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">{formatInr(order.fare.baseFare)}</td>
                <td className="py-2.5 px-3 text-right font-medium">{formatInr(order.fare.baseFare)}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Distance Transit Charge ({order.fare.distanceKm} km)</td>
                <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">{order.fare.distanceKm} km</td>
                <td className="py-2.5 px-3 text-right font-medium">{formatInr(order.fare.distanceCharge)}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Doorstep Handling & Safe Verification Fee</td>
                <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">Fixed</td>
                <td className="py-2.5 px-3 text-right font-medium">{formatInr(order.fare.handlingFee)}</td>
              </tr>
              {order.fare.helperCharge > 0 && (
                <tr>
                  <td className="py-2.5 px-3">Loading/Unloading Helpers ({order.fare.helperCount} staff)</td>
                  <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">₹180/helper</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatInr(order.fare.helperCharge)}</td>
                </tr>
              )}
              {order.fare.packingCharge > 0 && (
                <tr>
                  <td className="py-2.5 px-3">Protective Packing Material & Labour</td>
                  <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">Service</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatInr(order.fare.packingCharge)}</td>
                </tr>
              )}
              {order.fare.itemProtectionFee > 0 && (
                <tr>
                  <td className="py-2.5 px-3">Transit Protection Cover (Declared Value: {formatInr(order.item.declaredValueInr)})</td>
                  <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">1.5%</td>
                  <td className="py-2.5 px-3 text-right font-medium">{formatInr(order.fare.itemProtectionFee)}</td>
                </tr>
              )}
              {order.fare.discount > 0 && (
                <tr className="text-emerald-700 dark:text-emerald-400">
                  <td className="py-2.5 px-3">Promotional Discount ({order.fare.promoCodeApplied || 'PROMO'})</td>
                  <td className="py-2.5 px-3 text-right">-</td>
                  <td className="py-2.5 px-3 text-right font-medium">-{formatInr(order.fare.discount)}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
              <tr>
                <td colSpan={2} className="py-2 px-3 text-slate-600 dark:text-slate-300 font-medium">Applicable Taxes (5% GST Transport)</td>
                <td className="py-2 px-3 text-right font-medium text-slate-800 dark:text-slate-200">{formatInr(order.fare.taxesGst)}</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
                <td colSpan={2} className="py-3 px-3">Grand Total Paid</td>
                <td className="py-3 px-3 text-right text-emerald-800 dark:text-emerald-400">{formatInr(order.fare.totalCustomerFare)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 justify-end non-printable">
          <Button variant="outline" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print Invoice
          </Button>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
