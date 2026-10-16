import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { SupportTicket } from '@/types'
import { formatDateTime } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { MessageSquare, Phone, CheckCircle2, Clock, Eye } from 'lucide-react'

export const AdminSupportPage: React.FC = () => {
  const { tickets, addTicketMessage, getOrderById } = useOrders()
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '')
  const [agentReply, setAgentReply] = useState('')

  const activeTicket = tickets.find((t) => t.id === selectedTicketId)
  const linkedOrder = activeTicket?.orderId ? getOrderById(activeTicket.orderId) : null

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicketId || !agentReply.trim()) return
    addTicketMessage(selectedTicketId, agentReply.trim(), 'agent', 'Operations Desk (Agent)')
    setAgentReply('')
  }

  return (
    <div className="space-y-6 text-left">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Support Desk Operations
        </h1>
        <p className="text-xs text-slate-500">
          Handle incoming grievances, dispatch inquiries, and phone escalation logs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Open Tickets ({tickets.length})
          </h3>

          <div className="space-y-2">
            {tickets.map((t) => {
              const isSelected = t.id === selectedTicketId
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-white ring-2 ring-indigo-600/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">#{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900">{t.subject}</div>
                  <div className="text-slate-500 flex justify-between text-[11px]">
                    <span>From: {t.userName}</span>
                    <span>{formatDateTime(t.updatedAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Conversation Thread (Right 7 Cols) */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{activeTicket.subject}</h3>
                  <p className="text-xs text-slate-500">
                    User: {activeTicket.userName} ({activeTicket.userPhone})
                  </p>
                </div>
                {linkedOrder && (
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                    Linked Order #{linkedOrder.id}
                  </span>
                )}
              </div>

              {/* Message Feed */}
              <div className="h-72 overflow-y-auto space-y-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                {activeTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'agent' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        m.sender === 'agent'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-900 border border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] opacity-75 font-bold mb-1">{m.senderName}</div>
                      <div>{m.text}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {formatDateTime(m.timestamp)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  value={agentReply}
                  onChange={(e) => setAgentReply(e.target.value)}
                  placeholder="Type an official response..."
                  className="flex-1 h-11 px-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <Button type="submit" variant="primary">
                  Send Response
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
              Select a ticket to view conversation thread.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
