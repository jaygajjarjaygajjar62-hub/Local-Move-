import * as adminService from '../services/adminService.js';
export async function getOverview(req, res, next) {
    try {
        const data = await adminService.getAdminOverview();
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getLiveOps(req, res, next) {
    try {
        const vehicleType = req.query.vehicleType;
        const data = await adminService.getLiveOpsFeed(vehicleType);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getCommissions(req, res, next) {
    try {
        const data = await adminService.getCommissionsData();
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getReports(req, res, next) {
    try {
        const range = req.query.range || '7d';
        const data = await adminService.getReportsData(range);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
export async function getHelpers(req, res, next) {
    try {
        const helpers = await adminService.getHelpers();
        res.json({ success: true, data: { helpers } });
    }
    catch (err) {
        next(err);
    }
}
export async function getAuditLogs(req, res, next) {
    try {
        const logs = await adminService.getAuditLogs();
        res.json({ success: true, data: { logs } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=adminController.js.map