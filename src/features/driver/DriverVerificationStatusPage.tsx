import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Clock, ShieldCheck, FileText, ArrowRight } from 'lucide-react'

export const DriverVerificationStatusPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto space-y-6 text-center py-8">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-white">Application Approved</h1>
        <p className="text-xs text-slate-400">
          Your partner profile has been verified and approved by Aera Operations.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2.5 text-xs text-left">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-semibold text-slate-300">Document Checks:</span>
          <span className="text-emerald-400 font-bold uppercase text-[10px]">4 of 4 Verified</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span>Driving Licence (DL)</span>
          <span className="text-emerald-400">Passed</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Aadhaar Card (UIDAI Masked)</span>
          <span className="text-emerald-400">Passed</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Vehicle Registration Certificate (RC)</span>
          <span className="text-emerald-400">Passed</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Live Doorstep Selfie Match</span>
          <span className="text-emerald-400">Passed</span>
        </div>
      </div>

      <div className="pt-2">
        <Link to="/driver/dashboard">
          <Button variant="primary" className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Go to Partner Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
