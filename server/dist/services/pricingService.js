import { db } from '../config/db.js';
export const DEMO_PROMO_CODES = {
    LOCALMOVE50: { discountPercent: 50, maxDiscount: 50, minOrderValue: 80 },
    FIRSTMOVE: { discountPercent: 20, maxDiscount: 100, minOrderValue: 100 },
    AERA2026: { discountPercent: 15, maxDiscount: 150, minOrderValue: 200 },
};
export const VEHICLE_OPTIONS = {
    bike: { baseFare: 45, perKmRate: 10, minDistanceKm: 2, capacityWeightKg: 20 },
    cargo_auto: { baseFare: 140, perKmRate: 16, minDistanceKm: 2, capacityWeightKg: 500 },
    mini_truck: { baseFare: 280, perKmRate: 22, minDistanceKm: 3, capacityWeightKg: 1000 },
    large_tempo: { baseFare: 520, perKmRate: 28, minDistanceKm: 4, capacityWeightKg: 1750 },
    truck_eicher: { baseFare: 1150, perKmRate: 38, minDistanceKm: 5, capacityWeightKg: 3500 },
};
export async function getPricingConfig(city = 'Ahmedabad') {
    try {
        const result = await db.execute({
            sql: `SELECT config_json FROM pricing_config WHERE city LIKE ? OR is_active = 1 LIMIT 1;`,
            args: [`%${city}%`],
        });
        if (result.rows.length > 0 && result.rows[0].config_json) {
            return JSON.parse(result.rows[0].config_json);
        }
    }
    catch { }
    // Fallback default config
    return {
        city: 'Gujarat Logistics Corridor (Anand • Ahmedabad • Vadodara)',
        vehicles: VEHICLE_OPTIONS,
        handlingFee: 25,
        helperRatePerHelper: 180,
        packingBaseRate: 250,
        itemProtectionRatePercent: 1.5,
        nightSurgeMultiplier: 1.25,
        isSurgeActive: false,
        gstTaxRatePercent: 5,
        driverSharePercent: 80,
        maxDriverCashLimit: 1500,
        freeWaitMinutes: 10,
        waitChargePerMinute: 3,
    };
}
export async function updatePricingConfig(newConfig) {
    try {
        await db.execute({
            sql: `UPDATE pricing_config SET config_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 'cfg-ahmedabad';`,
            args: [JSON.stringify(newConfig)],
        });
    }
    catch { }
    return newConfig;
}
export async function calculateFare(params) {
    const pricingConfig = await getPricingConfig();
    const { distanceKm: rawDistanceKm, vehicleType, item, helperCount, hasPackingService, hasItemProtection, promoCode, applyWalletBalance = 0, isNightHours = false, } = params;
    const vehicleRates = pricingConfig.vehicles[vehicleType] || VEHICLE_OPTIONS[vehicleType] || VEHICLE_OPTIONS.mini_truck;
    const baseFare = vehicleRates.baseFare;
    const perKmRate = vehicleRates.perKmRate;
    const includedKm = vehicleRates.minDistanceKm || 2;
    const distanceKm = Number(Math.max(1.0, rawDistanceKm).toFixed(1));
    const additionalKm = Number(Math.max(0, distanceKm - includedKm).toFixed(1));
    const distanceCharge = Math.round(additionalKm * perKmRate);
    // Weight surcharge if cargo exceeds nominal vehicle capacity
    const maxWeight = vehicleRates.capacityWeightKg || 1000;
    let weightSurcharge = 0;
    if (item.approxWeightKg > maxWeight) {
        weightSurcharge = Math.round((item.approxWeightKg - maxWeight) * 2.5);
    }
    // Tiered handling fee based on vehicle type
    let handlingFee = pricingConfig.handlingFee || 25;
    if (vehicleType === 'bike')
        handlingFee = 15;
    else if (vehicleType === 'cargo_auto')
        handlingFee = 20;
    else if (vehicleType === 'mini_truck')
        handlingFee = 30;
    else if (vehicleType === 'large_tempo')
        handlingFee = 40;
    else if (vehicleType === 'truck_eicher')
        handlingFee = 60;
    const helperCharge = helperCount * (pricingConfig.helperRatePerHelper || 180);
    const packingCharge = hasPackingService ? (pricingConfig.packingBaseRate || 250) : 0;
    let itemProtectionFee = 0;
    if (hasItemProtection && item.declaredValueInr > 0) {
        const rawFee = (item.declaredValueInr * (pricingConfig.itemProtectionRatePercent || 1.5)) / 100;
        itemProtectionFee = Math.max(25, Math.min(500, Math.round(rawFee)));
    }
    const transportSubtotal = baseFare + distanceCharge + weightSurcharge;
    const servicesSubtotal = handlingFee + helperCharge + packingCharge + itemProtectionFee;
    const rawSubtotal = transportSubtotal + servicesSubtotal;
    let nightSurgeAdjustment = 0;
    if (isNightHours || pricingConfig.isSurgeActive) {
        nightSurgeAdjustment = Math.round(transportSubtotal * ((pricingConfig.nightSurgeMultiplier || 1.25) - 1));
    }
    const subtotalWithSurge = rawSubtotal + nightSurgeAdjustment;
    let discount = 0;
    let promoCodeApplied;
    if (promoCode) {
        const cleanedCode = promoCode.trim().toUpperCase();
        const promo = DEMO_PROMO_CODES[cleanedCode];
        if (promo && subtotalWithSurge >= promo.minOrderValue) {
            discount = Math.min(promo.maxDiscount, Math.round((subtotalWithSurge * promo.discountPercent) / 100));
            promoCodeApplied = cleanedCode;
        }
    }
    const taxableAmount = Math.max(0, subtotalWithSurge - discount);
    const taxesGst = Math.round((taxableAmount * (pricingConfig.gstTaxRatePercent || 5)) / 100);
    const grossTotal = taxableAmount + taxesGst;
    const walletDeduction = Math.min(applyWalletBalance, grossTotal);
    const totalCustomerFare = Math.max(0, grossTotal - walletDeduction);
    const driverShare = Math.round((subtotalWithSurge * (pricingConfig.driverSharePercent || 80)) / 100);
    const companyShare = Math.max(0, grossTotal - driverShare);
    const avgSpeed = vehicleType === 'bike' ? 32 : vehicleType === 'cargo_auto' ? 26 : 24;
    const estimatedDurationMin = Math.max(5, Math.round((distanceKm / avgSpeed) * 60) + 8);
    return {
        baseFare,
        distanceKm,
        distanceCharge,
        includedKm,
        additionalKm,
        perKmRate,
        handlingFee,
        helperCount,
        helperCharge,
        packingCharge,
        itemProtectionFee,
        weightSurcharge,
        nightSurgeAdjustment,
        subtotal: subtotalWithSurge,
        taxesGst,
        discount,
        promoCodeApplied,
        walletDeduction,
        totalCustomerFare,
        driverShare,
        companyShare,
        isEstimate: true,
        estimatedDurationMin,
    };
}
//# sourceMappingURL=pricingService.js.map