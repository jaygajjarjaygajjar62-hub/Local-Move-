import React, { createContext, useContext, useState, useEffect } from 'react'
import { AdminSubRole, Language, UserRole } from '@/types'
import { api } from '@/services/api'

export interface CustomerUser {
  id: string
  name: string
  phone: string
  email: string
  isLoggedIn: boolean
}

export interface DriverUser {
  id: string
  name: string
  phone: string
  vehicleType: string
  vehicleNumber: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  isLoggedIn: boolean
}

interface AuthContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
  adminSubRole: AdminSubRole
  setAdminSubRole: (subRole: AdminSubRole) => void
  language: Language
  setLanguage: (lang: Language) => void
  customer: CustomerUser
  driver: DriverUser
  loginCustomer: (phone: string, name?: string) => Promise<{ success: boolean; error?: string }>
  logoutCustomer: () => void
  loginDriver: (phone: string) => Promise<{ success: boolean; error?: string }>
  logoutDriver: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const DEFAULT_CUSTOMER: CustomerUser = {
  id: '',
  name: '',
  phone: '',
  email: '',
  isLoggedIn: false,
}

const DEFAULT_DRIVER: DriverUser = {
  id: 'drv-1',
  name: 'Vikram Patel',
  phone: '9825012345',
  vehicleType: 'bike',
  vehicleNumber: 'GJ-01-BK-8924',
  status: 'approved',
  isLoggedIn: true,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer')
  const [adminSubRole, setAdminSubRole] = useState<AdminSubRole>('super_admin')
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('localmove_lang') as Language) || 'en'
  })
  const [customer, setCustomer] = useState<CustomerUser>(() => {
    try {
      const raw = localStorage.getItem('localmove_customer_session')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed.isLoggedIn === 'boolean') {
          return parsed
        }
      }
    } catch {}
    return DEFAULT_CUSTOMER
  })
  const [driver, setDriver] = useState<DriverUser>(() => {
    try {
      const raw = localStorage.getItem('localmove_driver_session')
      if (raw) return JSON.parse(raw)
    } catch {}
    return DEFAULT_DRIVER
  })

  useEffect(() => {
    localStorage.setItem('localmove_lang', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('localmove_customer_session', JSON.stringify(customer))
  }, [customer])

  useEffect(() => {
    localStorage.setItem('localmove_driver_session', JSON.stringify(driver))
  }, [driver])

  const loginCustomer = async (phone: string, name = 'Kunal Shah') => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Enter a valid 10-digit mobile number' }
    }
    try {
      const res = await api.auth.loginCustomer(phone, name)
      const user = res.user
      setCustomer({
        id: user.id || 'cust-demo',
        name: user.name || name,
        phone: user.phone || phone,
        email: user.email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        isLoggedIn: true,
      })
      return { success: true }
    } catch {
      setCustomer({
        id: 'cust-' + Math.random().toString(36).slice(2, 7),
        name,
        phone,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        isLoggedIn: true,
      })
      return { success: true }
    }
  }

  const logoutCustomer = () => {
    api.auth.logout().catch(() => {})
    setCustomer({
      id: '',
      name: '',
      phone: '',
      email: '',
      isLoggedIn: false,
    })
  }

  const loginDriver = async (phone: string) => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Enter a valid 10-digit mobile number' }
    }
    try {
      const res = await api.auth.loginDriver(phone)
      const drv = res.driver
      setDriver({
        id: drv.id,
        name: drv.name,
        phone: drv.phone,
        vehicleType: drv.vehicleType,
        vehicleNumber: drv.vehicleNumber,
        status: drv.status,
        isLoggedIn: true,
      })
      return { success: true }
    } catch {
      setDriver({
        id: 'drv-1',
        name: 'Vikram Patel',
        phone,
        vehicleType: 'bike',
        vehicleNumber: 'GJ-01-BK-8924',
        status: 'approved',
        isLoggedIn: true,
      })
      return { success: true }
    }
  }

  const logoutDriver = () => {
    api.auth.logout().catch(() => {})
    setDriver({
      id: '',
      name: '',
      phone: '',
      vehicleType: '',
      vehicleNumber: '',
      status: 'pending',
      isLoggedIn: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        adminSubRole,
        setAdminSubRole,
        language,
        setLanguage,
        customer,
        driver,
        loginCustomer,
        logoutCustomer,
        loginDriver,
        logoutDriver,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
