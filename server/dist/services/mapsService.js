import { ENV } from '../config/env.js';
/**
 * Extract city name from address components or address string
 */
function extractCityFromComponents(place) {
    if (Array.isArray(place?.addressComponents)) {
        const locality = place.addressComponents.find((c) => c.types?.includes('locality'));
        if (locality?.longText)
            return locality.longText;
        const admin2 = place.addressComponents.find((c) => c.types?.includes('administrative_area_level_2'));
        if (admin2?.longText)
            return admin2.longText;
    }
    const raw = (place?.formattedAddress || '').toLowerCase();
    if (raw.includes('anand') || raw.includes('vidyanagar') || raw.includes('karamsad'))
        return 'Anand';
    if (raw.includes('ahmedabad'))
        return 'Ahmedabad';
    if (raw.includes('gandhinagar'))
        return 'Gandhinagar';
    if (raw.includes('vadodara') || raw.includes('baroda'))
        return 'Vadodara';
    if (raw.includes('surat'))
        return 'Surat';
    if (raw.includes('rajkot'))
        return 'Rajkot';
    if (raw.includes('nadiad'))
        return 'Nadiad';
    if (raw.includes('bhavnagar'))
        return 'Bhavnagar';
    if (raw.includes('jamnagar'))
        return 'Jamnagar';
    return 'Gujarat';
}
export class MapsService {
    /**
     * Search places via Google Places API (New) Text Search
     */
    static async searchPlaces(query, apiKeyOverride) {
        const key = (apiKeyOverride || ENV.GOOGLE_MAPS_API_KEY || '').trim();
        if (!key || !query || query.trim().length < 2) {
            return [];
        }
        try {
            const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': key,
                    'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1',
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents',
                },
                body: JSON.stringify({
                    textQuery: query.trim(),
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.warn('Google Places API (New) search failed:', response.status, errorBody);
                return [];
            }
            const data = await response.json();
            if (!Array.isArray(data?.places)) {
                return [];
            }
            return data.places
                .filter((p) => p?.location?.latitude && p?.location?.longitude)
                .map((p) => {
                const lat = Number(Number(p.location.latitude).toFixed(6));
                const lng = Number(Number(p.location.longitude).toFixed(6));
                const title = p.displayName?.text || p.formattedAddress?.split(',')[0] || query;
                const city = extractCityFromComponents(p);
                return {
                    id: p.id || `gplace-${lat}-${lng}`,
                    title,
                    subtitle: `${p.formattedAddress || ''}`,
                    fullAddress: p.formattedAddress || title,
                    coords: { lat, lng },
                    city,
                    isExactMatch: true,
                    source: 'google_places_new',
                };
            });
        }
        catch (err) {
            console.error('MapsService.searchPlaces network error:', err?.message || err);
            return [];
        }
    }
    /**
     * Compute driving route using Google Routes API (New)
     */
    static async computeRoute(origin, destination, apiKeyOverride) {
        const key = (apiKeyOverride || ENV.GOOGLE_MAPS_API_KEY || '').trim();
        if (!key || !origin?.lat || !destination?.lat) {
            return null;
        }
        try {
            const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': key,
                    'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1',
                    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
                },
                body: JSON.stringify({
                    origin: {
                        location: {
                            latLng: { latitude: origin.lat, longitude: origin.lng },
                        },
                    },
                    destination: {
                        location: {
                            latLng: { latitude: destination.lat, longitude: destination.lng },
                        },
                    },
                    travelMode: 'DRIVE',
                    routingPreference: 'TRAFFIC_AWARE',
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.warn('Google Routes API (New) failed:', response.status, errorText);
                return null;
            }
            const data = await response.json();
            const route = data?.routes?.[0];
            if (!route) {
                return null;
            }
            const distanceMeters = Number(route.distanceMeters) || 0;
            const distanceKm = Number((distanceMeters / 1000).toFixed(1));
            // Duration string format from Google is e.g. "1126s"
            let durationSeconds = 0;
            if (typeof route.duration === 'string') {
                durationSeconds = parseInt(route.duration.replace('s', ''), 10) || 0;
            }
            else if (typeof route.duration === 'number') {
                durationSeconds = route.duration;
            }
            const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
            return {
                distanceMeters,
                distanceKm,
                durationSeconds,
                durationMinutes,
                encodedPolyline: route.polyline?.encodedPolyline || '',
                source: 'google_routes_new',
            };
        }
        catch (err) {
            console.error('MapsService.computeRoute network error:', err?.message || err);
            return null;
        }
    }
}
//# sourceMappingURL=mapsService.js.map