import { z } from 'zod';
export declare const phoneSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
export declare const otpSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
export declare const coordsSchema: z.ZodObject<{
    lat: z.ZodNumber;
    lng: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lat: number;
    lng: number;
}, {
    lat: number;
    lng: number;
}>;
export declare const addressSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    fullAddress: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    landmark: z.ZodOptional<z.ZodString>;
    floor: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    city: z.ZodDefault<z.ZodString>;
    coords: z.ZodObject<{
        lat: z.ZodNumber;
        lng: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lat: number;
        lng: number;
    }, {
        lat: number;
        lng: number;
    }>;
}, "strip", z.ZodTypeAny, {
    city: string;
    coords: {
        lat: number;
        lng: number;
    };
    id?: string | undefined;
    title?: string | undefined;
    fullAddress?: string | undefined;
    address?: string | undefined;
    landmark?: string | undefined;
    floor?: string | undefined;
    instructions?: string | undefined;
}, {
    coords: {
        lat: number;
        lng: number;
    };
    id?: string | undefined;
    title?: string | undefined;
    fullAddress?: string | undefined;
    address?: string | undefined;
    landmark?: string | undefined;
    floor?: string | undefined;
    instructions?: string | undefined;
    city?: string | undefined;
}>, {
    fullAddress: string;
    city: string;
    coords: {
        lat: number;
        lng: number;
    };
    id?: string | undefined;
    title?: string | undefined;
    address?: string | undefined;
    landmark?: string | undefined;
    floor?: string | undefined;
    instructions?: string | undefined;
}, {
    coords: {
        lat: number;
        lng: number;
    };
    id?: string | undefined;
    title?: string | undefined;
    fullAddress?: string | undefined;
    address?: string | undefined;
    landmark?: string | undefined;
    floor?: string | undefined;
    instructions?: string | undefined;
    city?: string | undefined;
}>;
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
}, {
    name: string;
    phone: string;
}>;
export declare const vehicleTypeSchema: z.ZodEnum<["bike", "cargo_auto", "mini_truck", "large_tempo", "truck_eicher"]>;
export declare const itemCategorySchema: z.ZodEnum<["documents", "electronics", "groceries", "clothes", "furniture", "appliances", "household_shifting", "other"]>;
export declare const itemSizeSchema: z.ZodEnum<["small", "medium", "large", "xlarge"]>;
export declare const handlingTagSchema: z.ZodEnum<["fragile", "keep_upright", "liquid", "needs_two_people", "stairs_carry"]>;
export declare const orderItemSchema: z.ZodObject<{
    category: z.ZodEnum<["documents", "electronics", "groceries", "clothes", "furniture", "appliances", "household_shifting", "other"]>;
    description: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
    size: z.ZodEnum<["small", "medium", "large", "xlarge"]>;
    dimensions: z.ZodOptional<z.ZodObject<{
        length: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        length?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        length?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }>>;
    approxWeightKg: z.ZodNumber;
    declaredValueInr: z.ZodDefault<z.ZodNumber>;
    handlingTags: z.ZodDefault<z.ZodArray<z.ZodEnum<["fragile", "keep_upright", "liquid", "needs_two_people", "stairs_carry"]>, "many">>;
    customerPhotos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
    description: string;
    quantity: number;
    size: "small" | "medium" | "large" | "xlarge";
    approxWeightKg: number;
    declaredValueInr: number;
    handlingTags: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[];
    customerPhotos: string[];
    dimensions?: {
        length?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
}, {
    category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
    description: string;
    size: "small" | "medium" | "large" | "xlarge";
    approxWeightKg: number;
    quantity?: number | undefined;
    dimensions?: {
        length?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    } | undefined;
    declaredValueInr?: number | undefined;
    handlingTags?: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[] | undefined;
    customerPhotos?: string[] | undefined;
}>;
export declare const paymentMethodSchema: z.ZodEnum<["cash", "upi", "card", "wallet", "receiver_pays"]>;
export declare const payerSchema: z.ZodEnum<["sender", "receiver"]>;
export declare const customerLoginSchema: z.ZodObject<{
    phone: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    name: z.ZodOptional<z.ZodString>;
    otp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name?: string | undefined;
    otp?: string | undefined;
}, {
    phone: string;
    name?: string | undefined;
    otp?: string | undefined;
}>;
export declare const driverLoginSchema: z.ZodObject<{
    phone: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    otp: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    otp?: string | undefined;
}, {
    phone: string;
    otp?: string | undefined;
}>;
export declare const createOrderSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    trackingToken: z.ZodOptional<z.ZodString>;
    customer: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    }>>;
    customerId: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    customerPhone: z.ZodOptional<z.ZodString>;
    sender: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
    }, {
        name: string;
        phone: string;
    }>>;
    receiver: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        phone: string;
    }, {
        name: string;
        phone: string;
    }>>;
    receiverName: z.ZodOptional<z.ZodString>;
    receiverPhone: z.ZodOptional<z.ZodString>;
    pickupAddress: z.ZodEffects<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        fullAddress: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        landmark: z.ZodOptional<z.ZodString>;
        floor: z.ZodOptional<z.ZodString>;
        instructions: z.ZodOptional<z.ZodString>;
        city: z.ZodDefault<z.ZodString>;
        coords: z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            lat: number;
            lng: number;
        }, {
            lat: number;
            lng: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    }, {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    }>, {
        fullAddress: string;
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    }, {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    }>;
    dropAddress: z.ZodEffects<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        fullAddress: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        landmark: z.ZodOptional<z.ZodString>;
        floor: z.ZodOptional<z.ZodString>;
        instructions: z.ZodOptional<z.ZodString>;
        city: z.ZodDefault<z.ZodString>;
        coords: z.ZodObject<{
            lat: z.ZodNumber;
            lng: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            lat: number;
            lng: number;
        }, {
            lat: number;
            lng: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    }, {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    }>, {
        fullAddress: string;
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    }, {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    }>;
    item: z.ZodOptional<z.ZodObject<{
        category: z.ZodEnum<["documents", "electronics", "groceries", "clothes", "furniture", "appliances", "household_shifting", "other"]>;
        description: z.ZodString;
        quantity: z.ZodDefault<z.ZodNumber>;
        size: z.ZodEnum<["small", "medium", "large", "xlarge"]>;
        dimensions: z.ZodOptional<z.ZodObject<{
            length: z.ZodOptional<z.ZodNumber>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }, {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }>>;
        approxWeightKg: z.ZodNumber;
        declaredValueInr: z.ZodDefault<z.ZodNumber>;
        handlingTags: z.ZodDefault<z.ZodArray<z.ZodEnum<["fragile", "keep_upright", "liquid", "needs_two_people", "stairs_carry"]>, "many">>;
        customerPhotos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        quantity: number;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        declaredValueInr: number;
        handlingTags: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[];
        customerPhotos: string[];
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    }, {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        quantity?: number | undefined;
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        declaredValueInr?: number | undefined;
        handlingTags?: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[] | undefined;
        customerPhotos?: string[] | undefined;
    }>>;
    category: z.ZodOptional<z.ZodString>;
    packageDetails: z.ZodOptional<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        isFragile: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        weightKg?: number | undefined;
        isFragile?: boolean | undefined;
    }, {
        description?: string | undefined;
        weightKg?: number | undefined;
        isFragile?: boolean | undefined;
    }>>;
    vehicleType: z.ZodEnum<["bike", "cargo_auto", "mini_truck", "large_tempo", "truck_eicher"]>;
    helpersCount: z.ZodDefault<z.ZodNumber>;
    hasPackingService: z.ZodDefault<z.ZodBoolean>;
    hasItemProtection: z.ZodDefault<z.ZodBoolean>;
    isScheduled: z.ZodDefault<z.ZodBoolean>;
    scheduledTime: z.ZodOptional<z.ZodString>;
    returnToSenderIfFailed: z.ZodDefault<z.ZodBoolean>;
    paymentMethod: z.ZodEnum<["cash", "upi", "card", "wallet", "receiver_pays"]>;
    paymentStatus: z.ZodOptional<z.ZodString>;
    pickupOtp: z.ZodOptional<z.ZodString>;
    dropOtp: z.ZodOptional<z.ZodString>;
    payer: z.ZodDefault<z.ZodEnum<["sender", "receiver"]>>;
    promoCode: z.ZodOptional<z.ZodString>;
    useWallet: z.ZodOptional<z.ZodBoolean>;
    fare: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    pickupAddress: {
        fullAddress: string;
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    };
    dropAddress: {
        fullAddress: string;
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    };
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    helpersCount: number;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    returnToSenderIfFailed: boolean;
    paymentMethod: "cash" | "upi" | "card" | "wallet" | "receiver_pays";
    payer: "sender" | "receiver";
    customer?: {
        id?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    } | undefined;
    id?: string | undefined;
    category?: string | undefined;
    sender?: {
        name: string;
        phone: string;
    } | undefined;
    receiver?: {
        name: string;
        phone: string;
    } | undefined;
    trackingToken?: string | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    receiverName?: string | undefined;
    receiverPhone?: string | undefined;
    item?: {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        quantity: number;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        declaredValueInr: number;
        handlingTags: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[];
        customerPhotos: string[];
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    } | undefined;
    packageDetails?: {
        description?: string | undefined;
        weightKg?: number | undefined;
        isFragile?: boolean | undefined;
    } | undefined;
    scheduledTime?: string | undefined;
    paymentStatus?: string | undefined;
    pickupOtp?: string | undefined;
    dropOtp?: string | undefined;
    promoCode?: string | undefined;
    useWallet?: boolean | undefined;
    fare?: any;
}, {
    pickupAddress: {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    };
    dropAddress: {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    };
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    paymentMethod: "cash" | "upi" | "card" | "wallet" | "receiver_pays";
    customer?: {
        id?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    } | undefined;
    id?: string | undefined;
    category?: string | undefined;
    sender?: {
        name: string;
        phone: string;
    } | undefined;
    receiver?: {
        name: string;
        phone: string;
    } | undefined;
    trackingToken?: string | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    receiverName?: string | undefined;
    receiverPhone?: string | undefined;
    item?: {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        quantity?: number | undefined;
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        declaredValueInr?: number | undefined;
        handlingTags?: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[] | undefined;
        customerPhotos?: string[] | undefined;
    } | undefined;
    packageDetails?: {
        description?: string | undefined;
        weightKg?: number | undefined;
        isFragile?: boolean | undefined;
    } | undefined;
    helpersCount?: number | undefined;
    hasPackingService?: boolean | undefined;
    hasItemProtection?: boolean | undefined;
    isScheduled?: boolean | undefined;
    scheduledTime?: string | undefined;
    returnToSenderIfFailed?: boolean | undefined;
    paymentStatus?: string | undefined;
    pickupOtp?: string | undefined;
    dropOtp?: string | undefined;
    payer?: "sender" | "receiver" | undefined;
    promoCode?: string | undefined;
    useWallet?: boolean | undefined;
    fare?: any;
}>, {
    customer: {
        id: string;
        name: string;
        phone: string;
    };
    sender: {
        name: string;
        phone: string;
    };
    receiver: {
        name: string;
        phone: string;
    };
    item: {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        quantity: number;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        declaredValueInr: number;
        handlingTags: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[];
        customerPhotos: string[];
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    } | {
        category: any;
        description: string;
        quantity: number;
        size: "medium";
        approxWeightKg: number;
        declaredValueInr: number;
        handlingTags: any;
        customerPhotos: never[];
    };
    pickupAddress: {
        fullAddress: string;
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    };
    dropAddress: {
        fullAddress: string;
        city: string;
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
    };
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    helpersCount: number;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    returnToSenderIfFailed: boolean;
    paymentMethod: "cash" | "upi" | "card" | "wallet" | "receiver_pays";
    payer: "sender" | "receiver";
    id?: string | undefined;
    category?: string | undefined;
    trackingToken?: string | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    receiverName?: string | undefined;
    receiverPhone?: string | undefined;
    packageDetails?: {
        description?: string | undefined;
        weightKg?: number | undefined;
        isFragile?: boolean | undefined;
    } | undefined;
    scheduledTime?: string | undefined;
    paymentStatus?: string | undefined;
    pickupOtp?: string | undefined;
    dropOtp?: string | undefined;
    promoCode?: string | undefined;
    useWallet?: boolean | undefined;
    fare?: any;
}, {
    pickupAddress: {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    };
    dropAddress: {
        coords: {
            lat: number;
            lng: number;
        };
        id?: string | undefined;
        title?: string | undefined;
        fullAddress?: string | undefined;
        address?: string | undefined;
        landmark?: string | undefined;
        floor?: string | undefined;
        instructions?: string | undefined;
        city?: string | undefined;
    };
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    paymentMethod: "cash" | "upi" | "card" | "wallet" | "receiver_pays";
    customer?: {
        id?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
    } | undefined;
    id?: string | undefined;
    category?: string | undefined;
    sender?: {
        name: string;
        phone: string;
    } | undefined;
    receiver?: {
        name: string;
        phone: string;
    } | undefined;
    trackingToken?: string | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    receiverName?: string | undefined;
    receiverPhone?: string | undefined;
    item?: {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        quantity?: number | undefined;
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        declaredValueInr?: number | undefined;
        handlingTags?: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[] | undefined;
        customerPhotos?: string[] | undefined;
    } | undefined;
    packageDetails?: {
        description?: string | undefined;
        weightKg?: number | undefined;
        isFragile?: boolean | undefined;
    } | undefined;
    helpersCount?: number | undefined;
    hasPackingService?: boolean | undefined;
    hasItemProtection?: boolean | undefined;
    isScheduled?: boolean | undefined;
    scheduledTime?: string | undefined;
    returnToSenderIfFailed?: boolean | undefined;
    paymentStatus?: string | undefined;
    pickupOtp?: string | undefined;
    dropOtp?: string | undefined;
    payer?: "sender" | "receiver" | undefined;
    promoCode?: string | undefined;
    useWallet?: boolean | undefined;
    fare?: any;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["created", "searching_driver", "driver_assigned", "arrived_at_pickup", "picked_up", "in_transit", "arrived_at_drop", "delivered", "completed", "cancelled", "failed_returned", "under_dispute"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "created" | "searching_driver" | "driver_assigned" | "arrived_at_pickup" | "picked_up" | "in_transit" | "arrived_at_drop" | "delivered" | "completed" | "cancelled" | "failed_returned" | "under_dispute";
    note?: string | undefined;
}, {
    status: "created" | "searching_driver" | "driver_assigned" | "arrived_at_pickup" | "picked_up" | "in_transit" | "arrived_at_drop" | "delivered" | "completed" | "cancelled" | "failed_returned" | "under_dispute";
    note?: string | undefined;
}>;
export declare const cancelOrderSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export declare const rateOrderSchema: z.ZodObject<{
    stars: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    tipInr: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    stars: number;
    tipInr: number;
    comment?: string | undefined;
}, {
    stars: number;
    comment?: string | undefined;
    tipInr?: number | undefined;
}>;
export declare const rescheduleRequestSchema: z.ZodObject<{
    requestedBy: z.ZodEnum<["receiver", "customer"]>;
    newDate: z.ZodString;
    newTimeSlot: z.ZodString;
}, "strip", z.ZodTypeAny, {
    requestedBy: "customer" | "receiver";
    newDate: string;
    newTimeSlot: string;
}, {
    requestedBy: "customer" | "receiver";
    newDate: string;
    newTimeSlot: string;
}>;
export declare const verifyReceiverSchema: z.ZodObject<{
    phoneLast4: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    phoneLast4: string;
}, {
    phoneLast4?: string | undefined;
}>;
export declare const calculateFareSchema: z.ZodObject<{
    distanceKm: z.ZodNumber;
    vehicleType: z.ZodEnum<["bike", "cargo_auto", "mini_truck", "large_tempo", "truck_eicher"]>;
    item: z.ZodObject<{
        category: z.ZodEnum<["documents", "electronics", "groceries", "clothes", "furniture", "appliances", "household_shifting", "other"]>;
        description: z.ZodString;
        quantity: z.ZodDefault<z.ZodNumber>;
        size: z.ZodEnum<["small", "medium", "large", "xlarge"]>;
        dimensions: z.ZodOptional<z.ZodObject<{
            length: z.ZodOptional<z.ZodNumber>;
            width: z.ZodOptional<z.ZodNumber>;
            height: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }, {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        }>>;
        approxWeightKg: z.ZodNumber;
        declaredValueInr: z.ZodDefault<z.ZodNumber>;
        handlingTags: z.ZodDefault<z.ZodArray<z.ZodEnum<["fragile", "keep_upright", "liquid", "needs_two_people", "stairs_carry"]>, "many">>;
        customerPhotos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        quantity: number;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        declaredValueInr: number;
        handlingTags: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[];
        customerPhotos: string[];
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    }, {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        quantity?: number | undefined;
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        declaredValueInr?: number | undefined;
        handlingTags?: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[] | undefined;
        customerPhotos?: string[] | undefined;
    }>;
    helperCount: z.ZodDefault<z.ZodNumber>;
    hasPackingService: z.ZodDefault<z.ZodBoolean>;
    hasItemProtection: z.ZodDefault<z.ZodBoolean>;
    promoCode: z.ZodOptional<z.ZodString>;
    applyWalletBalance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    isNightHours: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    item: {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        quantity: number;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        declaredValueInr: number;
        handlingTags: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[];
        customerPhotos: string[];
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
    };
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    hasPackingService: boolean;
    hasItemProtection: boolean;
    distanceKm: number;
    helperCount: number;
    applyWalletBalance: number;
    isNightHours: boolean;
    promoCode?: string | undefined;
}, {
    item: {
        category: "documents" | "electronics" | "groceries" | "clothes" | "furniture" | "appliances" | "household_shifting" | "other";
        description: string;
        size: "small" | "medium" | "large" | "xlarge";
        approxWeightKg: number;
        quantity?: number | undefined;
        dimensions?: {
            length?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
        } | undefined;
        declaredValueInr?: number | undefined;
        handlingTags?: ("fragile" | "keep_upright" | "liquid" | "needs_two_people" | "stairs_carry")[] | undefined;
        customerPhotos?: string[] | undefined;
    };
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    distanceKm: number;
    hasPackingService?: boolean | undefined;
    hasItemProtection?: boolean | undefined;
    promoCode?: string | undefined;
    helperCount?: number | undefined;
    applyWalletBalance?: number | undefined;
    isNightHours?: boolean | undefined;
}>;
export declare const walletTopUpSchema: z.ZodObject<{
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
}, {
    amount: number;
}>;
export declare const walletDeductSchema: z.ZodObject<{
    amount: z.ZodNumber;
    orderId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    orderId?: string | undefined;
}, {
    amount: number;
    orderId?: string | undefined;
}>;
export declare const createClaimSchema: z.ZodEffects<z.ZodObject<{
    orderId: z.ZodString;
    customerId: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    customerPhone: z.ZodOptional<z.ZodString>;
    driverName: z.ZodOptional<z.ZodString>;
    itemDescription: z.ZodOptional<z.ZodString>;
    declaredValueInr: z.ZodOptional<z.ZodNumber>;
    claimedAmountInr: z.ZodNumber;
    pickupPhotos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    dropPhotos: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    photos: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    orderId: string;
    claimedAmountInr: number;
    pickupPhotos: string[];
    dropPhotos: string[];
    category?: string | undefined;
    declaredValueInr?: number | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    driverName?: string | undefined;
    itemDescription?: string | undefined;
    photos?: string[] | undefined;
}, {
    description: string;
    orderId: string;
    claimedAmountInr: number;
    category?: string | undefined;
    declaredValueInr?: number | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    driverName?: string | undefined;
    itemDescription?: string | undefined;
    pickupPhotos?: string[] | undefined;
    dropPhotos?: string[] | undefined;
    photos?: string[] | undefined;
}>, {
    customerName: string;
    customerPhone: string;
    driverName: string;
    itemDescription: string;
    declaredValueInr: number;
    dropPhotos: string[];
    description: string;
    orderId: string;
    claimedAmountInr: number;
    pickupPhotos: string[];
    category?: string | undefined;
    customerId?: string | undefined;
    photos?: string[] | undefined;
}, {
    description: string;
    orderId: string;
    claimedAmountInr: number;
    category?: string | undefined;
    declaredValueInr?: number | undefined;
    customerId?: string | undefined;
    customerName?: string | undefined;
    customerPhone?: string | undefined;
    driverName?: string | undefined;
    itemDescription?: string | undefined;
    pickupPhotos?: string[] | undefined;
    dropPhotos?: string[] | undefined;
    photos?: string[] | undefined;
}>;
export declare const resolveClaimSchema: z.ZodObject<{
    approvedCompensationInr: z.ZodNumber;
    resolutionNotes: z.ZodString;
}, "strip", z.ZodTypeAny, {
    approvedCompensationInr: number;
    resolutionNotes: string;
}, {
    approvedCompensationInr: number;
    resolutionNotes: string;
}>;
export declare const createTicketSchema: z.ZodObject<{
    orderId: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    userRole: z.ZodEnum<["customer", "driver", "admin", "receiver"]>;
    userName: z.ZodString;
    userPhone: z.ZodString;
    subject: z.ZodString;
    category: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: string;
    userId: string;
    userRole: "customer" | "driver" | "receiver" | "admin";
    userName: string;
    userPhone: string;
    subject: string;
    priority: "medium" | "low" | "high" | "urgent";
    message?: string | undefined;
    orderId?: string | undefined;
}, {
    category: string;
    userId: string;
    userRole: "customer" | "driver" | "receiver" | "admin";
    userName: string;
    userPhone: string;
    subject: string;
    message?: string | undefined;
    orderId?: string | undefined;
    priority?: "medium" | "low" | "high" | "urgent" | undefined;
}>;
export declare const addMessageSchema: z.ZodObject<{
    text: z.ZodString;
    sender: z.ZodEnum<["user", "agent"]>;
    senderName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sender: "user" | "agent";
    text: string;
    senderName: string;
}, {
    sender: "user" | "agent";
    text: string;
    senderName: string;
}>;
export declare const driverOnboardingSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    email: z.ZodString;
    vehicleType: z.ZodEnum<["bike", "cargo_auto", "mini_truck", "large_tempo", "truck_eicher"]>;
    vehicleNumber: z.ZodString;
    vehicleModel: z.ZodOptional<z.ZodString>;
    documents: z.ZodOptional<z.ZodObject<{
        dlNumber: z.ZodOptional<z.ZodString>;
        dlExpiry: z.ZodOptional<z.ZodString>;
        dlFront: z.ZodOptional<z.ZodString>;
        dlBack: z.ZodOptional<z.ZodString>;
        aadhaarLast4: z.ZodOptional<z.ZodString>;
        aadhaarFront: z.ZodOptional<z.ZodString>;
        rcNumber: z.ZodOptional<z.ZodString>;
        rcFront: z.ZodOptional<z.ZodString>;
        selfie: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        dlNumber?: string | undefined;
        dlExpiry?: string | undefined;
        dlFront?: string | undefined;
        dlBack?: string | undefined;
        aadhaarLast4?: string | undefined;
        aadhaarFront?: string | undefined;
        rcNumber?: string | undefined;
        rcFront?: string | undefined;
        selfie?: string | undefined;
    }, {
        dlNumber?: string | undefined;
        dlExpiry?: string | undefined;
        dlFront?: string | undefined;
        dlBack?: string | undefined;
        aadhaarLast4?: string | undefined;
        aadhaarFront?: string | undefined;
        rcNumber?: string | undefined;
        rcFront?: string | undefined;
        selfie?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    email: string;
    vehicleNumber: string;
    documents?: {
        dlNumber?: string | undefined;
        dlExpiry?: string | undefined;
        dlFront?: string | undefined;
        dlBack?: string | undefined;
        aadhaarLast4?: string | undefined;
        aadhaarFront?: string | undefined;
        rcNumber?: string | undefined;
        rcFront?: string | undefined;
        selfie?: string | undefined;
    } | undefined;
    vehicleModel?: string | undefined;
}, {
    name: string;
    phone: string;
    vehicleType: "bike" | "cargo_auto" | "mini_truck" | "large_tempo" | "truck_eicher";
    email: string;
    vehicleNumber: string;
    documents?: {
        dlNumber?: string | undefined;
        dlExpiry?: string | undefined;
        dlFront?: string | undefined;
        dlBack?: string | undefined;
        aadhaarLast4?: string | undefined;
        aadhaarFront?: string | undefined;
        rcNumber?: string | undefined;
        rcFront?: string | undefined;
        selfie?: string | undefined;
    } | undefined;
    vehicleModel?: string | undefined;
}>;
export declare const driverVerificationSchema: z.ZodObject<{
    status: z.ZodEnum<["approved", "rejected", "suspended"]>;
    docType: z.ZodOptional<z.ZodEnum<["licence", "aadhaar", "rc", "selfie"]>>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "approved" | "rejected" | "suspended";
    reason?: string | undefined;
    docType?: "selfie" | "licence" | "aadhaar" | "rc" | undefined;
}, {
    status: "approved" | "rejected" | "suspended";
    reason?: string | undefined;
    docType?: "selfie" | "licence" | "aadhaar" | "rc" | undefined;
}>;
