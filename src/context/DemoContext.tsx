import React, { createContext, useContext, useState } from 'react'
import { resetAllDemoData } from '@/services/storage'

export interface DemoScenarios {
  noDriverAvailable: boolean
  paymentFailed: boolean
  paymentPending: boolean
  wrongOtp: boolean
  networkOffline: boolean
  mediaUploadRetry: boolean
  delayedDelivery: boolean
  receiverUnavailable: boolean
}

interface DemoContextValue {
  isDemoMode: boolean
  scenarios: DemoScenarios
  toggleScenario: (key: keyof DemoScenarios) => void
  resetScenarios: () => void
  resetAllData: () => void
  showScenarioPanel: boolean
  setShowScenarioPanel: (show: boolean) => void
}

const DEFAULT_SCENARIOS: DemoScenarios = {
  noDriverAvailable: false,
  paymentFailed: false,
  paymentPending: false,
  wrongOtp: false,
  networkOffline: false,
  mediaUploadRetry: false,
  delayedDelivery: false,
  receiverUnavailable: false,
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined)

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scenarios, setScenarios] = useState<DemoScenarios>(DEFAULT_SCENARIOS)
  const [showScenarioPanel, setShowScenarioPanel] = useState<boolean>(false)

  const toggleScenario = (key: keyof DemoScenarios) => {
    setScenarios((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const resetScenarios = () => {
    setScenarios(DEFAULT_SCENARIOS)
  }

  const resetAllData = () => {
    resetAllDemoData()
    window.location.reload()
  }

  return (
    <DemoContext.Provider
      value={{
        isDemoMode: true,
        scenarios,
        toggleScenario,
        resetScenarios,
        resetAllData,
        showScenarioPanel,
        setShowScenarioPanel,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider')
  }
  return context
}
