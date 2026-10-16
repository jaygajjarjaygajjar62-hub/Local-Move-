export declare const DEMO_PROMO_CODES: Record<string, {
    discountPercent: number;
    maxDiscount: number;
    minOrderValue: number;
}>;
export declare const VEHICLE_OPTIONS: Record<string, {
    baseFare: number;
    perKmRate: number;
    minDistanceKm: number;
    capacityWeightKg: number;
}>;
export declare function getPricingConfig(city?: string): Promise<any>;
export declare function updatePricingConfig(newConfig: any): Promise<any>;
export declare function calculateFare(params: {
    distanceKm: number;
    vehicleType: string;
    item: {
        category: string;
        description: string;
        quantity: number;
        approxWeightKg: number;
        declaredValueInr: number;
    };
    helperCount: number;
    hasPackingService: boolean;
    hasItemProtection: boolean;
    promoCode?: string;
    applyWalletBalance?: number;
    isNightHours?: boolean;
}): Promise<{
    baseFare: any;
    distanceKm: number;
    distanceCharge: number;
    includedKm: any;
    additionalKm: number;
    perKmRate: any;
    handlingFee: any;
    helperCount: number;
    helperCharge: number;
    packingCharge: any;
    itemProtectionFee: number;
    weightSurcharge: number;
    nightSurgeAdjustment: number;
    subtotal: any;
    taxesGst: number;
    discount: number;
    promoCodeApplied: string | undefined;
    walletDeduction: number;
    totalCustomerFare: number;
    driverShare: number;
    companyShare: number;
    isEstimate: boolean;
    estimatedDurationMin: number;
}>;
