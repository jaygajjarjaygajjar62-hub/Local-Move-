import { Router } from 'express';
import { MapsService } from '../services/mapsService.js';
const router = Router();
/**
 * POST /api/v1/maps/places-search
 * Search exact places & coordinates via Google Places API (New)
 */
router.post('/places-search', async (req, res) => {
    try {
        const { query, apiKey } = req.body;
        if (!query || typeof query !== 'string') {
            res.status(400).json({ error: 'Query parameter is required' });
            return;
        }
        const places = await MapsService.searchPlaces(query, apiKey);
        res.json({
            success: true,
            data: {
                query,
                count: places.length,
                places,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: { message: err.message || 'Places search failed' } });
    }
});
/**
 * POST /api/v1/maps/compute-route
 * Compute exact road distance, duration, and polyline via Google Routes API (New)
 */
router.post('/compute-route', async (req, res) => {
    try {
        const { origin, destination, apiKey } = req.body;
        if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
            res.status(400).json({ success: false, error: { message: 'Origin and destination coordinates are required' } });
            return;
        }
        const result = await MapsService.computeRoute(origin, destination, apiKey);
        if (!result) {
            res.status(502).json({ success: false, error: { message: 'Failed to compute route via Google Routes API' } });
            return;
        }
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: { message: err.message || 'Route computation failed' } });
    }
});
export default router;
//# sourceMappingURL=mapsRoutes.js.map