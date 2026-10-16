import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Package className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block leading-none">
                  LOCAL MOVE
                </span>
                <span className="text-xs text-emerald-400 font-semibold tracking-wide">
                  AN AERA VENTURE
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Person-to-person local delivery and moving platform, operating 24×7. Send documents, gadgets, furniture, or move entire households across the city with photo & video proof at every handover.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div><strong>Venture:</strong> Aera</div>
              <div><strong>Founder:</strong> Paras M. Mecwan</div>
              <div><strong>Service Promise:</strong> 24×7 citywide delivery with verified local partners</div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/customer/book" className="hover:text-emerald-400 transition-colors">Send Parcel / Item</Link></li>
              <li><Link to="/customer/book" className="hover:text-emerald-400 transition-colors">House Shifting (1-3 BHK)</Link></li>
              <li><Link to="/customer/book" className="hover:text-emerald-400 transition-colors">Protective Packing</Link></li>
              <li><Link to="/customer/book" className="hover:text-emerald-400 transition-colors">Hire Helpers</Link></li>
              <li><Link to="/customer/book" className="hover:text-emerald-400 transition-colors">Scheduled Delivery</Link></li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/customer/home" className="hover:text-emerald-400 transition-colors">Customer Portal</Link></li>
              <li><Link to="/driver/login" className="hover:text-emerald-400 transition-colors">Delivery Partner App</Link></li>
              <li><Link to="/admin/overview" className="hover:text-emerald-400 transition-colors">Operations Panel</Link></li>
              <li><Link to="/receiver" className="hover:text-emerald-400 transition-colors">Receiver Tracking Portal</Link></li>
              <li><Link to="/track/tr_live_9281_aera" className="hover:text-emerald-400 transition-colors">Track Order (Live Demo)</Link></li>
              <li><Link to="/customer/help" className="hover:text-emerald-400 transition-colors">Help & FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Care & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care 24×7</h4>
            <div className="space-y-2.5 text-sm">
              <a
                href="tel:+919558690109"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-white font-semibold transition-colors border border-slate-700"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold">+91 9558690109</span>
              </a>

              <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Ahmedabad Operations Hub, Gujarat, India</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Two-Way OTP & Video Proof Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Local Move by Aera. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/customer/help" className="hover:text-slate-400">Prohibited Items</Link>
            <Link to="/customer/help" className="hover:text-slate-400">Privacy Policy</Link>
            <Link to="/customer/help" className="hover:text-slate-400">Terms of Transport</Link>
            <Link to="/customer/help" className="hover:text-slate-400">Refund Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
