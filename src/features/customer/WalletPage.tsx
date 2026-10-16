import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { formatInr, formatDateTime } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { Wallet, PlusCircle, ArrowDownLeft, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react'

export const WalletPage: React.FC = () => {
  const { walletBalance, topUpWallet } = useOrders()
  const [topUpAmount, setTopUpAmount] = useState<number>(500)

  const transactions = [
    {
      id: 'tx-1',
      title: 'Claim Settlement Approved (LM-7190)',
      amount: 2500,
      type: 'credit' as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tx-2',
      title: 'Order Payment (LM-6301)',
      amount: -106,
      type: 'debit' as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'tx-3',
      title: 'Promo Cashback Reward',
      amount: 50,
      type: 'credit' as const,
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const handleTopUp = () => {
    topUpWallet(topUpAmount)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Local Move Wallet
        </h1>
        <p className="text-xs text-slate-500">
          Fast one-tap checkouts, instant dispute refunds, and promo cashback
        </p>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                Total Available Balance
              </span>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatInr(walletBalance)}
              </span>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-emerald-400 font-bold px-3 py-1 rounded-full border border-slate-700">
            Active
          </span>
        </div>

        {/* Top-up Bar */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-300 block">
            Add Funds to Wallet (Simulated Demo):
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {[200, 500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTopUpAmount(amt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  topUpAmount === amt
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                +₹{amt}
              </button>
            ))}

            <Button
              size="sm"
              variant="primary"
              onClick={handleTopUp}
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              className="ml-auto"
            >
              Recharge ₹{topUpAmount}
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Wallet Activity & Refunds
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'credit'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{tx.title}</div>
                  <div className="text-[11px] text-slate-400">{formatDateTime(tx.timestamp)}</div>
                </div>
              </div>

              <div
                className={`font-bold text-sm ${
                  tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-800'
                }`}
              >
                {tx.type === 'credit' ? `+${formatInr(tx.amount)}` : formatInr(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Refunds for cancelled or disputed orders are automatically settled to wallet balance.</span>
      </div>
    </div>
  )
}
