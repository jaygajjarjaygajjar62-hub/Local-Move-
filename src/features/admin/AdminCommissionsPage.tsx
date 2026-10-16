import React from 'react'
import { useOrders } from '@/context/OrderContext'
import { formatInr } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { Coins, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const AdminCommissionsPage: React.FC = () => {
  const { drivers, pricingConfig } = useOrders()

  return (
    <div className="space-y-6 text-left">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Commissions, Payouts & Cash Reconciliation
        </h1>
        <p className="text-xs text-slate-500">
          Monitor driver cash-in-hand balances, pending company share, and bank payout requests
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Default Driver Share</span>
          <div className="text-2xl font-black text-slate-900">{pricingConfig.driverSharePercent}%</div>
          <span className="text-[11px] text-slate-500">Company retains {100 - pricingConfig.driverSharePercent}%</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Cash in Fleet</span>
          <div className="text-2xl font-black text-amber-700">
            {formatInr(drivers.reduce((acc, d) => acc + d.cashInHandBalance, 0))}
          </div>
          <span className="text-[11px] text-slate-500">Threshold: {formatInr(pricingConfig.maxDriverCashLimit)} / driver</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Company Share Owed</span>
          <div className="text-2xl font-black text-emerald-800">
            {formatInr(drivers.reduce((acc, d) => acc + d.companyShareOwed, 0))}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Ready for daily reconciliation</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Driver Fleet Cash Reconciliation Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Driver Name</th>
                <th className="py-2.5 px-3">Vehicle Plate</th>
                <th className="py-2.5 px-3">Cash in Hand</th>
                <th className="py-2.5 px-3">Company Share Owed</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{d.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{d.vehicleNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{formatInr(d.cashInHandBalance)}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">{formatInr(d.companyShareOwed)}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.cashInHandBalance >= 1200
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.cashInHandBalance >= 1200 ? 'Limit Alert' : 'Healthy'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Button size="sm" variant="outline">
                      Reconcile Cash
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
