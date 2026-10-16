import { z } from 'zod';
// Shared schemas
export const phoneSchema = z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 10, {
    message: 'Mobile number must be a valid 10-digit number',
});
export const otpSchema = z
    .string()
    .transform((val) => val.trim())
    .refine((val) => /^\d{4}$/.test(val), {
    message: 'OTP must be exactly 4 digits',
});
export const coordsSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
});
export const addressSchema = z
    .object({
    id: z.string().optional(),
    title: z.string().optional(),
    fullAddress: z.string().optional(),
    address: z.string().optional(),
    landmark: z.string().optional(),
    floor: z.string().optional(),
    instructions: z.string().optional(),
    city: z.string().default('Ahmedabad'),
    coords: coordsSchema,
})
    .transform((data) => ({
    ...data,
    fullAddress: data.fullAddress || data.address || 'Address',
}));
export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
});
export const vehicleTypeSchema = z.enum([
    'bike',
    'cargo_auto',
    'mini_truck',
    'large_tempo',
    'truck_eicher',
]);
export const itemCategorySchema = z.enum([
    'documents',
    'electronics',
    'groceries',
    'clothes',
    'furniture',
    'appliances',
    'household_shifting',
    'other',
]);
export const itemSizeSchema = z.enum(['small', 'medium', 'large', 'xlarge']);
export const handlingTagSchema = z.enum([
    'fragile',
    'keep_upright',
    'liquid',
    'needs_two_people',
    'stairs_carry',
]);
export const orderItemSchema = z.object({
    category: itemCategorySchema,
    description: z.string().min(2, 'Description required'),
    quantity: z.number().int().positive().default(1),
    size: itemSizeSchema,
    dimensions: z
        .object({
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
    })
        .optional(),
    approxWeightKg: z.number().nonnegative(),
    declaredValueInr: z.number().nonnegative().default(0),
    handlingTags: z.array(handlingTagSchema).default([]),
    customerPhotos: z.array(z.string()).default([]),
});
export const paymentMethodSchema = z.enum([
    'cash',
    'upi',
    'card',
    'wallet',
    'receiver_pays',
]);
export const payerSchema = z.enum(['sender', 'receiver']);
// Auth
export const customerLoginSchema = z.object({
    phone: phoneSchema,
    name: z.string().optional(),
    otp: z.string().optional(),
});
export const driverLoginSchema = z.object({
    phone: phoneSchema,
    otp: z.string().optional(),
});
// Orders
export const createOrderSchema = z
    .object({
    id: z.string().optional(),
    trackingToken: z.string().optional(),
    customer: z
        .object({
        id: z.string().optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
    })
        .optional(),
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    sender: contactSchema.optional(),
    receiver: contactSchema.optional(),
    receiverName: z.string().optional(),
    receiverPhone: z.string().optional(),
    pickupAddress: addressSchema,
    dropAddress: addressSchema,
    item: orderItemSchema.optional(),
    category: z.string().optional(),
    packageDetails: z
        .object({
        description: z.string().optional(),
        weightKg: z.number().optional(),
        isFragile: z.boolean().optional(),
    })
        .optional(),
    vehicleType: vehicleTypeSchema,
    helpersCount: z.number().int().min(0).max(5).default(0),
    hasPackingService: z.boolean().default(false),
    hasItemProtection: z.boolean().default(false),
    isScheduled: z.boolean().default(false),
    scheduledTime: z.string().optional(),
    returnToSenderIfFailed: z.boolean().default(true),
    paymentMethod: paymentMethodSchema,
    paymentStatus: z.string().optional(),
    pickupOtp: z.string().optional(),
    dropOtp: z.string().optional(),
    payer: payerSchema.default('sender'),
    promoCode: z.string().optional(),
    useWallet: z.boolean().optional(),
    fare: z.any().optional(),
})
    .transform((data) => {
    const custId = data.customer?.id || data.customerId || 'cust-demo';
    const custName = data.customer?.name || data.customerName || 'Kunal Shah';
    const custPhone = data.customer?.phone || data.customerPhone || '9879011223';
    const sender = data.sender || {
        name: custName,
        phone: custPhone,
    };
    const receiver = data.receiver || {
        name: data.receiverName || 'Receiver',
        phone: data.receiverPhone || '9825000000',
    };
    const item = data.item || {
        category: data.category || 'other',
        description: data.packageDetails?.description || 'Parcel Package',
        quantity: 1,
        size: 'medium',
        approxWeightKg: data.packageDetails?.weightKg || 5,
        declaredValueInr: 1000,
        handlingTags: data.packageDetails?.isFragile ? ['fragile'] : [],
        customerPhotos: [],
    };
    return {
        ...data,
        customer: {
            id: custId,
            name: custName,
            phone: custPhone,
        },
        sender,
        receiver,
        item,
    };
});
export const updateOrderStatusSchema = z.object({
    status: z.enum([
        'created',
        'searching_driver',
        'driver_assigned',
        'arrived_at_pickup',
        'picked_up',
        'in_transit',
        'arrived_at_drop',
        'delivered',
        'completed',
        'cancelled',
        'failed_returned',
        'under_dispute',
    ]),
    note: z.string().optional(),
});
export const cancelOrderSchema = z.object({
    reason: z.string().min(3, 'Cancellation reason required'),
});
export const rateOrderSchema = z.object({
    stars: z.number().int().min(1).max(5),
    comment: z.string().optional(),
    tipInr: z.number().nonnegative().optional().default(0),
});
export const rescheduleRequestSchema = z.object({
    requestedBy: z.enum(['receiver', 'customer']),
    newDate: z.string().min(4, 'Valid date required'),
    newTimeSlot: z.string().min(3, 'Valid time slot required'),
});
export const verifyReceiverSchema = z.object({
    phoneLast4: z.string().optional().default(''),
});
// Pricing
export const calculateFareSchema = z.object({
    distanceKm: z.number().nonnegative(),
    vehicleType: vehicleTypeSchema,
    item: orderItemSchema,
    helperCount: z.number().int().min(0).default(0),
    hasPackingService: z.boolean().default(false),
    hasItemProtection: z.boolean().default(false),
    promoCode: z.string().optional(),
    applyWalletBalance: z.number().nonnegative().optional().default(0),
    isNightHours: z.boolean().optional().default(false),
});
// Wallet
export const walletTopUpSchema = z.object({
    amount: z.number().int().min(10, 'Minimum recharge is ₹10'),
});
export const walletDeductSchema = z.object({
    amount: z.number().positive('Deduction amount must be positive'),
    orderId: z.string().optional(),
});
// Claims
export const createClaimSchema = z
    .object({
    orderId: z.string(),
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    driverName: z.string().optional(),
    itemDescription: z.string().optional(),
    declaredValueInr: z.number().nonnegative().optional(),
    claimedAmountInr: z.number().positive(),
    pickupPhotos: z.array(z.string()).default([]),
    dropPhotos: z.array(z.string()).default([]),
    photos: z.array(z.string()).optional(),
    description: z.string().min(5, 'Description is required'),
    category: z.string().optional(),
})
    .transform((data) => ({
    ...data,
    customerName: data.customerName || 'Customer',
    customerPhone: data.customerPhone || '9879011223',
    driverName: data.driverName || 'Delivery Partner',
    itemDescription: data.itemDescription || 'Delivered item',
    declaredValueInr: data.declaredValueInr ?? 1000,
    dropPhotos: data.dropPhotos.length ? data.dropPhotos : (data.photos || []),
}));
export const resolveClaimSchema = z.object({
    approvedCompensationInr: z.number().nonnegative(),
    resolutionNotes: z.string().min(3, 'Resolution notes required'),
});
// Support
export const createTicketSchema = z.object({
    orderId: z.string().optional(),
    userId: z.string(),
    userRole: z.enum(['customer', 'driver', 'admin', 'receiver']),
    userName: z.string(),
    userPhone: z.string(),
    subject: z.string().min(3, 'Subject required'),
    category: z.string().min(2, 'Category required'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    message: z.string().optional(),
});
export const addMessageSchema = z.object({
    text: z.string().min(1, 'Message text required'),
    sender: z.enum(['user', 'agent']),
    senderName: z.string(),
});
// Drivers
export const driverOnboardingSchema = z.object({
    name: z.string().min(2),
    phone: phoneSchema,
    email: z.string().email(),
    vehicleType: vehicleTypeSchema,
    vehicleNumber: z.string().min(5),
    vehicleModel: z.string().optional(),
    documents: z
        .object({
        dlNumber: z.string().optional(),
        dlExpiry: z.string().optional(),
        dlFront: z.string().optional(),
        dlBack: z.string().optional(),
        aadhaarLast4: z.string().optional(),
        aadhaarFront: z.string().optional(),
        rcNumber: z.string().optional(),
        rcFront: z.string().optional(),
        selfie: z.string().optional(),
    })
        .optional(),
});
export const driverVerificationSchema = z.object({
    status: z.enum(['approved', 'rejected', 'suspended']),
    docType: z.enum(['licence', 'aadhaar', 'rc', 'selfie']).optional(),
    reason: z.string().optional(),
});
//# sourceMappingURL=schemas.js.map