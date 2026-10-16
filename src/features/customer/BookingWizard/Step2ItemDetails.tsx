import React, { useState } from 'react'
import { BookingFormData } from './types'
import { ITEM_CATEGORIES } from '@/constants/vehicles'
import { HandlingTag, ItemCategory, ItemSize } from '@/types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import {
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  HelpCircle,
  Tag,
  Check,
} from 'lucide-react'

interface Step2Props {
  formData: BookingFormData
  onChange: (updates: Partial<BookingFormData>) => void
  onNext: () => void
  onBack: () => void
}

export const Step2ItemDetails: React.FC<Step2Props> = ({
  formData,
  onChange,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState('')

  const handlingTagsList: { id: HandlingTag; label: string; desc: string }[] = [
    { id: 'fragile', label: 'Fragile Item', desc: 'Handle with delicate cushioning' },
    { id: 'keep_upright', label: 'Keep Upright', desc: 'Do not tilt or lay flat' },
    { id: 'liquid', label: 'Contains Liquid', desc: 'Secure cap, prevent leakage' },
    { id: 'needs_two_people', label: 'Needs Two People', desc: 'Bulky or heavy lifting' },
    { id: 'stairs_carry', label: 'Stairs Carry', desc: 'Carrying required through staircase' },
  ]

  const sizeOptions: { id: ItemSize; label: string; example: string }[] = [
    { id: 'small', label: 'Small', example: 'Documents, phone, medicine (fits in bag)' },
    { id: 'medium', label: 'Medium', example: 'Microwave, carton box, small monitor' },
    { id: 'large', label: 'Large', example: 'Washing machine, single fridge, double mattress' },
    { id: 'xlarge', label: 'Extra Large', example: 'Multi-room furniture, commercial load' },
  ]

  const handleCategoryChange = (category: ItemCategory) => {
    const found = ITEM_CATEGORIES.find((c) => c.id === category)
    onChange({
      itemCategory: category,
      approxWeightKg: found ? found.defaultWeight : formData.approxWeightKg,
      vehicleType: found && !formData.userOverriddenVehicle ? found.suggestedVehicle : formData.vehicleType,
    })
  }

  const toggleHandlingTag = (tag: HandlingTag) => {
    const current = formData.handlingTags
    if (current.includes(tag)) {
      onChange({ handlingTags: current.filter((t) => t !== tag) })
    } else {
      onChange({ handlingTags: [...current, tag] })
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: string[] = []
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      newPhotos.push(url)
    })
    onChange({ customerPhotos: [...formData.customerPhotos, ...newPhotos] })
  }

  const handleRemovePhoto = (idx: number) => {
    onChange({
      customerPhotos: formData.customerPhotos.filter((_, i) => i !== idx),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.itemDescription.trim()) {
      setError('Please provide a short description of the item(s)')
      return
    }
    if (formData.approxWeightKg <= 0) {
      setError('Approximate weight must be greater than 0 kg')
      return
    }
    if (formData.declaredValueInr < 0) {
      setError('Declared value must be a valid amount')
      return
    }

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Category Selection */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            1. Select Item Category
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Helps calculate vehicle capacity and handling protocols
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ITEM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id as ItemCategory)}
              className={`p-3 rounded-lg border text-xs font-semibold text-left transition-colors flex flex-col justify-between min-h-[58px] ${
                formData.itemCategory === cat.id
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-1">
                Avg ~{cat.defaultWeight}kg
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Item Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          2. Item Description & Size Slabs
        </h3>

        <Textarea
          label="Item Description & Contents"
          required
          value={formData.itemDescription}
          onChange={(e) => onChange({ itemDescription: e.target.value })}
          placeholder="e.g. Dell XPS Laptop with charger in black sleeve, or 1 IFB Washing Machine"
        />

        {/* Size Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Size Classification
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            {sizeOptions.map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => onChange({ itemSize: sz.id })}
                className={`p-3 rounded-lg border text-xs font-semibold text-left transition-colors ${
                  formData.itemSize === sz.id
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">{sz.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-1">{sz.example}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity, Weight, Declared Value */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Quantity / Count"
            type="number"
            min={1}
            max={99}
            value={formData.itemQuantity}
            onChange={(e) => onChange({ itemQuantity: Number(e.target.value) || 1 })}
          />

          <Input
            label="Approx Weight (kg)"
            type="number"
            step="0.1"
            min={0.1}
            value={formData.approxWeightKg}
            onChange={(e) => onChange({ approxWeightKg: Number(e.target.value) || 1 })}
            helperText="Directly decides vehicle capability"
          />

          <Input
            label="Declared Value (₹)"
            type="number"
            min={0}
            step={50}
            value={formData.declaredValueInr}
            onChange={(e) => onChange({ declaredValueInr: Number(e.target.value) || 0 })}
            helperText="Used for transit protection & claims"
          />
        </div>

        {/* Optional Dimensions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
            Optional Dimensions (Length × Width × Height in cm)
          </span>
          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              placeholder="Length (cm)"
              value={formData.dimensions.length || ''}
              onChange={(e) =>
                onChange({
                  dimensions: { ...formData.dimensions, length: Number(e.target.value) || undefined },
                })
              }
            />
            <Input
              type="number"
              placeholder="Width (cm)"
              value={formData.dimensions.width || ''}
              onChange={(e) =>
                onChange({
                  dimensions: { ...formData.dimensions, width: Number(e.target.value) || undefined },
                })
              }
            />
            <Input
              type="number"
              placeholder="Height (cm)"
              value={formData.dimensions.height || ''}
              onChange={(e) =>
                onChange({
                  dimensions: { ...formData.dimensions, height: Number(e.target.value) || undefined },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Item Photos Preview Upload */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            3. Customer Item Photos (Optional)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Help the delivery partner assess vehicle fit and packing condition before arrival.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {formData.customerPhotos.map((photoUrl, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              <img src={photoUrl} alt="Item preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                aria-label="Remove item photo"
                className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-600 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-700 cursor-pointer transition-colors bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400">
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-semibold">Upload Photo</span>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="sr-only" />
          </label>
        </div>
      </div>

      {/* Handling Instructions / Tags */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            4. Special Handling Tags
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visible on the partner's job card and verified during door-step proof inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {handlingTagsList.map((tag) => {
            const isSelected = formData.handlingTags.includes(tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleHandlingTag(tag.id)}
                className={`p-3 rounded-lg border text-left text-xs transition-colors flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
                <div>
                  <div className="font-bold">{tag.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{tag.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Stepper Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Locations
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Continue to Vehicle & Extras
        </Button>
      </div>
    </form>
  )
}
