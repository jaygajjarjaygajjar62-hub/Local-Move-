import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Phone, ShieldCheck, PhoneCall, PhoneOff } from 'lucide-react'

interface MaskedCallModalProps {
  isOpen: boolean
  onClose: () => void
  contactName: string
  contactRole: string
  orderId: string
}

export const MaskedCallModal: React.FC<MaskedCallModalProps> = ({
  isOpen,
  onClose,
  contactName,
  contactRole,
  orderId,
}) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle')

  const handleStartCall = () => {
    setCallStatus('calling')
    setTimeout(() => {
      setCallStatus('connected')
    }, 2000)
  }

  const handleEndCall = () => {
    setCallStatus('idle')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Masked Calling"
      description="Private simulated call connecting via Aera virtual proxy server."
      maxWidth="sm"
    >
      <div className="space-y-5 text-center py-2">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2 text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Number Privacy Protected:</strong> Your real personal mobile number is never disclosed to the other party.
          </div>
        </div>

        <div className="space-y-1">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center text-slate-800 dark:text-slate-100">
            <Phone className="w-7 h-7 text-slate-700 dark:text-slate-200" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white pt-2">{contactName}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{contactRole} • Order #{orderId}</p>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300">
          Proxy Dial: <span className="font-bold text-slate-900 dark:text-white">079-6901-XXXX</span> (Virtual Line)
        </div>

        {callStatus === 'idle' && (
          <div className="space-y-2">
            <Button
              className="w-full"
              variant="primary"
              onClick={handleStartCall}
              leftIcon={<PhoneCall className="w-4 h-4" />}
            >
              Start Simulated Private Call
            </Button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              For immediate dispatch assistance, call Aera Customer Care directly at{' '}
              <a href="tel:+919558690109" className="text-emerald-700 dark:text-emerald-400 font-semibold underline">
                +91 9558690109
              </a>
            </p>
          </div>
        )}

        {callStatus === 'calling' && (
          <div className="space-y-3 py-2">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 animate-pulse">
              Routing through virtual proxy line...
            </div>
            <Button variant="danger" size="sm" onClick={handleEndCall} leftIcon={<PhoneOff className="w-4 h-4" />}>
              Cancel Call
            </Button>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="space-y-3 py-2">
            <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Call Connected (Demo audio channel simulation: 00:14)
            </div>
            <Button variant="danger" size="sm" onClick={handleEndCall} leftIcon={<PhoneOff className="w-4 h-4" />}>
              End Call
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
