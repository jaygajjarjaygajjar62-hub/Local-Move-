import React from 'react'
import { ProofMedia } from '@/types'
import { formatDateTime } from '@/utils/formatters'
import { ShieldCheck, AlertCircle } from 'lucide-react'

interface ProofComparatorProps {
  pickupProofs: ProofMedia[]
  dropProofs: ProofMedia[]
  itemName?: string
}

export const ProofComparator: React.FC<ProofComparatorProps> = ({
  pickupProofs,
  dropProofs,
  itemName = 'Item',
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
        <span className="font-semibold text-slate-900 dark:text-white">Side-by-Side Handover Inspection: {itemName}</span>
        <span className="text-slate-500 dark:text-slate-400">Compare condition before transit vs. after delivery</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Evidence Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Pickup Handover Evidence
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{pickupProofs.length} file(s)</span>
          </div>

          {pickupProofs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              No pickup photos recorded.
            </div>
          ) : (
            pickupProofs.map((p) => (
              <div key={p.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-2 pb-2">
                <div className="aspect-video bg-slate-900 relative">
                  <img src={p.url} alt="Pickup proof" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                    PICKUP • {formatDateTime(p.timestamp)}
                  </div>
                </div>
                <div className="px-3 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">Observation:</span> {p.notes || 'Verified intact'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drop Evidence Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
              Drop Handover Evidence
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{dropProofs.length} file(s)</span>
          </div>

          {dropProofs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              No drop photos recorded.
            </div>
          ) : (
            dropProofs.map((p) => (
              <div key={p.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-2 pb-2">
                <div className="aspect-video bg-slate-900 relative">
                  <img src={p.url} alt="Drop proof" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                    DROP • {formatDateTime(p.timestamp)}
                  </div>
                </div>
                <div className="px-3 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">Observation:</span> {p.notes || 'Verified at destination'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
