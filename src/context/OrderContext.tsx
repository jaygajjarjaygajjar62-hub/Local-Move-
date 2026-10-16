import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Address,
  DamageClaim,
  DriverProfile,
  Order,
  OrderProof,
  OrderStatus,
  PricingConfig,
  ProofMedia,
  SupportTicket,
} from '@/types'
import {
  loadStoredAddresses,
  loadStoredClaims,
  loadStoredDrivers,
  loadStoredOrders,
  loadStoredPricing,
  loadStoredTickets,
  loadStoredWallet,
  saveStoredAddresses,
  saveStoredClaims,
  saveStoredDrivers,
  saveStoredOrders,
  saveStoredPricing,
  saveStoredTickets,
  saveStoredWallet,
} from '@/services/storage'
import { useDemo } from '@/context/DemoContext'
import { useToast } from '@/context/ToastContext'
import { api } from '@/services/api'

interface OrderContextValue {
  orders: Order[]
  activeCustomerOrder: Order | null
  activeDriverOrder: Order | null
  drivers: DriverProfile[]
  addresses: Address[]
  pricingConfig: PricingConfig
  claims: DamageClaim[]
  tickets: SupportTicket[]
  walletBalance: number

  createOrder: (newOrder: Order) => Promise<{ success: boolean; orderId?: string; error?: string }>
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => boolean
  assignDriverToOrder: (orderId: string, driverId: string) => boolean
  verifyPickupOtp: (orderId: string, enteredOtp: string) => { success: boolean; error?: string }
  addPickupProof: (orderId: string, proof: ProofMedia) => void
  confirmPickupSenderName: (orderId: string) => void
  approvePickupByCustomer: (orderId: string) => void
  startTripInTransit: (orderId: string) => { success: boolean; error?: string }

  verifyDropOtp: (orderId: string, enteredOtp: string) => { success: boolean; error?: string }
  addDropProof: (orderId: string, proof: ProofMedia) => void
  confirmDropReceiverName: (orderId: string) => void
  acknowledgeDropByReceiver: (orderId: string, issueNote?: string) => void
  confirmCashCollection: (orderId: string, amount: number) => void
  completeDelivery: (orderId: string) => { success: boolean; error?: string }

  cancelOrder: (orderId: string, reason: string) => { success: boolean; error?: string }
  rateOrderDriver: (orderId: string, stars: number, comment?: string, tipInr?: number) => void
  requestReschedule: (
    orderId: string,
    newDate: string,
    newTimeSlot: string,
    by: 'receiver' | 'customer',
  ) => void
  approveReschedule: (orderId: string) => void

  raiseDamageClaim: (
    claim: Omit<DamageClaim, 'id' | 'createdAt' | 'status'>,
  ) => { success: boolean; claimId: string }
  resolveDamageClaim: (claimId: string, approvedAmount: number, note: string) => void

  createSupportTicket: (
    ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string,
  ) => string
  addTicketMessage: (ticketId: string, text: string, sender: 'user' | 'agent', senderName: string) => void

  updatePricingConfig: (newConfig: PricingConfig) => void
  updateDriverOnlineStatus: (driverId: string, isOnline: boolean) => void
  updateDriverVerification: (
    driverId: string,
    status: 'approved' | 'rejected' | 'suspended',
    docType?: 'licence' | 'aadhaar' | 'rc' | 'selfie',
    reason?: string,
  ) => void

  addSavedAddress: (addr: Address) => void
  deleteSavedAddress: (id: string) => void
  topUpWallet: (amount: number) => void
  deductWallet: (amount: number) => boolean

  getOrderById: (orderId: string) => Order | undefined
  getOrderByToken: (token: string) => Order | undefined
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { scenarios } = useDemo()
  const { showToast } = useToast()

