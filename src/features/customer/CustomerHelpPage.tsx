import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { useAuth } from '@/context/AuthContext'
import { PROHIBITED_ITEMS } from '@/constants/vehicles'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { formatDateTime } from '@/utils/formatters'
import {
  Phone,
  HelpCircle,
  ShieldAlert,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export const CustomerHelpPage: React.FC = () => {
  const { tickets, createSupportTicket, addTicketMessage } = useOrders()
  const { customer } = useAuth()

  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<any>('delivery_delay')
  const [message, setMessage] = useState('')
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const activeTicket = tickets.find((t) => t.id === activeTicketId)

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    createSupportTicket(
      {
        userId: customer.id || 'cust-demo',
        userRole: 'customer',
        userName: customer.name || 'Customer',
        userPhone: customer.phone || '9879011223',
        subject: subject.trim(),
        category,
        status: 'open',
        priority: 'medium',
      },
      message.trim(),
    )

    setTicketModalOpen(false)
    setSubject('')
    setMessage('')
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTicketId || !replyText.trim()) return
    addTicketMessage(activeTicketId, replyText.trim(), 'user', customer.name || 'Customer')
    setReplyText('')
  }

  const faqs = [
    {
      q: 'What should I do if a delivery partner enters the wrong OTP?',
      a: 'The partner app locks after repeated wrong OTP entries for security. If this happens, verify the 4-digit code displayed on your tracking screen and call Customer Care at +91 9558690109.',
    },
    {
      q: 'How does item protection compensation work?',
      a: 'If you purchased item protection during booking and notice transit damage upon delivery, file a claim through your order history. Our operations team inspects the mandatory pickup vs. drop condition photos and credits compensation directly to your Local Move wallet.',
    },
    {
      q: 'Can the receiver reschedule the delivery time?',
      a: 'Yes. The receiver can request a new time slot using their tracking link. However, to prevent delivery hijacking, the customer (sender) must approve the reschedule request before the order schedule changes.',
    },
    {
      q: 'What is the cash-in-hand limit for cash payments?',
      a: 'Drivers operate with a provisional limit of ₹1,500 cash in hand before they must deposit the company share. If paying in cash, the partner must confirm exact cash collection in their app to close the trip.',
    },
  ]

  return (
    <div className="space-y-8 text-left">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Help & Support Center
        </h1>
        <p className="text-xs text-slate-500">
          24×7 Operations Helpline, Prohibited Items Compliance, and Ticket Resolution
        </p>
      </div>

      {/* Customer Helpline Card */}
      <div className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 shadow-md border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">24×7 Dedicated Helpline: +91 9558690109</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Local Move operates round-the-clock. If you need live route coordination, driver assistance, or have an emergency, speak with our operations desk immediately.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="tel:+919558690109">
            <Button variant="primary" leftIcon={<Phone className="w-4 h-4" />}>
              Call +91 9558690109
            </Button>
          </a>
          <Button
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700"
            onClick={() => setTicketModalOpen(true)}
            leftIcon={<MessageSquare className="w-4 h-4" />}
          >
            Open Ticket
          </Button>
        </div>
      </div>

      {/* Prohibited Items Section */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Strictly Prohibited Items (Statutory Compliance)</span>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          To comply with national safety regulations and Indian transport laws, the following items cannot be accepted for transit under any circumstance:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900 pt-1">
          {PROHIBITED_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded border border-rose-100">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Support Tickets Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              My Support Tickets
            </h3>
            <p className="text-xs text-slate-500">Live conversation threads with Aera support desk</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setTicketModalOpen(true)}>
            + New Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
            No active tickets. Everything is running smoothly!
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((tck) => (
              <div
                key={tck.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors space-y-2 bg-slate-50/50"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">#{tck.id}</span>
                    <span className="font-semibold text-slate-800">{tck.subject}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      tck.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tck.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Last message: {tck.messages[tck.messages.length - 1]?.text}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-400">{formatDateTime(tck.updatedAt)}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTicketId(activeTicketId === tck.id ? null : tck.id)}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    {activeTicketId === tck.id ? 'Close Thread' : 'View Conversation'}
                  </button>
                </div>

                {/* Conversation Drawer inside card */}
                {activeTicketId === tck.id && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-white rounded border border-slate-200">
                      {tck.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`text-xs p-2 rounded ${
                            m.sender === 'user' ? 'bg-slate-100 text-slate-800 ml-4' : 'bg-emerald-50 text-emerald-900 mr-4'
                          }`}
                        >
                          <div className="font-bold text-[10px] text-slate-500 mb-0.5">
                            {m.senderName} ({formatDateTime(m.timestamp)})
                          </div>
                          <div>{m.text}</div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendReply} className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Reply to support agent..."
                        className="flex-1 h-9 px-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <Button size="sm" type="submit">
                        Reply
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          Frequently Answered Inquiries
        </h3>
        <div className="space-y-2 pt-1 text-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-3 flex items-center justify-between font-semibold text-slate-900 bg-slate-50/70 hover:bg-slate-100 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openFaq === idx && <div className="p-3 text-slate-600 leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Open Support Ticket"
        description="Our 24×7 customer care agents respond within 5-10 minutes."
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Question about order delivery route"
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="delivery_delay">Delivery Delay</option>
              <option value="damage_claim">Damage Claim</option>
              <option value="wrong_charge">Fare Inquiry</option>
              <option value="driver_issue">Partner Feedback</option>
              <option value="other">General Question</option>
            </select>
          </div>

          <Textarea
            label="Describe Your Issue"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide context or order reference..."
          />

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setTicketModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
