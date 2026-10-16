import React from 'react'
import { cn } from '@/utils/cn'
import { OrderStatus } from '@/types'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Navigation,
  Package,
  RotateCcw,
  Search,
  Truck,
  UserCheck,
  XCircle,
} from 'lucide-react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  icon,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    info: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export const OrderStatusBadge: React.FC<{ status: OrderStatus; className?: string }> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'created':
      return (
        <Badge variant="default" icon={<Clock className="w-3.5 h-3.5" />} className={className}>
          Created
        </Badge>
      )
    case 'searching_driver':
      return (
        <Badge variant="warning" icon={<Search className="w-3.5 h-3.5 animate-pulse" />} className={className}>
          Searching Partner
        </Badge>
      )
    case 'driver_assigned':
      return (
        <Badge variant="info" icon={<UserCheck className="w-3.5 h-3.5" />} className={className}>
          Partner Assigned
        </Badge>
      )
    case 'arrived_at_pickup':
      return (
        <Badge variant="info" icon={<Navigation className="w-3.5 h-3.5" />} className={className}>
          Arrived at Pickup
        </Badge>
      )
    case 'picked_up':
      return (
        <Badge variant="info" icon={<Package className="w-3.5 h-3.5" />} className={className}>
          Item Picked Up
        </Badge>
      )
    case 'in_transit':
      return (
        <Badge variant="warning" icon={<Truck className="w-3.5 h-3.5" />} className={className}>
          In Transit
        </Badge>
      )
    case 'arrived_at_drop':
      return (
        <Badge variant="info" icon={<Navigation className="w-3.5 h-3.5" />} className={className}>
          Arrived at Drop
        </Badge>
      )
    case 'delivered':
      return (
        <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />} className={className}>
          Delivered
        </Badge>
      )
    case 'completed':
      return (
        <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />} className={className}>
          Completed
        </Badge>
      )
    case 'cancelled':
      return (
        <Badge variant="danger" icon={<XCircle className="w-3.5 h-3.5" />} className={className}>
          Cancelled
        </Badge>
      )
    case 'failed_returned':
      return (
        <Badge variant="danger" icon={<RotateCcw className="w-3.5 h-3.5" />} className={className}>
          Returned
        </Badge>
      )
    case 'under_dispute':
      return (
        <Badge variant="danger" icon={<AlertTriangle className="w-3.5 h-3.5" />} className={className}>
          Under Dispute
        </Badge>
      )
    default:
      return (
        <Badge variant="default" className={className}>
          {status}
        </Badge>
      )
  }
}
