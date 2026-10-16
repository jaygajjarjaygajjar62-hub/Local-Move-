import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { formatInr } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { Wallet, QrCode, ArrowDownRight, ArrowUpRight, AlertTriangle, ShieldCheck } from 'lucide-react'

export const DriverWalletPage: React.FC = () => {
  const { drivers } = useOrders()
  const { showToast } = useToast()
  const profile = drivers.find((d) => d.id === 'drv-1') || drivers[0]

  const [depositAmount, setDepositAmount] = useState(profile.companyShareOwed || 140)

  const handleDepositCompanyShare = () => {
    showToast({
      title: 'Company Share Deposited',
      message: `Simulated UPI deposit of ₹${depositAmount} processed successfully.`,
      type: 'success',
    })
  }

  const handleRequestPayout = () => {
    showToast({
      title: 'Payout Initiated',
      message: '₹840 requested for direct IMPS transfer to your HDFC bank account.',
      type: 'success',
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Partner Wallet & Settlement
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Daily bank payouts, cash-in-hand balance, and company share reconciliation
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Earnings Wallet */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Withdrawable Online Balance
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatInr(profile.todayEarnings)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bank: HDFC Bank (A/C: ••••4129) • IFSC: HDFC0000060
          </p>
          <Button
            size="sm"
            variant="primary"
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold"
            onClick={handleRequestPayout}
          >
            Request Instant Bank Payout
          </Button>
        </div>

        {/* Cash in Hand */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-2xs transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Cash in Hand (Physical Currency)
          </span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {formatInr(profile.cashInHandBalance)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Company 20% share owed: <strong className="text-slate-900 dark:text-white">{formatInr(profile.companyShareOwed)}</strong>
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleDepositCompanyShare}
          >
            Deposit Company Share via UPI
          </Button>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2 shadow-2xs transition-colors">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Cash Settlement Policy
        </h4>
        <p className="leading-relaxed">
          When you collect cash from customers, your cash-in-hand accumulates. You must deposit the 20% company share before your balance reaches ₹1,500. This maintains full access to cash job dispatches.
        </p>
      </div>
    </div>
  )
}
