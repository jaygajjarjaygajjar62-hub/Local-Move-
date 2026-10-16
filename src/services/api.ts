import {
  Address,
  DamageClaim,
  DriverProfile,
  FareBreakdown,
  Order,
  OrderStatus,
  PricingConfig,
  ProofMedia,
  SupportTicket,
  VehicleType,
} from '@/types'

const API_BASE = '/api/v1'

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('localmove_auth_token')
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  const json = await response.json()

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || `API request failed with status ${response.status}`
    const error = new Error(errorMsg) as any
    error.code = json.error?.code
    error.details = json.error?.details
    throw error
  }

  return json.data as T
}

export const api = {
  auth: {
    loginCustomer: async (phone: string, name?: string) => {
      const data = await request<{ user: any; token: string }>('/auth/customer/login', {
        method: 'POST',
        body: JSON.stringify({ phone, name }),
      })
      if (data.token) {
        localStorage.setItem('localmove_auth_token', data.token)
      }
      return data
    },
    loginDriver: async (phone: string) => {
      const data = await request<{ driver: any; token: string }>('/auth/driver/login', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      })
      if (data.token) {
        localStorage.setItem('localmove_auth_token', data.token)
      }
      return data
    },
    getMe: async () => request<{ user: any }>('/auth/me'),
    logout: async () => {
      localStorage.removeItem('localmove_auth_token')
      return request<{ message: string }>('/auth/logout', { method: 'POST' })
    },
  },

  orders: {
    list: async (params?: { status?: string; customerId?: string; driverId?: string; search?: string }) => {
      const query = new URLSearchParams()
      if (params?.status && params.status !== 'all') query.set('status', params.status)
      if (params?.customerId) query.set('customerId', params.customerId)
      if (params?.driverId) query.set('driverId', params.driverId)
      if (params?.search) query.set('search', params.search)
      const qStr = query.toString() ? `?${query.toString()}` : ''
      return request<{ orders: Order[]; total: number }>(`/orders${qStr}`)
    },
    getById: async (id: string) => request<{ order: Order }>(`/orders/${id}`),
    getByToken: async (token: string) => request<{ order: Order }>(`/orders/track/${token}`),
    verifyReceiverPhone: async (token: string, phoneLast4: string) =>
      request<{ unlocked: boolean; dropOtp: string }>(`/orders/track/${token}/verify`, {
        method: 'POST',
        body: JSON.stringify({ phoneLast4 }),
      }),
    create: async (orderPayload: any) =>
      request<{ orderId: string; order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      }),
    updateStatus: async (id: string, status: OrderStatus, note?: string) =>
      request<{ order: Order }>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }),
    assignDriver: async (id: string, driverId: string) =>
      request<{ order: Order }>(`/orders/${id}/assign-driver`, {
        method: 'POST',
        body: JSON.stringify({ driverId }),
      }),
    confirmPickupSender: async (id: string) =>
      request<{ confirmed: boolean }>(`/orders/${id}/pickup/confirm-sender`, { method: 'POST' }),
    verifyPickupOtp: async (id: string, otp: string) =>
      request<{ success: boolean }>(`/orders/${id}/pickup/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
      }),
    addPickupProof: async (id: string, proof: ProofMedia) =>
      request<{ proofId: string }>(`/orders/${id}/pickup/proof`, {
        method: 'POST',
        body: JSON.stringify(proof),
      }),
    approvePickup: async (id: string) =>
      request<{ approved: boolean }>(`/orders/${id}/pickup/approve`, { method: 'POST' }),
    startTrip: async (id: string) =>
      request<{ success: boolean }>(`/orders/${id}/pickup/start-trip`, { method: 'POST' }),
    confirmDropReceiver: async (id: string) =>
      request<{ confirmed: boolean }>(`/orders/${id}/drop/confirm-receiver`, { method: 'POST' }),
    verifyDropOtp: async (id: string, otp: string) =>
      request<{ success: boolean }>(`/orders/${id}/drop/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
      }),
    addDropProof: async (id: string, proof: ProofMedia) =>
      request<{ proofId: string }>(`/orders/${id}/drop/proof`, {
        method: 'POST',
        body: JSON.stringify(proof),
      }),
    acknowledgeDrop: async (id: string, issueNote?: string) =>
      request<{ acknowledged: boolean }>(`/orders/${id}/drop/acknowledge`, {
        method: 'POST',
        body: JSON.stringify({ issueNote }),
      }),
    confirmCashCollection: async (id: string, amount: number) =>
      request<{ confirmed: boolean; amount: number }>(`/orders/${id}/drop/collect-cash`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    completeDelivery: async (id: string) =>
      request<{ success: boolean }>(`/orders/${id}/drop/complete`, { method: 'POST' }),
    cancel: async (id: string, reason: string) =>
      request<{ success: boolean }>(`/orders/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    rate: async (id: string, stars: number, comment?: string, tipInr = 0) =>
      request<{ rated: boolean }>(`/orders/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ stars, comment, tipInr }),
      }),
    rescheduleRequest: async (id: string, requestedBy: 'receiver' | 'customer', newDate: string, newTimeSlot: string) =>
      request<{ rescheduled: string }>(`/orders/${id}/reschedule-request`, {
        method: 'POST',
        body: JSON.stringify({ requestedBy, newDate, newTimeSlot }),
      }),
    rescheduleApprove: async (id: string) =>
      request<{ status: string }>(`/orders/${id}/reschedule-approve`, { method: 'POST' }),
  },

  pricing: {
    calculateFare: async (params: any) =>
      request<{ fare: FareBreakdown }>('/pricing/calculate-fare', {
        method: 'POST',
        body: JSON.stringify(params),
      }),
    getConfig: async (city?: string) =>
      request<{ config: PricingConfig }>(`/pricing/config${city ? `?city=${encodeURIComponent(city)}` : ''}`),
    updateConfig: async (config: PricingConfig) =>
      request<{ config: PricingConfig }>('/pricing/config', {
        method: 'PUT',
        body: JSON.stringify(config),
      }),
  },

  drivers: {
    list: async (params?: { status?: string; isOnline?: boolean; vehicleType?: string }) => {
      const q = new URLSearchParams()
      if (params?.status) q.set('status', params.status)
      if (params?.isOnline !== undefined) q.set('isOnline', String(params.isOnline))
      if (params?.vehicleType && params.vehicleType !== 'all') q.set('vehicleType', params.vehicleType)
      const qStr = q.toString() ? `?${q.toString()}` : ''
      return request<{ drivers: DriverProfile[] }>(`/drivers${qStr}`)
    },
    getById: async (id: string) => request<{ driver: DriverProfile }>(`/drivers/${id}`),
    updateOnline: async (id: string, isOnline: boolean) =>
      request<{ driver: DriverProfile }>(`/drivers/${id}/online`, {
        method: 'PATCH',
        body: JSON.stringify({ isOnline }),
      }),
    updateVerification: async (id: string, status: string, docType?: string, reason?: string) =>
      request<{ driver: DriverProfile }>(`/drivers/${id}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ status, docType, reason }),
      }),
    submitOnboarding: async (data: any) =>
      request<{ driverId: string; driver: DriverProfile }>('/drivers/onboarding', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getEarnings: async (id: string, period = 'today') =>
      request<any>(`/drivers/${id}/earnings?period=${period}`),
  },

  addresses: {
    list: async () => request<{ addresses: Address[] }>('/addresses'),
    add: async (addr: Address) =>
      request<{ address: Address }>('/addresses', {
        method: 'POST',
        body: JSON.stringify(addr),
      }),
    delete: async (id: string) => request<{ deleted: boolean }>(`/addresses/${id}`, { method: 'DELETE' }),
  },

  wallet: {
    get: async () => request<{ balance: number; transactions: any[] }>('/wallet'),
    topUp: async (amount: number) =>
      request<{ balance: number; transactions: any[] }>('/wallet/top-up', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
    deduct: async (amount: number, orderId?: string) =>
      request<{ balance: number; transactions: any[] }>('/wallet/deduct', {
        method: 'POST',
        body: JSON.stringify({ amount, orderId }),
      }),
  },

  claims: {
    list: async () => request<{ claims: DamageClaim[] }>('/claims'),
    create: async (claim: Omit<DamageClaim, 'id' | 'createdAt' | 'status'>) =>
      request<{ success: boolean; claimId: string }>('/claims', {
        method: 'POST',
        body: JSON.stringify(claim),
      }),
    resolve: async (claimId: string, approvedCompensationInr: number, resolutionNotes: string) =>
      request<{ claim: DamageClaim }>(`/claims/${claimId}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ approvedCompensationInr, resolutionNotes }),
      }),
  },

  support: {
    list: async (userId?: string) =>
      request<{ tickets: SupportTicket[] }>(`/support/tickets${userId ? `?userId=${userId}` : ''}`),
    getById: async (id: string) => request<{ ticket: SupportTicket }>(`/support/tickets/${id}`),
    create: async (ticket: any) =>
      request<{ ticketId: string; ticket: SupportTicket }>('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(ticket),
      }),
    addMessage: async (ticketId: string, text: string, sender: 'user' | 'agent', senderName: string) =>
      request<{ ticket: SupportTicket }>(`/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text, sender, senderName }),
      }),
    updateStatus: async (ticketId: string, status: string) =>
      request<{ ticket: SupportTicket }>(`/support/tickets/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  admin: {
    getOverview: async () => request<any>('/admin/overview'),
    getLiveOps: async (vehicleType?: string) =>
      request<any>(`/admin/live-ops${vehicleType ? `?vehicleType=${vehicleType}` : ''}`),
    getCommissions: async () => request<any>('/admin/commissions'),
    getReports: async (range?: string) => request<any>(`/admin/reports${range ? `?range=${range}` : ''}`),
    getHelpers: async () => request<any>('/admin/helpers'),
    getAuditLogs: async () => request<any>('/admin/audit-logs'),
  },

  content: {
    getProhibited: async () => request<{ items: any[] }>('/content/prohibited'),
    getFAQs: async (category?: string) =>
      request<{ faqs: any[] }>(`/content/faqs${category ? `?category=${category}` : ''}`),
  },

  notifications: {
    list: async (filter?: string) =>
      request<{ notifications: any[] }>(`/notifications${filter ? `?filter=${filter}` : ''}`),
    markRead: async (id?: string) =>
      request<{ updated: boolean }>('/notifications/mark-read', {
        method: 'PATCH',
        body: JSON.stringify({ id }),
      }),
  },

  maps: {
    searchPlaces: async (query: string, apiKey?: string) =>
      request<{ query: string; count: number; places: any[] }>('/maps/places-search', {
        method: 'POST',
        body: JSON.stringify({ query, apiKey }),
      }),
    computeRoute: async (
      origin: { lat: number; lng: number },
      destination: { lat: number; lng: number },
      apiKey?: string,
    ) =>
      request<{
        distanceMeters: number
        distanceKm: number
        durationSeconds: number
        durationMinutes: number
        encodedPolyline: string
        source: string
      }>('/maps/compute-route', {
        method: 'POST',
        body: JSON.stringify({ origin, destination, apiKey }),
      }),
  },
}
