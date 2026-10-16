import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { PricingConfig, VehicleType } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Tag, AlertTriangle, Save, RotateCcw, ShieldCheck, DollarSign } from 'lucide-react'

export const AdminPricingPage: React.FC = () => {
  const { pricingConfig, updatePricingConfig } = useOrders()
  const [config, setConfig] = useState<PricingConfig>(pricingConfig)

  const handleVehicleRateChange = (
    type: VehicleType,
    field: 'baseFare' | 'perKmRate',
    val: number,
  ) => {
    setConfig((prev) => ({
      ...prev,
      vehicles: {
        ...prev.vehicles,
        [type]: {
          ...prev.vehicles[type],
          [field]: val,
        },
      },
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updatePricingConfig(config)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pricing Engine & Zone Tariffs
          </h1>
          <p className="text-xs text-slate-500">
            Configure vehicle base rates, distance slabs, helper rates, and commission percentages
          </p>
        </div>
      </div>

      {/* Provisional Business Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Provisional Protocol Settings Notice:</span>
        </div>
        <p className="leading-relaxed">
          Per the Local Move Module Document Section 7 & 20, the final rate slabs and value-versus-weight formulas are open for protocol discussion. Rates saved here immediately apply to real-time fare calculations in the customer booking flow.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* City and General Settings */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            1. Service Zone & General Fees
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Active Service City"
              value={config.city}
              onChange={(e) => setConfig({ ...config, city: e.target.value })}
            />

            <Input
              label="Doorstep Handling Fee (₹)"
              type="number"
              value={config.handlingFee}
              onChange={(e) => setConfig({ ...config, handlingFee: Number(e.target.value) || 0 })}
            />

            <Input
              label="Helper Charge (₹/helper)"
              type="number"
              value={config.helperRatePerHelper}
              onChange={(e) =>
                setConfig({ ...config, helperRatePerHelper: Number(e.target.value) || 0 })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <Input
              label="Packing Base Fee (₹)"
              type="number"
              value={config.packingBaseRate}
              onChange={(e) =>
                setConfig({ ...config, packingBaseRate: Number(e.target.value) || 0 })
              }
            />

            <Input
              label="Transit Protection Rate (% of Declared Value)"
              type="number"
              step="0.1"
              value={config.itemProtectionRatePercent}
              onChange={(e) =>
                setConfig({ ...config, itemProtectionRatePercent: Number(e.target.value) || 0 })
              }
            />

            <Input
              label="GST Tax Rate (%)"
              type="number"
              value={config.gstTaxRatePercent}
              onChange={(e) =>
                setConfig({ ...config, gstTaxRatePercent: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        {/* Vehicle Slabs */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            2. Fleet Base & Per-KM Tariffs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(config.vehicles) as VehicleType[]).map((vType) => (
              <div key={vType} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 block capitalize">
                  {vType.replace('_', ' ')}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Base Fare (₹)"
                    type="number"
                    value={config.vehicles[vType].baseFare}
                    onChange={(e) =>
                      handleVehicleRateChange(vType, 'baseFare', Number(e.target.value) || 0)
                    }
                  />
                  <Input
                    label="Rate / km (₹)"
                    type="number"
                    value={config.vehicles[vType].perKmRate}
                    onChange={(e) =>
                      handleVehicleRateChange(vType, 'perKmRate', Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Share & Cash Limits */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            3. Partner Commissions & Risk Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Driver Fare Share (%)"
              type="number"
              value={config.driverSharePercent}
              onChange={(e) =>
                setConfig({ ...config, driverSharePercent: Number(e.target.value) || 0 })
              }
              helperText="Company retains remaining percentage"
            />

            <Input
              label="Driver Max Cash Limit (₹)"
              type="number"
              value={config.maxDriverCashLimit}
              onChange={(e) =>
                setConfig({ ...config, maxDriverCashLimit: Number(e.target.value) || 0 })
              }
              helperText="Threshold before deposit required"
            />

            <Input
              label="Surge Multiplier (x)"
              type="number"
              step="0.05"
              value={config.nightSurgeMultiplier}
              onChange={(e) =>
                setConfig({ ...config, nightSurgeMultiplier: Number(e.target.value) || 1 })
              }
            />
          </div>

          <div className="pt-2">
            <Checkbox
              checked={config.isSurgeActive}
              onChange={(e) => setConfig({ ...config, isSurgeActive: e.target.checked })}
              label="Activate City-Wide Rain / High-Demand Surge Multiplier"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Save & Publish Pricing Config
          </Button>
        </div>
      </form>
    </div>
  )
}
