import * as pricingService from '../services/pricingService.js';
export async function calculateFare(req, res, next) {
    try {
        const fare = await pricingService.calculateFare(req.body);
        res.json({ success: true, data: { fare } });
    }
    catch (err) {
        next(err);
    }
}
export async function getPricingConfig(req, res, next) {
    try {
        const city = req.query.city || 'Ahmedabad';
        const config = await pricingService.getPricingConfig(city);
        res.json({ success: true, data: { config } });
    }
    catch (err) {
        next(err);
    }
}
export async function updatePricingConfig(req, res, next) {
    try {
        const config = await pricingService.updatePricingConfig(req.body);
        res.json({ success: true, data: { config } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=pricingController.js.map