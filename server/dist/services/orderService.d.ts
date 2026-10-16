export declare function createOrder(payload: any): Promise<{
    id: any;
    trackingToken: any;
    createdAt: any;
    updatedAt: any;
    status: any;
    customer: {
        id: any;
        name: any;
        phone: any;
    };
    sender: {
        name: any;
        phone: any;
    };
    receiver: {
        name: any;
        phone: any;
    };
    pickupAddress: any;
    dropAddress: any;
    item: any;
    vehicleType: any;
    helpersCount: any;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    scheduledTime: any;
    returnToSenderIfFailed: boolean;
    fare: any;
    paymentMethod: any;
    paymentStatus: any;
    payer: any;
    pickupOtp: any;
    dropOtp: any;
    assignedDriver: {
        id: any;
        name: any;
        phone: any;
        avatar: any;
        vehicleNumber: any;
        vehicleModel: any;
        vehicleType: any;
        rating: number;
        totalTrips: number;
        currentCoords: {
            lat: number;
            lng: number;
        };
    } | undefined;
    proofs: {
        pickupOtpVerified: boolean;
        pickupOtpEnteredAt: any;
        pickupSenderNameConfirmed: boolean;
        pickupProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "pickup";
            notes: any;
        }[];
        pickupCustomerApproved: boolean;
        dropOtpVerified: boolean;
        dropOtpEnteredAt: any;
        dropReceiverNameConfirmed: boolean;
        dropProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "drop";
            notes: any;
        }[];
        dropReceiverAcknowledged: boolean;
        dropIssueReported: any;
        cashCollectedConfirmed: boolean;
        cashAmountCollected: any;
    };
    timeline: {
        status: any;
        timestamp: any;
        note: any;
    }[];
    driverRating: {
        stars: any;
        comment: any;
        tipInr: any;
        createdAt: any;
    } | undefined;
    rescheduleRequest: {
        requestedBy: any;
        newDate: any;
        newTimeSlot: any;
        status: any;
    } | undefined;
    isDelayed: boolean;
    lastKnownLocation: {
        lat: number;
        lng: number;
    } | undefined;
    cancelReason: any;
} | null>;
export declare function getOrders(filter: {
    status?: string;
    customerId?: string;
    driverId?: string;
    search?: string;
}): Promise<any[]>;
export declare function getOrderById(orderId: string): Promise<{
    id: any;
    trackingToken: any;
    createdAt: any;
    updatedAt: any;
    status: any;
    customer: {
        id: any;
        name: any;
        phone: any;
    };
    sender: {
        name: any;
        phone: any;
    };
    receiver: {
        name: any;
        phone: any;
    };
    pickupAddress: any;
    dropAddress: any;
    item: any;
    vehicleType: any;
    helpersCount: any;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    scheduledTime: any;
    returnToSenderIfFailed: boolean;
    fare: any;
    paymentMethod: any;
    paymentStatus: any;
    payer: any;
    pickupOtp: any;
    dropOtp: any;
    assignedDriver: {
        id: any;
        name: any;
        phone: any;
        avatar: any;
        vehicleNumber: any;
        vehicleModel: any;
        vehicleType: any;
        rating: number;
        totalTrips: number;
        currentCoords: {
            lat: number;
            lng: number;
        };
    } | undefined;
    proofs: {
        pickupOtpVerified: boolean;
        pickupOtpEnteredAt: any;
        pickupSenderNameConfirmed: boolean;
        pickupProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "pickup";
            notes: any;
        }[];
        pickupCustomerApproved: boolean;
        dropOtpVerified: boolean;
        dropOtpEnteredAt: any;
        dropReceiverNameConfirmed: boolean;
        dropProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "drop";
            notes: any;
        }[];
        dropReceiverAcknowledged: boolean;
        dropIssueReported: any;
        cashCollectedConfirmed: boolean;
        cashAmountCollected: any;
    };
    timeline: {
        status: any;
        timestamp: any;
        note: any;
    }[];
    driverRating: {
        stars: any;
        comment: any;
        tipInr: any;
        createdAt: any;
    } | undefined;
    rescheduleRequest: {
        requestedBy: any;
        newDate: any;
        newTimeSlot: any;
        status: any;
    } | undefined;
    isDelayed: boolean;
    lastKnownLocation: {
        lat: number;
        lng: number;
    } | undefined;
    cancelReason: any;
} | null>;
export declare function getOrderByToken(token: string): Promise<{
    id: any;
    trackingToken: any;
    createdAt: any;
    updatedAt: any;
    status: any;
    customer: {
        id: any;
        name: any;
        phone: any;
    };
    sender: {
        name: any;
        phone: any;
    };
    receiver: {
        name: any;
        phone: any;
    };
    pickupAddress: any;
    dropAddress: any;
    item: any;
    vehicleType: any;
    helpersCount: any;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    scheduledTime: any;
    returnToSenderIfFailed: boolean;
    fare: any;
    paymentMethod: any;
    paymentStatus: any;
    payer: any;
    pickupOtp: any;
    dropOtp: any;
    assignedDriver: {
        id: any;
        name: any;
        phone: any;
        avatar: any;
        vehicleNumber: any;
        vehicleModel: any;
        vehicleType: any;
        rating: number;
        totalTrips: number;
        currentCoords: {
            lat: number;
            lng: number;
        };
    } | undefined;
    proofs: {
        pickupOtpVerified: boolean;
        pickupOtpEnteredAt: any;
        pickupSenderNameConfirmed: boolean;
        pickupProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "pickup";
            notes: any;
        }[];
        pickupCustomerApproved: boolean;
        dropOtpVerified: boolean;
        dropOtpEnteredAt: any;
        dropReceiverNameConfirmed: boolean;
        dropProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "drop";
            notes: any;
        }[];
        dropReceiverAcknowledged: boolean;
        dropIssueReported: any;
        cashCollectedConfirmed: boolean;
        cashAmountCollected: any;
    };
    timeline: {
        status: any;
        timestamp: any;
        note: any;
    }[];
    driverRating: {
        stars: any;
        comment: any;
        tipInr: any;
        createdAt: any;
    } | undefined;
    rescheduleRequest: {
        requestedBy: any;
        newDate: any;
        newTimeSlot: any;
        status: any;
    } | undefined;
    isDelayed: boolean;
    lastKnownLocation: {
        lat: number;
        lng: number;
    } | undefined;
    cancelReason: any;
} | null>;
export declare function updateOrderStatus(orderId: string, status: string, note?: string): Promise<{
    id: any;
    trackingToken: any;
    createdAt: any;
    updatedAt: any;
    status: any;
    customer: {
        id: any;
        name: any;
        phone: any;
    };
    sender: {
        name: any;
        phone: any;
    };
    receiver: {
        name: any;
        phone: any;
    };
    pickupAddress: any;
    dropAddress: any;
    item: any;
    vehicleType: any;
    helpersCount: any;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    scheduledTime: any;
    returnToSenderIfFailed: boolean;
    fare: any;
    paymentMethod: any;
    paymentStatus: any;
    payer: any;
    pickupOtp: any;
    dropOtp: any;
    assignedDriver: {
        id: any;
        name: any;
        phone: any;
        avatar: any;
        vehicleNumber: any;
        vehicleModel: any;
        vehicleType: any;
        rating: number;
        totalTrips: number;
        currentCoords: {
            lat: number;
            lng: number;
        };
    } | undefined;
    proofs: {
        pickupOtpVerified: boolean;
        pickupOtpEnteredAt: any;
        pickupSenderNameConfirmed: boolean;
        pickupProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "pickup";
            notes: any;
        }[];
        pickupCustomerApproved: boolean;
        dropOtpVerified: boolean;
        dropOtpEnteredAt: any;
        dropReceiverNameConfirmed: boolean;
        dropProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "drop";
            notes: any;
        }[];
        dropReceiverAcknowledged: boolean;
        dropIssueReported: any;
        cashCollectedConfirmed: boolean;
        cashAmountCollected: any;
    };
    timeline: {
        status: any;
        timestamp: any;
        note: any;
    }[];
    driverRating: {
        stars: any;
        comment: any;
        tipInr: any;
        createdAt: any;
    } | undefined;
    rescheduleRequest: {
        requestedBy: any;
        newDate: any;
        newTimeSlot: any;
        status: any;
    } | undefined;
    isDelayed: boolean;
    lastKnownLocation: {
        lat: number;
        lng: number;
    } | undefined;
    cancelReason: any;
} | null>;
export declare function assignDriver(orderId: string, driverId: string): Promise<{
    id: any;
    trackingToken: any;
    createdAt: any;
    updatedAt: any;
    status: any;
    customer: {
        id: any;
        name: any;
        phone: any;
    };
    sender: {
        name: any;
        phone: any;
    };
    receiver: {
        name: any;
        phone: any;
    };
    pickupAddress: any;
    dropAddress: any;
    item: any;
    vehicleType: any;
    helpersCount: any;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    isScheduled: boolean;
    scheduledTime: any;
    returnToSenderIfFailed: boolean;
    fare: any;
    paymentMethod: any;
    paymentStatus: any;
    payer: any;
    pickupOtp: any;
    dropOtp: any;
    assignedDriver: {
        id: any;
        name: any;
        phone: any;
        avatar: any;
        vehicleNumber: any;
        vehicleModel: any;
        vehicleType: any;
        rating: number;
        totalTrips: number;
        currentCoords: {
            lat: number;
            lng: number;
        };
    } | undefined;
    proofs: {
        pickupOtpVerified: boolean;
        pickupOtpEnteredAt: any;
        pickupSenderNameConfirmed: boolean;
        pickupProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "pickup";
            notes: any;
        }[];
        pickupCustomerApproved: boolean;
        dropOtpVerified: boolean;
        dropOtpEnteredAt: any;
        dropReceiverNameConfirmed: boolean;
        dropProofs: {
            id: any;
            type: any;
            url: any;
            timestamp: any;
            stage: "drop";
            notes: any;
        }[];
        dropReceiverAcknowledged: boolean;
        dropIssueReported: any;
        cashCollectedConfirmed: boolean;
        cashAmountCollected: any;
    };
    timeline: {
        status: any;
        timestamp: any;
        note: any;
    }[];
    driverRating: {
        stars: any;
        comment: any;
        tipInr: any;
        createdAt: any;
    } | undefined;
    rescheduleRequest: {
        requestedBy: any;
        newDate: any;
        newTimeSlot: any;
        status: any;
    } | undefined;
    isDelayed: boolean;
    lastKnownLocation: {
        lat: number;
        lng: number;
    } | undefined;
    cancelReason: any;
} | null>;
export declare function verifyPickupOtp(orderId: string, enteredOtp: string): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export declare function confirmPickupSender(orderId: string): Promise<{
    success: boolean;
}>;
export declare function addProof(orderId: string, stage: 'pickup' | 'drop', proof: {
    type: 'photo' | 'video';
    url: string;
    notes?: string;
}): Promise<{
    success: boolean;
    proofId: string;
}>;
export declare function approvePickupCustomer(orderId: string): Promise<{
    success: boolean;
}>;
export declare function startTripInTransit(orderId: string): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export declare function verifyDropOtp(orderId: string, enteredOtp: string): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export declare function confirmDropReceiver(orderId: string): Promise<{
    success: boolean;
}>;
export declare function acknowledgeDropReceiver(orderId: string, issueNote?: string): Promise<{
    success: boolean;
}>;
export declare function confirmCashCollection(orderId: string, amount: number): Promise<{
    success: boolean;
}>;
export declare function completeDelivery(orderId: string): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export declare function cancelOrder(orderId: string, reason: string): Promise<{
    success: boolean;
    error: string;
} | {
    success: boolean;
    error?: undefined;
}>;
export declare function rateOrder(orderId: string, stars: number, comment?: string, tipInr?: number): Promise<{
    success: boolean;
}>;
export declare function requestReschedule(orderId: string, requestedBy: 'receiver' | 'customer', newDate: string, newTimeSlot: string): Promise<{
    success: boolean;
}>;
export declare function approveReschedule(orderId: string): Promise<{
    success: boolean;
}>;
export declare function verifyReceiverByPhone(token: string, phoneLast4: string): Promise<{
    success: boolean;
    error: string;
    unlocked?: undefined;
    dropOtp?: undefined;
} | {
    success: boolean;
    unlocked: boolean;
    dropOtp: any;
    error?: undefined;
}>;
