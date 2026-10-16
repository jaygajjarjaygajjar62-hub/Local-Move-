import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { formatInr, formatDateTime } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { Download, Calendar, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react'

export const AdminReportsPage: React.FC = () => {
  const { orders } = useOrders()
  const [dateRange, setDateRange] = useState('7d')

  const handleDownloadCsv = () => {
    // Generate clean CSV string
    const headers = [
      'Order ID',
      'Created At',
      'Status',
      'Sender Name',
      'Sender Phone',
      'Receiver Name',
      'Receiver Phone',
      'Vehicle',
      'Distance Km',
      'Customer Fare INR',
      'Driver Share INR',
      'Payment Method',
    ]
    const rows = orders.map((o) => [
      o.id,
      o.createdAt,
      o.status,
      `"${o.sender.name}"`,
      o.sender.phone,
      `"${o.receiver.name}"`,
      o.receiver.phone,
      o.vehicleType,
      o.fare.distanceKm,
      o.fare.totalCustomerFare,
      o.fare.driverShare,
      o.paymentMethod,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `localmove_orders_report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Operations Reports
          </h1>
          <p className="text-xs text-slate-500">
            Export audit data, performance summaries, and dispatch logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Orders CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total System Deliveries</span>
          <div className="text-3xl font-black text-slate-900">{orders.length + 1240}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">98.2% On-Time Fulfillment</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Gross Billed</span>
          <div className="text-3xl font-black text-slate-900">{formatInr(284900)}</div>
          <span className="text-[11px] text-slate-500">Ahmedabad Launch Cohort</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Dispute Ratio</span>
          <div className="text-3xl font-black text-slate-900">0.42%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Protected by Two-Way Video Proof</span>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Executive Summary Report
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          The two-way OTP and mandatory photo/video proof protocol has reduced missing consignment claims by over 80% compared to traditional peer couriers. The bike fleet accounts for 64% of total transaction count, while tempo and household moving generate 58% of platform GMV.
        </p>
      </div>
    </div>
  )
}
