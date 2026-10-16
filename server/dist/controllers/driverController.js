import * as driverService from '../services/driverService.js';
export async function getDrivers(req, res, next) {
    try {
        const { status, isOnline, vehicleType } = req.query;
        const drivers = await driverService.getDrivers({
            status: status,
            isOnline: isOnline !== undefined ? isOnline === 'true' : undefined,
            vehicleType: vehicleType,
        });
        res.json({ success: true, data: { drivers } });
    }
    catch (err) {
        next(err);
    }
}
export async function getDriverById(req, res, next) {
    try {
        const driver = await driverService.getDriverById(req.params.id);
        if (!driver) {
            return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Driver not found' } });
        }
        res.json({ success: true, data: { driver } });
    }
    catch (err) {
        next(err);
    }
}
export async function updateDriverOnline(req, res, next) {
    try {
        const { isOnline } = req.body;
        const driver = await driverService.updateDriverOnline(req.params.id, Boolean(isOnline));
        res.json({ success: true, data: { driver } });
    }
    catch (err) {
        next(err);
    }
}
export async function updateDriverLocation(req, res, next) {
    try {
        const { lat, lng } = req.body;
        await driverService.updateDriverLocation(req.params.id, { lat: Number(lat), lng: Number(lng) });
        res.json({ success: true, data: { updated: true } });
    }
    catch (err) {
        next(err);
    }
}
export async function updateDriverVerification(req, res, next) {
    try {
        const { status, docType, reason } = req.body;
        const driver = await driverService.updateDriverVerification(req.params.id, status, docType, reason);
        res.json({ success: true, data: { driver } });
    }
    catch (err) {
        next(err);
    }
}
export async function submitOnboarding(req, res, next) {
    try {
        const driver = await driverService.submitDriverOnboarding(req.body);
        res.status(201).json({ success: true, data: { driverId: driver?.id, driver } });
    }
    catch (err) {
        next(err);
    }
}
export async function getDriverEarnings(req, res, next) {
    try {
        const period = req.query.period || 'today';
        const result = await driverService.getDriverEarnings(req.params.id, period);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=driverController.js.map