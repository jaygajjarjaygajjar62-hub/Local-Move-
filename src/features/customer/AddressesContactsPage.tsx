import React, { useState } from 'react'
import { useOrders } from '@/context/OrderContext'
import { Address } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { MapPin, Plus, Trash2, Home, Building, Package, User } from 'lucide-react'

export const AddressesContactsPage: React.FC = () => {
  const { addresses, addSavedAddress, deleteSavedAddress } = useOrders()
  const [modalOpen, setModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [floor, setFloor] = useState('')
  const [instructions, setInstructions] = useState('')

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullAddress.trim()) return

    const newAddr: Address = {
      id: 'addr-' + Date.now(),
      title: title.trim() || 'Saved Place',
      fullAddress: fullAddress.trim(),
      landmark: landmark.trim() || undefined,
      floor: floor.trim() || undefined,
      instructions: instructions.trim() || undefined,
      coords: { lat: 23.025, lng: 72.535 },
      city: 'Ahmedabad',
    }

    addSavedAddress(newAddr)
    setModalOpen(false)
    setTitle('')
    setFullAddress('')
    setLandmark('')
    setFloor('')
    setInstructions('')
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved Addresses & Contacts
          </h1>
          <p className="text-xs text-slate-500">
            Speed up your bookings with one-click dispatch and drop locations
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{addr.title || 'Saved Place'}</h3>
                </div>
                {addr.id && (
                  <button
                    type="button"
                    onClick={() => deleteSavedAddress(addr.id!)}
                    aria-label={`Delete address ${addr.title}`}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{addr.fullAddress}</p>

              {(addr.floor || addr.landmark) && (
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-100">
                  {addr.floor && <div>Floor: {addr.floor}</div>}
                  {addr.landmark && <div>Landmark: {addr.landmark}</div>}
                </div>
              )}
            </div>

            <div className="pt-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Ahmedabad Metro Zone
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Save a New Address"
        description="Add a frequently used pickup or drop location."
        maxWidth="md"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <Input
            label="Address Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Home (Satellite) or Main Branch Office"
          />

          <Input
            label="Full Address / Society / Road"
            required
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            placeholder="e.g. Block B-201, Shivalik Highstreet, Judges Bungalow Road"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Floor / Flat"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="e.g. 2nd Floor, Lift 2"
            />
            <Input
              label="Landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Keshavbaug Party Plot"
            />
          </div>

          <Input
            label="Special Access Notes (Optional)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Gate 1 entry for tempos"
          />

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
