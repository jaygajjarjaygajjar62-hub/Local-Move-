export declare function getAddresses(userId?: string): Promise<{
    id: string;
    title: string;
    fullAddress: string;
    landmark: string | undefined;
    floor: string | undefined;
    instructions: string | undefined;
    city: string;
    coords: {
        lat: number;
        lng: number;
    };
}[]>;
export declare function addAddress(userId: string | undefined, addr: any): Promise<{
    id: any;
    title: any;
    fullAddress: any;
    landmark: any;
    floor: any;
    instructions: any;
    city: any;
    coords: any;
}>;
export declare function deleteAddress(addressId: string): Promise<{
    success: boolean;
}>;
