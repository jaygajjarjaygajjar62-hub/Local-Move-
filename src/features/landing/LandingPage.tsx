import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { VEHICLE_OPTIONS } from '@/constants/vehicles'
import { Button } from '@/components/ui/Button'
import { AddressAutocompleteInput } from '@/components/maps/AddressAutocompleteInput'
import {
  Package,
  Truck,
  ShieldCheck,
  Camera,
  KeyRound,
  MapPin,
  Clock,
  ArrowRight,
  Phone,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Boxes,
  Users,
  Calendar,
  Bike,
  Car,
  Smartphone,
} from 'lucide-react'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [quickPickup, setQuickPickup] = useState('')
  const [quickDrop, setQuickDrop] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<'bike' | 'cargo_auto' | 'mini_truck'>('bike')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/customer/book', {
      state: {
        pickup: quickPickup,
        drop: quickDrop,
        vehicle: selectedVehicle,
      },
    })
  }

  const services = [
    {
      title: 'Send an Item',
      desc: 'Keys, documents, laptops, medicines, groceries, or forgotten packages across town in minutes.',
      icon: <Package className="w-7 h-7 text-emerald-600" />,
      tag: 'Express 24×7',
    },
    {
      title: 'Move House',
      desc: '1, 2, or 3+ BHK household relocation with dedicated tempos, trucks, and secure cargo bed tie-downs.',
      icon: <Truck className="w-7 h-7 text-emerald-600" />,
      tag: 'Full Shifting',
    },
    {
      title: 'Packing Service',
      desc: 'Multi-layer bubble wrap, edge foam guards, and heavy-duty cartons for appliances and glassware.',
      icon: <Boxes className="w-7 h-7 text-emerald-600" />,
      tag: 'Safe Packing',
    },
    {
      title: 'Hire Helpers',
      desc: 'Skilled manpower for heavy furniture lifting, stairs carriage, loading, and safe placement.',
      icon: <Users className="w-7 h-7 text-emerald-600" />,
      tag: '₹180 / Helper',
    },
    {
      title: 'Scheduled Delivery',
      desc: 'Plan ahead for morning shifts, business dispatches, or weekly recurring transport runs.',
      icon: <Calendar className="w-7 h-7 text-emerald-600" />,
      tag: 'Advance Booking',
    },
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Set Route & Describe Item',
      desc: 'Enter pickup and drop landmarks. State approximate dimensions, weight, and declared value for transparent upfront pricing.',
    },
    {
      step: '02',
      title: 'Verified Handover & Video Proof',
      desc: 'Assigned driver arrives, confirms sender name, verifies pickup OTP, and captures mandatory 360° photo and video inspection.',
    },
    {
      step: '03',
      title: 'Live Tracking & OTP Delivery',
      desc: 'Watch the vehicle move in real time. Receiver inspects condition at destination and releases the drop OTP to complete the delivery.',
    },
  ]

  const faqs = [
    {
      q: 'How does Local Move ensure my package does not get lost or damaged?',
      a: 'We use a strict two-way handover verification: 1) Name verification at both ends, 2) Separate Pickup and Drop OTPs, and 3) Mandatory in-app photo and short video proof captured before transit and after delivery. If damage occurs, our transit protection covers the verified declared value.',
    },
    {
      q: 'Can the receiver track the delivery without installing the mobile app?',
      a: 'Yes. As soon as the delivery partner picks up the item, the receiver receives an SMS with a direct web link (/track/:token). They can see live GPS location, driver details, and vehicle number directly in their mobile browser without downloading any app.',
    },
    {
      q: 'What items are strictly prohibited on Local Move?',
      a: 'Firearms, ammunition, explosives, hazardous chemicals, illegal narcotics, live animals, stolen goods, and currency notes/bullion above statutory limits are strictly prohibited. Delivery partners have the right to inspect and reject any suspicious package at pickup.',
    },
    {
      q: 'How is the delivery fare calculated?',
      a: 'Fares are calculated using a transparent formula: Base vehicle fare + route distance charge + doorstep handling fee (₹15) + any requested helpers (₹180/helper) or packing material. You see an exact itemized breakdown before confirming payment with no surprise post-trip charges.',
    },
    {
      q: 'What documents are required to join as a Delivery Partner?',
      a: 'We keep onboarding fast with only 3 compulsory documents: 1) Driving Licence (front & back), 2) Aadhaar card (masked for privacy), and 3) Vehicle RC book, plus mobile and email verification. Accounts are activated after verification by Aera operations.',
    },
  ]

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero Section - Expansive & High Contrast */}
      <section className="bg-slate-900 text-white pt-16 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-7 text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                24×7 Citywide Logistics & Moving • Ahmedabad Metro Hub
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-black tracking-tight text-white leading-[1.08]">
                Send anything across your city. Anytime.
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                From urgent office documents and laptops to bulky appliances and full household shifting. Handed over with mandatory photo & video proof and two-way OTP verification.
              </p>

              {/* Trust Badges Row */}
              <div className="grid grid-cols-3 gap-4 pt-3 max-w-xl border-t border-slate-800 text-sm font-bold text-slate-200">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Verified Drivers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Camera className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Doorstep Proof</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Two-Way OTP</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <Link to="/customer/book">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="h-13 px-7 text-base font-black bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg"
                  >
                    Book a Delivery Now
                  </Button>
                </Link>
                <Link to="/receiver">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-13 px-6 text-base font-bold border-slate-700 bg-slate-800 text-white hover:bg-slate-700 rounded-xl"
                  >
                    Track a Delivery
                  </Button>
                </Link>
                <Link to="/driver/login">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-13 px-4 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl"
                  >
                    Drive with Us →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Quick Booking Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-7 sm:p-9 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800 text-left space-y-5">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Quick Booking Estimate</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fixed upfront fare with instant dispatch</p>
                  </div>
                  <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Ahmedabad 24×7
                  </span>
                </div>

                <form onSubmit={handleQuickBook} className="space-y-4">
                  <AddressAutocompleteInput
                    label="Pickup Address / Landmark"
                    required
                    value={quickPickup}
                    onChange={(loc) => setQuickPickup(loc.fullAddress)}
                    placeholder="Search street, society or landmark (e.g. Satellite)..."
                    colorTheme="emerald"
                  />

                  <AddressAutocompleteInput
                    label="Drop Address / Landmark"
                    required
                    value={quickDrop}
                    onChange={(loc) => setQuickDrop(loc.fullAddress)}
                    placeholder="Search street, society or landmark (e.g. Navrangpura)..."
                    colorTheme="navy"
                  />

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Select Vehicle Class
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicle('bike')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                          selectedVehicle === 'bike'
                            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Bike className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        <span className="font-extrabold">Bike / 2W</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Up to 20 kg</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedVehicle('cargo_auto')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                          selectedVehicle === 'cargo_auto'
                            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Car className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        <span className="font-extrabold">Cargo Auto</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Up to 500 kg</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedVehicle('mini_truck')}
                        className={`p-3 rounded-xl border text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                          selectedVehicle === 'mini_truck'
                            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Truck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        <span className="font-extrabold">Mini Truck</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Up to 1,000 kg</span>
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-13 text-base font-black bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
                  >
                    Check Fare & Continue →
                  </Button>
                </form>

                <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1">
                  <span>Transparent itemized fare breakdown shown before payment.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Full Width & Clean Grid */}
      <section id="services" className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-left space-y-2.5 mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Service Catalog</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Tailored logistics for every parcel and move
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Whether it's an urgent key, commercial stock delivery, or a complete household relocation with helpers and bubble wrap packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((srv) => (
            <div
              key={srv.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left space-y-4 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800">{srv.icon}</div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {srv.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{srv.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/customer/book"
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                >
                  <span>Book this service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section - Bold Steps */}
      <section id="how-it-works" className="bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-20">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center space-y-3 mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Handover Protocol</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Simple 3-step proof-backed process
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Every delivery follows our structured protocol so items never go missing, unverified, or damaged without accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-left space-y-4 shadow-xs relative hover:shadow-md transition-shadow"
              >
                <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Fleet Options - All 5 Vehicles Shown Cleanly */}
      <section id="vehicles" className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-left space-y-2.5 mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Fleet Capacity</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Choose the right vehicle or let our system suggest
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            From two-wheelers weaving through traffic to full-sized commercial Eicher trucks for household shifting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Object.values(VEHICLE_OPTIONS).map((v) => (
            <div
              key={v.type}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-left space-y-4 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{v.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{v.subtitle}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {v.type === 'bike' ? (
                      <Bike className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                    ) : v.type === 'cargo_auto' ? (
                      <Car className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <Truck className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Payload Capacity:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Up to {v.capacityWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Base Fare:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{v.baseFare} (incl. base km)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Per km rate:</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{v.perKmRate}/km</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-white">Ideal for:</strong> {v.idealFor}
                </div>
              </div>

              <Link to="/customer/book" state={{ vehicle: v.type }}>
                <Button variant="outline" size="md" className="w-full font-bold mt-2 rounded-xl">
                  Select {v.name.split(' ')[0]}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section id="safety" className="bg-slate-900 text-white py-20">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Verification & Trust
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Why Local Move is safer than unverified couriers
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Most delivery services only take a package and drop it off with no record of condition. If something arrives scratched, dented, or missing, nobody takes responsibility. Local Move fixes this with evidence at every step.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Doorstep Photo & Video Proof</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      Delivery partners capture mandatory 360° photo and 15-30s video proof at pickup and drop. Gallery uploads are locked out in our app to stop fake photos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Two-Way Handover OTP</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      A pickup OTP guarantees the driver collects from the right sender; a drop OTP guarantees the package is handed over to the authorized receiver.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Receiver Tracking Without App</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-0.5">
                      Receivers get an instant SMS tracking link that opens live GPS navigation in any mobile browser without requiring an account or app download.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Proof Card Graphic Mockup */}
            <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700 rounded-3xl p-7 sm:p-8 text-left space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-white">Doorstep Evidence Snapshot</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">Order #LM-9281</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl bg-slate-900 border border-slate-700 p-3 space-y-2.5">
                  <span className="text-xs uppercase font-extrabold text-emerald-400 block">Pickup Stage (Satellite)</span>
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-xs relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80"
                      alt="Pickup laptop proof"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-slate-900/90 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                      OTP: 4821
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Zip sealed, zero dents noted</p>
                </div>

                <div className="rounded-xl bg-slate-900 border border-slate-700 p-3 space-y-2.5">
                  <span className="text-xs uppercase font-extrabold text-sky-400 block">Drop Stage (Navrangpura)</span>
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-xs relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80"
                      alt="Drop laptop proof"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-slate-900/90 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                      OTP: 7193
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Receiver acknowledged condition</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-slate-300 flex items-center justify-between">
                <span>Cryptographic Timestamp: <strong>Verified</strong></span>
                <span className="text-emerald-400 font-bold">100% Transit Safe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Recruitment Section */}
      <section className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 sm:p-14 text-left shadow-2xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Partner Supply Network
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Deliver with your bike, auto, or truck. Earn on your own schedule.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                Keep 80% of trip fares plus 100% of customer tips. Fast onboarding with only 3 compulsory documents: Driving Licence, Aadhaar card, and Vehicle RC book.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-sm font-semibold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Daily / Weekly Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>100% Direct Tips</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Flexible Online Hours</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <Link to="/driver/login">
                <Button variant="primary" size="lg" className="w-full h-13 text-base font-black bg-emerald-600 hover:bg-emerald-500 rounded-xl">
                  Register as Delivery Partner
                </Button>
              </Link>
              <Link to="/driver/onboarding">
                <Button variant="outline" size="md" className="w-full font-bold border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl">
                  Check Document Checklist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2.5 mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Clear answers about Local Move services
          </h2>
        </div>

        <div className="space-y-3.5 text-left">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                aria-expanded={openFaq === idx}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 ml-3" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 ml-3" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 24x7 Customer Care Banner */}
      <section className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 text-left shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                24×7 Operations Helpline: +91 9558690109
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Need immediate assistance, night-time delivery coordination, or have a moving inquiry? Speak directly with our live dispatch desk.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a href="tel:+919558690109">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Phone className="w-5 h-5" />}
                className="h-13 px-8 text-base font-black bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
              >
                Call +91 9558690109
              </Button>
            </a>
            <Link to="/customer/help">
              <Button variant="outline" size="lg" className="h-13 px-6 text-base font-bold rounded-xl border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                Help Center
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
