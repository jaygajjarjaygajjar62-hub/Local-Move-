import React from 'react'
import { useOrders } from '@/context/OrderContext'
import { formatDateTime } from '@/utils/formatters'
import { FileText, CreditCard, Truck, Camera, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'

export const DriverDocumentsPage: React.FC = () => {
  const { drivers } = useOrders()
  const profile = drivers.find((d) => d.id === 'drv-1') || drivers[0]

  const docs = [
    {
      title: 'Driving Licence (DL)',
      number: profile.documents.licence.number || 'GJ01 20180041289',
      expiry: profile.documents.licence.expiryDate || '2034-08-15',
      status: profile.documents.licence.status,
      icon: <FileText className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Aadhaar Card (Masked UIDAI)',
      number: profile.documents.aadhaar.maskedNumber || 'XXXX-XXXX-4129',
      expiry: 'Lifetime Valid',
      status: profile.documents.aadhaar.status,
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Vehicle Registration Certificate (RC)',
      number: profile.documents.rc.number || profile.vehicleNumber,
      expiry: profile.documents.rc.expiryDate || '2032-04-10',
      status: profile.documents.rc.status,
      icon: <Truck className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Doorstep Verification Selfie',
      number: 'Face biometric template matched',
      expiry: 'Refreshed every 30 days',
      status: profile.documents.selfie.status,
      icon: <Camera className="w-5 h-5 text-amber-400" />,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Partner Verification Documents
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compulsory documents verified by Aera Operations
        </p>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div
            key={doc.title}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-4 shadow-2xs transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">{doc.icon}</div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doc.title}</h3>
                <div className="font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold">{doc.number}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Expiry / Validity: {doc.expiry}</div>
              </div>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
              Approved
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-2xs transition-colors">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Document expiry reminders are issued 30 days in advance via push notifications.</span>
      </div>
    </div>
  )
}
