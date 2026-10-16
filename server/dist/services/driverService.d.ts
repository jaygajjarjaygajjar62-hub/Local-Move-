export declare function getDrivers(filter?: {
    status?: string;
    isOnline?: boolean;
    vehicleType?: string;
}): Promise<any[]>;
export declare function getDriverById(driverId: string): Promise<any>;
export declare function updateDriverOnline(driverId: string, isOnline: boolean): Promise<any>;
export declare function updateDriverLocation(driverId: string, coords: {
    lat: number;
    lng: number;
}): Promise<{
    success: boolean;
}>;
export declare function updateDriverVerification(driverId: string, status: 'approved' | 'rejected' | 'suspended', docType?: 'licence' | 'aadhaar' | 'rc' | 'selfie', reason?: string): Promise<any>;
export declare function submitDriverOnboarding(payload: any): Promise<any>;
export declare function getDriverEarnings(driverId: string, period?: string): Promise<{
    profile: any;
    period: string;
    todayEarnings: any;
    cashInHandBalance: any;
    companyShareOwed: any;
    totalTrips: any;
    completedTrips: {
        id: any;
        timestamp: any;
        status: any;
        customerFare: any;
        driverShare: any;
        paymentMethod: any;
        sender: any;
        receiver: any;
    }[];
}>;
