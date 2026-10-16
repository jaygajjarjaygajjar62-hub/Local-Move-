import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Phone, Mail, Globe, LogOut, ShieldCheck } from 'lucide-react'

export const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { customer, language, setLanguage, logoutCustomer } = useAuth()
  const { showToast } = useToast()

  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone] = useState(customer.phone)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({
      title: 'Profile Updated',
      message: 'Your personal preferences have been saved.',
      type: 'success',
    })
  }

  const handleLogout = () => {
    logoutCustomer()
    showToast({
      title: 'Logged Out',
      message: 'You have been signed out of your customer session.',
      type: 'info',
    })
    navigate('/')
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 text-left">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your contact credentials and interface language
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-emerald-400 font-extrabold text-lg flex items-center justify-center">
            {name ? name.slice(0, 1) : 'U'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{name}</h2>
            <p className="text-xs text-slate-500">+91 {phone}</p>
          </div>
        </div>

        <Input
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="w-4 h-4 text-slate-400" />}
        />

        <Input
          label="Registered Mobile Number"
          disabled
          value={`+91 ${phone}`}
          helperText="Tied to OTP verification for handover safety"
          leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
        />

        <Input
          label="Email Address for Invoices"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Preferred Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>
        </div>
      </form>

      {/* Logout Action */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Active Session ID: SEC-AERA-{customer.id || 'DEMO'}</span>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}