  const [orders, setOrders] = useState<Order[]>(loadStoredOrders)
  const [drivers, setDrivers] = useState<DriverProfile[]>(loadStoredDrivers)
  const [addresses, setAddresses] = useState<Address[]>(loadStoredAddresses)
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(loadStoredPricing)
  const [claims, setClaims] = useState<DamageClaim[]>(loadStoredClaims)
  const [tickets, setTickets] = useState<SupportTicket[]>(loadStoredTickets)
  const [walletBalance, setWalletBalance] = useState<number>(loadStoredWallet)

  useEffect(() => {
    saveStoredOrders(orders)
  }, [orders])

  useEffect(() => {
    saveStoredDrivers(drivers)
  }, [drivers])

  useEffect(() => {
    saveStoredAddresses(addresses)
  }, [addresses])

  useEffect(() => {
    saveStoredPricing(pricingConfig)
  }, [pricingConfig])

  useEffect(() => {
    saveStoredClaims(claims)
  }, [claims])

  useEffect(() => {
    saveStoredTickets(tickets)
  }, [tickets])

  useEffect(() => {
    saveStoredWallet(walletBalance)
  }, [walletBalance])

  // Fetch initial data from backend
  useEffect(() => {
    let mounted = true
    async function loadBackendData() {
      try {
        const [ordersRes, driversRes, addressesRes, pricingRes, claimsRes, ticketsRes, walletRes] = await Promise.allSettled([
          api.orders.list(),
          api.drivers.list(),
          api.addresses.list(),
          api.pricing.getConfig(),
          api.claims.list(),
          api.support.list(),
          api.wallet.get(),
        ])

        if (!mounted) return

        if (ordersRes.status === 'fulfilled' && ordersRes.value?.orders?.length) {
          setOrders(ordersRes.value.orders)
        }
        if (driversRes.status === 'fulfilled' && driversRes.value?.drivers?.length) {
          setDrivers(driversRes.value.drivers)
        }
        if (addressesRes.status === 'fulfilled' && addressesRes.value?.addresses?.length) {
          setAddresses(addressesRes.value.addresses)
        }
        if (pricingRes.status === 'fulfilled' && pricingRes.value?.config) {
          setPricingConfig(pricingRes.value.config)
        }
        if (claimsRes.status === 'fulfilled' && claimsRes.value?.claims?.length) {
          setClaims(claimsRes.value.claims)
        }
        if (ticketsRes.status === 'fulfilled' && ticketsRes.value?.tickets?.length) {
          setTickets(ticketsRes.value.tickets)
        }
        if (walletRes.status === 'fulfilled' && typeof walletRes.value?.balance === 'number') {
          setWalletBalance(walletRes.value.balance)
        }
      } catch (err) {
        console.warn('Backend sync initialized with local storage state:', err)
      }
    }

    loadBackendData()
    return () => {
      mounted = false
    }
  }, [])

  // Derive active orders
  const activeCustomerOrder =
    orders.find((o) =>
      ['searching_driver', 'driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(
        o.status,
      ),
    ) || null

