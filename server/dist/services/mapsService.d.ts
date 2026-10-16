export interface PlaceSearchResult {
    id: string;
    title: string;
    subtitle?: string;
    fullAddress: string;
    coords: {
        lat: number;
        lng: number;
    };
    city: string;
    isExactMatch: boolean;
    source: 'google_places_new';
}
export interface ComputedRouteResult {
    distanceMeters: number;
    distanceKm: number;
    durationSeconds: number;
    durationMinutes: number;
    encodedPolyline: string;
    source: 'google_routes_new';
}
export declare class MapsService {
    /**
     * Search places via Google Places API (New) Text Search
     */
    static searchPlaces(query: string, apiKeyOverride?: string): Promise<PlaceSearchResult[]>;
    /**
     * Compute driving route using Google Routes API (New)
     */
    static computeRoute(origin: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }, apiKeyOverride?: string): Promise<ComputedRouteResult | null>;
}
