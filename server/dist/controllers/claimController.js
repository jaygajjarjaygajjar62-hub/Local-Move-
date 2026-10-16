import * as claimService from '../services/claimService.js';
export async function getClaims(req, res, next) {
    try {
        const claims = await claimService.getClaims();
        res.json({ success: true, data: { claims } });
    }
    catch (err) {
        next(err);
    }
}
export async function raiseClaim(req, res, next) {
    try {
        const result = await claimService.raiseClaim(req.body);
        res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
export async function resolveClaim(req, res, next) {
    try {
        const { approvedCompensationInr, resolutionNotes } = req.body;
        const claim = await claimService.resolveClaim(req.params.id, Number(approvedCompensationInr), resolutionNotes);
        res.json({ success: true, data: { claim } });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=claimController.js.map