  const activeDriverOrder =
    orders.find((o) =>
      ['driver_assigned', 'arrived_at_pickup', 'picked_up', 'in_transit', 'arrived_at_drop'].includes(
        o.status,
      ),
    ) || null

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId)
  const getOrderByToken = (token: string) => orders.find((o) => o.trackingToken === token)

  const createOrder = async (newOrder: Order) => {
    if (scenarios.paymentFailed && newOrder.paymentMethod !== 'cash') {
      showToast({
        title: 'Payment Simulated Failure',
        message: 'The demo scenario triggered a gateway decline. Please retry or choose Cash.',
        type: 'error',
      })
      return { success: false, error: 'Payment declined by demo payment gateway scenario' }
    }

    if (scenarios.noDriverAvailable) {
      newOrder.status = 'searching_driver'
      setOrders((prev) => [newOrder, ...prev])
      api.orders.create(newOrder).catch((err) => console.warn('Order sync warning:', err))
      showToast({
        title: 'Searching for Partner...',
        message: 'Demo scenario active: High demand in this zone.',
        type: 'warning',
      })
      return { success: true, orderId: newOrder.id }
    }

    // Default simulation: Automatically match an online driver
    const eligibleDriver = drivers.find((d) => d.isOnline && d.status === 'approved' && d.vehicleType === newOrder.vehicleType) || drivers[0]
    const assignedOrder: Order = {
      ...newOrder,
      status: 'driver_assigned',
      assignedDriver: eligibleDriver
        ? {
            id: eligibleDriver.id,
            name: eligibleDriver.name,
            phone: eligibleDriver.phone,
            avatar: eligibleDriver.avatar,
            vehicleNumber: eligibleDriver.vehicleNumber,
            vehicleModel: eligibleDriver.vehicleModel,
            vehicleType: eligibleDriver.vehicleType,
            rating: eligibleDriver.rating,
            totalTrips: eligibleDriver.totalTrips,
            currentCoords: eligibleDriver.currentCoords,
          }
        : undefined,
      timeline: [
        ...newOrder.timeline,
        {
          status: 'driver_assigned',
          timestamp: new Date().toISOString(),
          note: eligibleDriver
            ? `Partner ${eligibleDriver.name} (${eligibleDriver.vehicleNumber}) accepted your request`
            : 'Delivery partner assigned',
        },
      ],
    }

    setOrders((prev) => [assignedOrder, ...prev])
    api.orders.create(assignedOrder).catch((err) => console.warn('Order sync warning:', err))
    showToast({
      title: 'Booking Confirmed!',
      message: `Order #${assignedOrder.id} confirmed. Assigned to ${assignedOrder.assignedDriver?.name || 'Driver'}.`,
      type: 'success',
    })
    return { success: true, orderId: assignedOrder.id }
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord
        const updatedTimeline = [
          ...ord.timeline,
          {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
          },
        ]
        return {
          ...ord,
          status,
          updatedAt: new Date().toISOString(),
          timeline: updatedTimeline,
        }
      }),
    )
    api.orders.updateStatus(orderId, status, note).catch((err) => console.warn('Status sync warning:', err))
    return true
  }

  const assignDriverToOrder = (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId)
    if (!driver) return false

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord
        return {
          ...ord,
          status: 'driver_assigned',
          assignedDriver: {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            avatar: driver.avatar,
            vehicleNumber: driver.vehicleNumber,
            vehicleModel: driver.vehicleModel,
            vehicleType: driver.vehicleType,
            rating: driver.rating,
            totalTrips: driver.totalTrips,
            currentCoords: driver.currentCoords,
          },
          timeline: [
            ...ord.timeline,
            {
              status: 'driver_assigned',
              timestamp: new Date().toISOString(),
              note: `Assigned to ${driver.name} (${driver.vehicleNumber})`,
            },
          ],
        }
      }),
    )
    api.orders.assignDriver(orderId, driverId).catch((err) => console.warn('Assign sync warning:', err))
    showToast({
      title: 'Driver Reassigned',
      message: `Order assigned to ${driver.name}`,
      type: 'info',
    })
    return true
  }

  const verifyPickupOtp = (orderId: string, enteredOtp: string) => {
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return { success: false, error: 'Order not found' }

    if (scenarios.wrongOtp) {
      return { success: false, error: 'Demo scenario: Simulated wrong OTP check' }
    }

    if (enteredOtp !== ord.pickupOtp) {
      return { success: false, error: 'Incorrect OTP. Ask sender for the 4-digit code.' }
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                pickupOtpVerified: true,
                pickupOtpEnteredAt: new Date().toISOString(),
              },
            }
          : o,
      ),
    )
    api.orders.verifyPickupOtp(orderId, enteredOtp).catch((err) => console.warn('Pickup OTP sync warning:', err))
    return { success: true }
  }

  const addPickupProof = (orderId: string, proof: ProofMedia) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                pickupProofs: [...o.proofs.pickupProofs, proof],
              },
            }
          : o,
      ),
    )
    api.orders.addPickupProof(orderId, proof).catch((err) => console.warn('Pickup proof sync warning:', err))
    showToast({
      title: 'Proof Uploaded',
      message: `${proof.type.toUpperCase()} recorded for pickup verification.`,
      type: 'success',
    })
  }

  const confirmPickupSenderName = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                pickupSenderNameConfirmed: true,
              },
            }
          : o,
      ),
    )
    api.orders.confirmPickupSender(orderId).catch((err) => console.warn('Pickup sender sync warning:', err))
  }

  const approvePickupByCustomer = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                pickupCustomerApproved: true,
              },
            }
          : o,
      ),
    )
    api.orders.approvePickup(orderId).catch((err) => console.warn('Pickup approval sync warning:', err))
    showToast({
      title: 'Pickup Approved',
      message: 'Sender acknowledged packaging condition.',
      type: 'info',
    })
  }

  const startTripInTransit = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return { success: false, error: 'Order not found' }

    // Gated check: Name verified, OTP verified, at least 1 photo/video proof
    if (!ord.proofs.pickupSenderNameConfirmed) {
      return { success: false, error: 'Sender name verification required before departure' }
    }
    if (!ord.proofs.pickupOtpVerified) {
      return { success: false, error: 'Valid pickup OTP required before departure' }
    }
    if (ord.proofs.pickupProofs.length === 0) {
      return { success: false, error: 'Mandatory photo/video proof required before departure' }
    }

    updateOrderStatus(orderId, 'in_transit', 'Departed pickup point. Live transit tracking active.')
    api.orders.startTrip(orderId).catch((err) => console.warn('Start trip sync warning:', err))
    showToast({
      title: 'Trip Started',
      message: 'Item in transit to drop location.',
      type: 'info',
    })
    return { success: true }
  }

  const verifyDropOtp = (orderId: string, enteredOtp: string) => {
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return { success: false, error: 'Order not found' }

    if (scenarios.wrongOtp) {
      return { success: false, error: 'Demo scenario: Simulated wrong OTP rejection' }
    }

    if (enteredOtp !== ord.dropOtp) {
      return { success: false, error: 'Incorrect Drop OTP. Collect 4-digit code from receiver.' }
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                dropOtpVerified: true,
                dropOtpEnteredAt: new Date().toISOString(),
              },
            }
          : o,
      ),
    )
    api.orders.verifyDropOtp(orderId, enteredOtp).catch((err) => console.warn('Drop OTP sync warning:', err))
    return { success: true }
  }

  const addDropProof = (orderId: string, proof: ProofMedia) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                dropProofs: [...o.proofs.dropProofs, proof],
              },
            }
          : o,
      ),
    )
    api.orders.addDropProof(orderId, proof).catch((err) => console.warn('Drop proof sync warning:', err))
    showToast({
      title: 'Drop Proof Recorded',
      message: `${proof.type.toUpperCase()} recorded for delivery confirmation.`,
      type: 'success',
    })
  }

  const confirmDropReceiverName = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                dropReceiverNameConfirmed: true,
              },
            }
          : o,
      ),
    )
    api.orders.confirmDropReceiver(orderId).catch((err) => console.warn('Drop receiver sync warning:', err))
  }

  const acknowledgeDropByReceiver = (orderId: string, issueNote?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                dropReceiverAcknowledged: !issueNote,
                dropIssueReported: issueNote,
              },
            }
          : o,
      ),
    )
    api.orders.acknowledgeDrop(orderId, issueNote).catch((err) => console.warn('Acknowledge drop sync warning:', err))
  }

  const confirmCashCollection = (orderId: string, amount: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              proofs: {
                ...o.proofs,
                cashCollectedConfirmed: true,
                cashAmountCollected: amount,
              },
            }
          : o,
      ),
    )
    api.orders.confirmCashCollection(orderId, amount).catch((err) => console.warn('Cash collection sync warning:', err))
    showToast({
      title: 'Cash Collected',
      message: `Recorded ₹${amount} cash collection from customer.`,
      type: 'success',
    })
  }

  const completeDelivery = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return { success: false, error: 'Order not found' }

    if (!ord.proofs.dropReceiverNameConfirmed) {
      return { success: false, error: 'Receiver name confirmation is mandatory' }
    }
    if (!ord.proofs.dropOtpVerified) {
      return { success: false, error: 'Drop OTP verification is mandatory' }
    }
    if (ord.proofs.dropProofs.length === 0) {
      return { success: false, error: 'Mandatory drop photo or video proof required' }
    }
    if (ord.paymentMethod === 'cash' && !ord.proofs.cashCollectedConfirmed) {
      return { success: false, error: 'Confirm cash collection of ₹' + ord.fare.totalCustomerFare + ' before closing trip' }
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        return {
          ...o,
          status: 'completed',
          updatedAt: new Date().toISOString(),
          timeline: [
            ...o.timeline,
            {
              status: 'delivered',
              timestamp: new Date().toISOString(),
              note: 'Item handed over to receiver. OTP and photo verified.',
            },
            {
              status: 'completed',
              timestamp: new Date().toISOString(),
              note: 'Trip closed. Earnings credited to partner.',
            },
          ],
        }
      }),
    )

    // Update driver's today earnings
    if (ord.assignedDriver) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === ord.assignedDriver?.id
            ? {
                ...d,
                todayEarnings: d.todayEarnings + ord.fare.driverShare,
                totalTrips: d.totalTrips + 1,
                cashInHandBalance:
                  ord.paymentMethod === 'cash'
                    ? d.cashInHandBalance + ord.fare.totalCustomerFare
                    : d.cashInHandBalance,
                companyShareOwed:
                  ord.paymentMethod === 'cash'
                    ? d.companyShareOwed + ord.fare.companyShare
                    : d.companyShareOwed,
              }
            : d,
        ),
      )
    }

    api.orders.completeDelivery(orderId).catch((err) => console.warn('Complete delivery sync warning:', err))

    showToast({
      title: 'Delivery Completed!',
      message: `Order #${ord.id} completed successfully.`,
      type: 'success',
    })
    return { success: true }
  }

  const cancelOrder = (orderId: string, reason: string) => {
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return { success: false, error: 'Order not found' }

    if (['picked_up', 'in_transit', 'arrived_at_drop'].includes(ord.status)) {
      return {
        success: false,
        error: 'Order has already been picked up. Please contact Customer Care at +91 9558690109 for support.',
      }
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              cancelReason: reason,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...o.timeline,
                {
                  status: 'cancelled',
                  timestamp: new Date().toISOString(),
                  note: `Order cancelled. Reason: ${reason}`,
                },
              ],
            }
          : o,
      ),
    )
    api.orders.cancel(orderId, reason).catch((err) => console.warn('Cancel order sync warning:', err))
    showToast({
      title: 'Order Cancelled',
      message: `Order #${ord.id} cancelled.`,
      type: 'warning',
    })
    return { success: true }
  }

  const rateOrderDriver = (orderId: string, stars: number, comment?: string, tipInr?: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              driverRating: {
                stars,
                comment,
                tipInr,
                createdAt: new Date().toISOString(),
              },
            }
          : o,
      ),
    )
    api.orders.rate(orderId, stars, comment, tipInr).catch((err) => console.warn('Rating sync warning:', err))
    if (tipInr && tipInr > 0) {
      showToast({
        title: 'Thank you for your rating!',
        message: `₹${tipInr} tip will be transferred 100% to the delivery partner.`,
        type: 'success',
      })
    } else {
      showToast({
        title: 'Rating Submitted',
        message: `Thank you for rating ${stars} stars.`,
        type: 'success',
      })
    }
  }

  const requestReschedule = (
    orderId: string,
    newDate: string,
    newTimeSlot: string,
    by: 'receiver' | 'customer',
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              rescheduleRequest: {
                requestedBy: by,
                newDate,
                newTimeSlot,
                status: 'pending',
              },
            }
          : o,
      ),
    )
    api.orders.rescheduleRequest(orderId, by, newDate, newTimeSlot).catch((err) => console.warn('Reschedule sync warning:', err))
    showToast({
      title: 'Reschedule Requested',
      message: `Pending customer confirmation for ${newDate} (${newTimeSlot}).`,
      type: 'info',
    })
  }

  const approveReschedule = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || !o.rescheduleRequest) return o
        return {
          ...o,
          isScheduled: true,
          scheduledTime: `${o.rescheduleRequest.newDate} ${o.rescheduleRequest.newTimeSlot}`,
          rescheduleRequest: {
            ...o.rescheduleRequest,
            status: 'approved',
          },
          timeline: [
            ...o.timeline,
            {
              status: o.status,
              timestamp: new Date().toISOString(),
              note: `Rescheduled to ${o.rescheduleRequest.newDate} (${o.rescheduleRequest.newTimeSlot}) with customer approval`,
            },
          ],
        }
      }),
    )
    api.orders.rescheduleApprove(orderId).catch((err) => console.warn('Approve reschedule sync warning:', err))
    showToast({
      title: 'Reschedule Approved',
      message: 'Updated delivery schedule confirmed.',
      type: 'success',
    })
  }

  const raiseDamageClaim = (claimData: Omit<DamageClaim, 'id' | 'createdAt' | 'status'>) => {
    const claimId = 'CLM-' + (100 + claims.length + 1)
    const newClaim: DamageClaim = {
      ...claimData,
      id: claimId,
      status: 'under_review',
      createdAt: new Date().toISOString(),
    }
    setClaims((prev) => [newClaim, ...prev])
    updateOrderStatus(claimData.orderId, 'under_dispute', `Claim filed: ${claimData.description}`)
    api.claims.create(newClaim).catch((err) => console.warn('Claim sync warning:', err))
    showToast({
      title: 'Claim Submitted',
      message: `Claim #${claimId} submitted for review by Aera operations team.`,
      type: 'info',
    })
    return { success: true, claimId }
  }

  const resolveDamageClaim = (claimId: string, approvedAmount: number, note: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              approvedCompensationInr: approvedAmount,
              resolutionNotes: note,
              status: approvedAmount > 0 ? 'approved' : 'rejected',
            }
          : c,
      ),
    )
    api.claims.resolve(claimId, approvedAmount, note).catch((err) => console.warn('Resolve claim sync warning:', err))
    if (approvedAmount > 0) {
      setWalletBalance((prev) => prev + approvedAmount)
      showToast({
        title: 'Claim Resolved',
        message: `Approved compensation of ₹${approvedAmount} credited to customer wallet.`,
        type: 'success',
      })
    }
  }

  const createSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string,
  ) => {
    const ticketId = 'TCK-' + (200 + tickets.length + 1)
    const newTicket: SupportTicket = {
      ...ticketData,
      id: ticketId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg-' + Math.random().toString(36).slice(2, 7),
          sender: 'user',
          senderName: ticketData.userName,
          text: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    setTickets((prev) => [newTicket, ...prev])
    api.support.create({ ...ticketData, message: initialMessage }).catch((err) => console.warn('Support ticket sync warning:', err))
    showToast({
      title: 'Support Ticket Created',
      message: `Ticket #${ticketId} opened. Helpline +91 9558690109 available 24x7.`,
      type: 'info',
    })
    return ticketId
  }

  const addTicketMessage = (
    ticketId: string,
    text: string,
    sender: 'user' | 'agent',
    senderName: string,
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          messages: [
            ...t.messages,
            {
              id: 'msg-' + Math.random().toString(36).slice(2, 7),
              sender,
              senderName,
              text,
              timestamp: new Date().toISOString(),
            },
          ],
        }
      }),
    )
    api.support.addMessage(ticketId, text, sender, senderName).catch((err) => console.warn('Ticket message sync warning:', err))
  }

  const updatePricingConfig = (newConfig: PricingConfig) => {
    setPricingConfig(newConfig)
    api.pricing.updateConfig(newConfig).catch((err) => console.warn('Pricing sync warning:', err))
    showToast({
      title: 'Pricing Updated',
      message: 'New city rates and multipliers applied across the platform.',
      type: 'success',
    })
  }

  const updateDriverOnlineStatus = (driverId: string, isOnline: boolean) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, isOnline } : d)),
    )
    api.drivers.updateOnline(driverId, isOnline).catch((err) => console.warn('Driver online sync warning:', err))
  }

  const updateDriverVerification = (
    driverId: string,
    status: 'approved' | 'rejected' | 'suspended',
    docType?: 'licence' | 'aadhaar' | 'rc' | 'selfie',
    reason?: string,
  ) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d
        const updatedDocs = { ...d.documents }
        if (docType && updatedDocs[docType]) {
          const curDoc = updatedDocs[docType]
          updatedDocs[docType] = {
            ...curDoc,
            status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'expired',
            rejectionReason: reason,
          } as any
        }
        return {
          ...d,
          status,
          documents: updatedDocs,
        }
      }),
    )
    api.drivers.updateVerification(driverId, status, docType, reason).catch((err) => console.warn('Driver verification sync warning:', err))
    showToast({
      title: 'Driver Status Updated',
      message: `Driver status changed to ${status}.`,
      type: 'info',
    })
  }

  const addSavedAddress = (addr: Address) => {
    const id = addr.id || 'addr-' + Date.now()
    const addressWithId = { ...addr, id }
    setAddresses((prev) => [...prev, addressWithId])
    api.addresses.add(addressWithId).catch((err) => console.warn('Address sync warning:', err))
    showToast({
      title: 'Address Saved',
      message: `${addr.title || 'Address'} added to your saved list.`,
      type: 'success',
    })
  }

  const deleteSavedAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    api.addresses.delete(id).catch((err) => console.warn('Address delete sync warning:', err))
    showToast({
      title: 'Address Removed',
      type: 'info',
    })
  }

  const topUpWallet = (amount: number) => {
    setWalletBalance((prev) => prev + amount)
    api.wallet.topUp(amount).catch((err) => console.warn('Wallet topup sync warning:', err))
    showToast({
      title: 'Wallet Recharged',
      message: `₹${amount} added to your Local Move wallet.`,
      type: 'success',
    })
  }

  const deductWallet = (amount: number) => {
    if (walletBalance < amount) return false
    setWalletBalance((prev) => prev - amount)
    api.wallet.deduct(amount).catch((err) => console.warn('Wallet deduct sync warning:', err))
    return true
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeCustomerOrder,
        activeDriverOrder,
        drivers,
        addresses,
        pricingConfig,
        claims,
        tickets,
        walletBalance,

        createOrder,
        updateOrderStatus,
        assignDriverToOrder,
        verifyPickupOtp,
        addPickupProof,
        confirmPickupSenderName,
        approvePickupByCustomer,
        startTripInTransit,

        verifyDropOtp,
        addDropProof,
        confirmDropReceiverName,
        acknowledgeDropByReceiver,
        confirmCashCollection,
        completeDelivery,

        cancelOrder,
        rateOrderDriver,
        requestReschedule,
        approveReschedule,

        raiseDamageClaim,
        resolveDamageClaim,

        createSupportTicket,
        addTicketMessage,

        updatePricingConfig,
        updateDriverOnlineStatus,
        updateDriverVerification,

        addSavedAddress,
        deleteSavedAddress,
        topUpWallet,
        deductWallet,

        getOrderById,
        getOrderByToken,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider')
  }
  return context
}
