import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  KeyRound,
  FileText,
  Wallet,
  ArrowRight,
  Check,
  Trash2,
  Filter,
} from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  description: string
  timestamp: string
  category: 'delivery' | 'security' | 'billing' | 'account'
  isRead: boolean
  orderId?: string
  actionUrl?: string
  actionLabel?: string
}

export const NotificationsPage: React.FC = () => {
  const { orders } = useOrders()
  const { showToast } = useToast()

  const activeOrder = orders.find((o) => ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(o.status)) || orders[0]

  const initialNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: `Driver En Route to Pickup (${activeOrder?.assignedDriver?.name || 'Ramesh Solanki'})`,
      description: `Your delivery partner is arriving at ${activeOrder?.pickupAddress.fullAddress.slice(0, 40)}... Vehicle: ${activeOrder?.assignedDriver?.vehicleNumber || 'GJ-01-ET-4819'}.`,
      timestamp: '5 mins ago',
      category: 'delivery',
      isRead: false,
      orderId: activeOrder?.id,
      actionUrl: activeOrder ? `/customer/orders/${activeOrder.id}` : '/customer/orders',
      actionLabel: 'Track Live',
    },
    {
      id: 'notif-2',
      title: 'Confidential Pickup OTP Generated',
      description: `Your pickup verification OTP is ${activeOrder?.pickupOtp || '4182'}. Only disclose this after verifying the partner's Aera ID card.`,
      timestamp: '18 mins ago',
      category: 'security',
      isRead: false,
      orderId: activeOrder?.id,
      actionUrl: activeOrder ? `/customer/orders/${activeOrder.id}` : '/customer/orders',
      actionLabel: 'View OTP',
    },
    {
      id: 'notif-3',
      title: 'Tax Invoice Generated for #LM-8819',
      description: 'Your official GST receipt (₹620) is ready for download with driver handover proof photos attached.',
      timestamp: 'Yesterday, 4:30 PM',
      category: 'billing',
      isRead: true,
      orderId: 'LM-8819',
      actionUrl: '/customer/orders',
      actionLabel: 'View Order',
    },
    {
      id: 'notif-4',
      title: 'Wallet Balance Top-up Successful',
      description: '₹500 added via UPI (ref: UPI/930198471). Instant cashback of ₹25 credited to your Local Move balance.',
      timestamp: '2 days ago',
      category: 'account',
      isRead: true,
      actionUrl: '/customer/wallet',
      actionLabel: 'Check Wallet',
    },
    {
      id: 'notif-5',
      title: '24×7 Local Safety Advisory',
      description: 'Remember: All Local Move drivers wear high-vis vests and carry photographic Aera identification. Report discrepancies immediately to +91 9558690109.',
      timestamp: '3 days ago',
      category: 'security',
      isRead: true,
    },
  ]

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'delivery' | 'security' | 'billing'>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    showToast({
      title: 'Notifications Updated',
      message: 'All notifications marked as read.',
      type: 'info',
    })
  }

  const handleClearAll = () => {
    setNotifications([])
    showToast({
      title: 'Inbox Cleared',
      message: 'All alert notifications cleared from view.',
      type: 'info',
    })
  }

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    )
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true
    return n.category === filter
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delivery':
        return <Truck className="w-4 h-4 text-emerald-600" />
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />
      case 'billing':
        return <FileText className="w-4 h-4 text-blue-600" />
      case 'account':
        return <Wallet className="w-4 h-4 text-purple-600" />
      default:
        return <Bell className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Activity & Alerts</h1>
            {unreadCount > 0 && (
              <Badge variant="warning">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time delivery progress milestones, security OTP announcements, and billing updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Check className="w-3.5 h-3.5" />}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
              onClick={handleClearAll}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {(
          [
            { id: 'all', label: 'All Alerts' },
            { id: 'delivery', label: 'Deliveries' },
            { id: 'security', label: 'Security & OTP' },
            { id: 'billing', label: 'Billing & Invoices' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're all caught up! As you dispatch deliveries, live transit updates and OTP alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-xl border transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200'
                  : 'bg-emerald-50/40 border-emerald-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    notif.isRead ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-sm font-bold leading-tight ${
                        notif.isRead ? 'text-slate-800' : 'text-slate-950 font-black'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    {notif.description}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {notif.timestamp}
                    </span>
                    {notif.orderId && (
                      <span className="font-mono font-semibold text-slate-500">
                        Ref #{notif.orderId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {notif.actionUrl && (
                  <Link to={notif.actionUrl}>
                    <Button
                      variant={notif.isRead ? 'outline' : 'primary'}
                      size="sm"
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      {notif.actionLabel || 'View'}
                    </Button>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => handleToggleRead(notif.id)}
                  title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      notif.isRead ? 'text-slate-300' : 'text-emerald-600'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Banner */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Anti-Fraud Protection:</strong> Never share drop verification OTPs over telephone or SMS before the partner physically presents your package.
          </span>
        </div>
        <Link to="/customer/help" className="text-emerald-800 font-bold hover:underline shrink-0 text-xs">
          Learn More →
        </Link>
      </div>
    </div>
  )
}
