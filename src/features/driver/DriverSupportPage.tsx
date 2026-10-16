import React, { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import {
  Phone,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Clock,
  FileText,
  ChevronRight,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react'

export const DriverSupportPage: React.FC = () => {
  const { showToast } = useToast()
  const [selectedIssueModal, setSelectedIssueModal] = useState<string | null>(null)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDetails, setTicketDetails] = useState('')
  const [ticketCreated, setTicketCreated] = useState(false)

  const issueProtocols = [
    {
      id: 'receiver_unreachable',
      title: 'Receiver Unavailable / Phone Switched Off',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      summary: '10-minute waiting protocol before initiating Return to Sender.',
      protocol: [
        'Try calling receiver twice via the masked in-app dialer.',
        'Send an in-app ping to the sender alerting them that receiver is not answering.',
        'Wait a mandatory 10 minutes at the drop point. The app tracks your waiting duration for waiting compensation (₹3/min after 10 mins).',
        'If still unreachable after 15 mins, tap "Report Absent Receiver" on your active job screen to convert the trip into Return to Pickup.',
      ],
    },
    {
      id: 'cargo_overweight',
      title: 'Cargo Exceeds Capacity or Is Prohibited',
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
      summary: 'Vehicle weight limits and prohibited chemicals/flammables.',
      protocol: [
        'Do NOT load hazardous chemicals, unsealed gas cylinders, loose fireworks, or contraband.',
        'If cargo weight exceeds your vehicle specification (e.g. over 20 kg on Bike or 500 kg on Cargo Auto), do not force-load.',
        'Take a photo of the oversized item via app, select "Cancel - Oversized Cargo".',
        'Our operations desk will reassign a Mini Truck or Tempo to the customer without any penalty to your acceptance rating.',
      ],
    },
    {
      id: 'damage_incident',
      title: 'Accidental Cargo Damage / Shifting Incident',
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      summary: 'Immediate photographic documentation and claim containment.',
      protocol: [
        'Park safely on the curb and turn on hazard flashers.',
        'Do not tamper with or discard damaged packing materials.',
        'Take clear photos of the item condition, tiedown ropes, and floor position.',
        'Inform the customer immediately and notify operations at +91 9558690109.',
        'Aera Transit Protection policy will review the pickup vs. incident photos for claims.',
      ],
    },
    {
      id: 'cash_discrepancy',
      title: 'Customer Refuses to Pay Cash Fare',
      icon: <FileText className="w-5 h-5 text-emerald-500" />,
      summary: 'Cash collection dispute handling without confrontation.',
      protocol: [
        'Show the customer the itemized fare breakdown on your driver screen.',
        'Never engage in heated arguments or physical confrontation.',
        'Offer the customer the option to pay online via the QR code or receiver tracking link.',
        'If customer still refuses, tap "Customer Refused Payment" on the app and call +91 9558690109. Local Move will cover the trip fare and recover from customer account.',
      ],
    },
  ]

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject.trim()) return

    setTicketCreated(true)
    showToast({
      title: 'Support Ticket #DRV-4019 Raised',
      message: 'Operations desk has received your ticket. Expect a call in ~5 minutes.',
      type: 'success',
    })
    setTimeout(() => {
      setTicketSubject('')
      setTicketDetails('')
      setTicketCreated(false)
    }, 2500)
  }

  const selectedProtocol = issueProtocols.find((p) => p.id === selectedIssueModal)

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Partner Support & Safety Desk
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          24×7 Aera driver dispatch support, dispute escalation, and road protocols.
        </p>
      </div>

      {/* Emergency Call Box */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-sm">
            <Phone className="w-4 h-4 text-rose-600 dark:text-rose-500" />
            <span>24×7 Driver Emergency Helpline</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Dedicated hotline for on-trip accidents, customer harassment, or critical road issues.
          </p>
          <div className="text-lg font-mono font-black text-slate-900 dark:text-white tracking-wide">
            +91 9558690109
          </div>
        </div>

        <a href="tel:+919558690109" className="shrink-0">
          <Button
            variant="danger"
            size="md"
            className="w-full sm:w-auto font-bold bg-rose-600 hover:bg-rose-500"
            leftIcon={<Phone className="w-4 h-4" />}
          >
            Call Helpline (+91 9558690109)
          </Button>
        </a>
      </div>

      {/* Protocol Guides */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Standard Operating Procedures (SOPs)
        </h2>

        <div className="space-y-2">
          {issueProtocols.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIssueModal(item.id)}
              className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 flex items-center justify-between transition-colors group shadow-2xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.summary}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Raise a Support Ticket Form */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xs transition-colors">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Raise Non-Emergency Ticket
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For payment questions, vehicle document updates, or incentive calculations.
          </p>
        </div>

        {ticketCreated ? (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ticket Submitted Successfully</h4>
            <p className="text-xs">
              Ticket ID: <strong>#DRV-4019</strong>. Driver partner executive will contact you within 4 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="space-y-3">
            <Input
              label="Subject / Topic"
              placeholder="e.g. Fuel incentive query for yesterday"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
            />
            <Textarea
              label="Description"
              placeholder="Explain the issue with relevant trip IDs or date..."
              value={ticketDetails}
              onChange={(e) => setTicketDetails(e.target.value)}
              rows={3}
              required
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Submit Ticket to Partner Desk
            </Button>
          </form>
        )}
      </div>

      {/* Partner Charter Reminder */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 shadow-2xs transition-colors">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-300 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Aera Partner Safety Commitment</span>
        </div>
        <p className="leading-relaxed">
          Local Move operates under strict zero-tolerance policies for harassment, drunk driving, and hazardous handling. Always wear your helmet/seatbelt, inspect parcel tie-downs before departing, and verify customer identities at handover.
        </p>
      </div>

      {/* Protocol Detail Modal */}
      {selectedProtocol && (
        <Modal
          isOpen={!!selectedIssueModal}
          onClose={() => setSelectedIssueModal(null)}
          title={selectedProtocol.title}
          description="Official Local Move driver action protocol."
        >
          <div className="space-y-4 text-left">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
              <strong>Crucial:</strong> Follow these sequential steps to ensure you remain fully protected under insurance and earnings guarantees.
            </div>

            <ol className="space-y-2.5 list-decimal list-inside text-xs text-slate-300 leading-relaxed">
              {selectedProtocol.protocol.map((step, idx) => (
                <li key={idx} className="p-2 rounded bg-slate-800/60 border border-slate-700/50">
                  <span className="font-semibold text-white ml-1">{step}</span>
                </li>
              ))}
            </ol>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => setSelectedIssueModal(null)}
              >
                Close Protocol
              </Button>
              <a href="tel:+919558690109">
                <Button variant="danger" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                  Call Operations Desk (+91 9558690109)
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
