import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Send, User, CheckCheck } from 'lucide-react'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  recipientRole: string
  orderId: string
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientRole,
  orderId,
}) => {
  const [messages, setMessages] = useState<
    { id: string; sender: 'me' | 'them'; text: string; time: string }[]
  >([
    {
      id: '1',
      sender: 'them',
      text: `Hello! I am assigned to your delivery (#${orderId}). On my way now.`,
      time: 'Just now',
    },
  ])
  const [input, setInput] = useState('')

  const quickReplies = [
    'I am outside the gate',
    'Please ring the doorbell',
    'Handing item to building security',
    'Arriving in 2 minutes',
  ]

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const newMsg = {
      id: String(Date.now()),
      sender: 'me' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    if (!textToSend) setInput('')

    // Simulated quick response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'them',
          text: 'Understood, got it!',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1200)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chat with ${recipientName}`}
      description={`${recipientRole} • Active Order #${orderId}`}
      maxWidth="md"
    >
      <div className="flex flex-col h-[380px] -mx-2">
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.sender === 'me'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                {m.time} {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              </span>
            </div>
          ))}
        </div>

        {/* Quick chip responses */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              type="button"
              onClick={() => handleSend(qr)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 h-10 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Button size="sm" onClick={() => handleSend()} leftIcon={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </div>
      </div>
    </Modal>
  )
}
