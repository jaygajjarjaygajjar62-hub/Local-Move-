export declare function loginCustomer(phone: string, name?: string): Promise<{
    user: any;
    token: string;
}>;
export declare function loginDriver(phone: string): Promise<{
    driver: {
        id: any;
        name: any;
        phone: any;
        vehicleType: any;
        vehicleNumber: any;
        vehicleModel: any;
        status: any;
        isLoggedIn: boolean;
    };
    token: string;
}>;
export declare function getUserById(userId: string): Promise<any>;
