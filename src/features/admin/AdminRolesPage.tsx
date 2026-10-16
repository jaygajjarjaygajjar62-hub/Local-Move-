import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { AdminSubRole } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Shield,
  Clock,
  Lock,
  CheckCircle2,
} from 'lucide-react'

interface AuditLogEntry {
  id: string
  action: string
  operator: string
  role: AdminSubRole
  target: string
  details: string
  timestamp: string
  ip: string
}

export const AdminRolesPage: React.FC = () => {
  const { adminSubRole, setAdminSubRole } = useAuth()
  const { showToast } = useToast()

  const [roleFilter, setRoleFilter] = useState<'all' | AdminSubRole>('all')

  const roles = [
    {
      id: 'super_admin' as AdminSubRole,
      title: 'Super Administrator',
      description: 'Unrestricted master access across all city hubs, fare algorithms, financial payouts, and staff permissions.',
      permissions: [
        'Full CRUD on pricing formulas and surge parameters',
        'Direct IMPS bank payout batch release',
        'Staff permission assignment and credential reset',
        'Audit log inspection and tamper verification',
      ],
      userCount: 2,
    },
    {
      id: 'operations' as AdminSubRole,
      title: 'Operations & Dispatch Desk',
      description: 'Real-time city transit monitoring, emergency rerouting, and driver KYC onboarding reviews.',
      permissions: [
        'Live driver GPS tracking and order manual re-dispatch',
        'Aadhaar / Driving License verification approval',
        'Helper staff background check clearance',
        'Trip cancellation and dispute hold trigger',
      ],
      userCount: 6,
    },
    {
      id: 'support' as AdminSubRole,
      title: 'Support & Claims Investigator',
      description: 'Customer dispute escalation, side-by-side damage photo adjudication, and refund credits.',
      permissions: [
        'Side-by-side proof inspection and claim approval',
        'Customer wallet refund credits (up to ₹5,000)',
        'Support ticket messaging and masked outbound calls',
        'Driver conduct flag and safety warning issue',
      ],
      userCount: 12,
    },
    {
      id: 'finance' as AdminSubRole,
      title: 'Finance & Accounts Controller',
      description: 'Daily cash collections audit, 20% platform commission reconciliation, and GST tax filings.',
      permissions: [
        'Daily driver cash-in-hand reconciliation',
        'GST tax ledger and HSN export',
        'Commission tier tuning and incentive disbursals',
        'Bank statement matching and IMPS status checks',
      ],
      userCount: 4,
    },
  ]

  const auditLogs: AuditLogEntry[] = [
    {
      id: 'aud-108',
      action: 'PRICE_OVERRIDE',
      operator: 'Paras Mecwan',
      role: 'super_admin',
      target: 'PRICING_CONFIG_AHMEDABAD',
      details: 'Adjusted night surge multiplier from 1.15 to 1.25x due to monsoon rain.',
      timestamp: 'Today, 2:15 PM',
      ip: '103.24.188.12',
    },
    {
      id: 'aud-107',
      action: 'CLAIM_APPROVED',
      operator: 'Sneha Patel',
      role: 'support',
      target: 'CLAIM #CLM-902 (Order #LM-8820)',
      details: 'Approved ₹1,800 damage reimbursement after verifying drop photo scratch.',
      timestamp: 'Today, 1:40 PM',
      ip: '103.24.188.45',
    },
    {
      id: 'aud-106',
      action: 'DRIVER_VERIFIED',
      operator: 'Rahul Varma',
      role: 'operations',
      target: 'DRIVER #drv-3 (Vikram Desai)',
      details: 'Approved commercial RC and verified DigiLocker Aadhaar QR code.',
      timestamp: 'Today, 11:20 AM',
      ip: '103.24.188.19',
    },
    {
      id: 'aud-105',
      action: 'PAYOUT_BATCH_DISBURSED',
      operator: 'Mehul Shah',
      role: 'finance',
      target: 'BATCH #PAY-20261013-01',
      details: 'Released 24 driver daily payouts totaling ₹48,620 via HDFC Bank API.',
      timestamp: 'Today, 10:00 AM',
      ip: '103.24.188.08',
    },
    {
      id: 'aud-104',
      action: 'DISPATCH_REROUTE',
      operator: 'Rahul Varma',
      role: 'operations',
      target: 'ORDER #LM-8822',
      details: 'Manually assigned Suresh Rathod following driver tyre puncture delay.',
      timestamp: 'Yesterday, 8:45 PM',
      ip: '103.24.188.19',
    },
  ]

  const handleSimulateRoleSwitch = (newRole: AdminSubRole) => {
    setAdminSubRole(newRole)
    showToast({
      title: 'Active Scope Switched',
      message: `Now viewing admin portal as ${newRole.replace('_', ' ').toUpperCase()}.`,
      type: 'info',
    })
  }

  const filteredLogs = auditLogs.filter((log) => {
    if (roleFilter === 'all') return true
    return log.role === roleFilter
  })

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrative Roles & Security Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Role-based access boundaries (RBAC) and immutable system event log for compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs text-indigo-900">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>
            Current Scope: <strong className="uppercase">{adminSubRole.replace('_', ' ')}</strong>
          </span>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => {
          const isCurrent = adminSubRole === r.id
          return (
            <div
              key={r.id}
              className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                  </div>
                  <Badge variant={isCurrent ? 'info' : 'default'}>
                    {r.userCount} operators
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Scoped Permissions:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {r.permissions.map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isCurrent ? 'Active View' : 'Available for simulation'}
                </span>
                <Button
                  variant={isCurrent ? 'outline' : 'primary'}
                  size="sm"
                  disabled={isCurrent}
                  onClick={() => handleSimulateRoleSwitch(r.id)}
                >
                  {isCurrent ? 'Current Role' : `Switch to ${r.title.split(' ')[0]}`}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Immutable Audit Log Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" /> System Action Audit Trail
            </h2>
            <p className="text-xs text-slate-500">
              Immutable ledger of sensitive overrides, financial transfers, and driver approvals.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <span className="text-slate-400 px-1">Filter:</span>
            {(['all', 'super_admin', 'operations', 'support', 'finance'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setRoleFilter(f)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                  roleFilter === f ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Event / Action</th>
                <th className="px-4 py-3">Operator</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Target Entity</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Timestamp / IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{log.operator}</td>
                  <td className="px-4 py-3">
                    <Badge variant="default">
                      {log.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{log.target}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs">{log.details}</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    <div>{log.timestamp}</div>
                    <div className="font-mono text-[10px] text-slate-400">{log.ip}</div>
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
