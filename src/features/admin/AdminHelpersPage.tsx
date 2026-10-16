import React from 'react'
import { Users, ShieldCheck, Award, Star, Truck } from 'lucide-react'

export const AdminHelpersPage: React.FC = () => {
  const helpers = [
    {
      id: 'hlp-1',
      name: 'Santosh Kumar',
      phone: '+91 97120 44556',
      role: 'Heavy Lifting & Shifting Specialist',
      experience: '4 Years',
      rating: 4.9,
      status: 'active',
      movesAssisted: 142,
    },
    {
      id: 'hlp-2',
      name: 'Raju Rathod',
      phone: '+91 98981 22334',
      role: 'Packaging & Fragile Items Handler',
      experience: '3 Years',
      rating: 4.8,
      status: 'active',
      movesAssisted: 98,
    },
    {
      id: 'hlp-3',
      name: 'Mohan Sharma',
      phone: '+91 94261 77889',
      role: 'Appliance Unloading & Stairs Carriage',
      experience: '5 Years',
      rating: 4.95,
      status: 'active',
      movesAssisted: 215,
    },
  ]

  return (
    <div className="space-y-6 text-left">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Helper & Packing Staff Management
        </h1>
        <p className="text-xs text-slate-500">
          Verified loading helpers and packing specialists registered for household moves
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {helpers.map((h) => (
          <div key={h.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{h.name}</h3>
                <span className="text-[11px] text-slate-500">{h.role}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                {h.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-semibold text-slate-800">{h.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="font-semibold text-slate-800">{h.experience}</span>
              </div>
              <div className="flex justify-between">
                <span>Moves Assisted:</span>
                <span className="font-semibold text-slate-800">{h.movesAssisted} trips</span>
              </div>
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="font-semibold text-amber-600">★ {h.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
