export declare function getAdminOverview(): Promise<{
    activeOrdersCount: number;
    onlineDriversCount: number;
    pendingDriversCount: number;
    totalRevenue: any;
    volumeTrend: {
        day: string;
        orders: number;
        rev: number;
    }[];
    recentOrders: any[];
}>;
export declare function getLiveOpsFeed(vehicleType?: string): Promise<{
    activeOrders: any[];
    drivers: any[];
}>;
export declare function getCommissionsData(): Promise<{
    driverSharePercent: number;
    maxDriverCashLimit: number;
    totalCashInFleet: any;
    companyShareOwed: any;
    drivers: any[];
}>;
export declare function getReportsData(range?: string): Promise<{
    dateRange: string;
    orders: {
        id: any;
        createdAt: any;
        status: any;
        senderName: any;
        senderPhone: any;
        receiverName: any;
        receiverPhone: any;
        vehicleType: any;
        distanceKm: any;
        totalFare: any;
        driverShare: any;
        paymentMethod: any;
    }[];
}>;
export declare function getHelpers(): Promise<{
    id: string;
    name: string;
    phone: string;
    role: string;
    experience: string;
    rating: number;
    status: string;
    movesAssisted: number;
}[]>;
export declare function getAuditLogs(): Promise<any[]>;
