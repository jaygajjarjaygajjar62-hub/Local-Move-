import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { ProofMedia } from '@/types'
import { formatDateTime } from '@/utils/formatters'
import { CheckCircle2, ShieldCheck, Video, Camera } from 'lucide-react'

interface ProofViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  proofs: ProofMedia[]
  stage: 'pickup' | 'drop'
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({
  isOpen,
  onClose,
  title = 'Handover Proofs',
  proofs,
  stage,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${title} (${stage === 'pickup' ? 'Pickup Stage' : 'Drop Stage'})`}
      description="Cryptographically logged photo & video evidence recorded by delivery partner."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {proofs.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-300 dark:border-slate-800">
            No media proofs captured yet for this stage.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proofs.map((prf) => (
              <div
                key={prf.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs space-y-2 pb-3"
              >
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <img src={prf.url} alt="Proof visual" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                    {prf.type === 'video' ? <Video className="w-3 h-3 text-amber-400" /> : <Camera className="w-3 h-3 text-emerald-400" />}
                    {prf.type.toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-emerald-950/80 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED
                  </div>
                </div>

                <div className="px-3 space-y-1 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{prf.notes || 'Condition verified'}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Recorded: {formatDateTime(prf.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Proof metadata tamper-protected
          </span>
          <span>Helpline: +91 9558690109</span>
        </div>
      </div>
    </Modal>
  )
}
