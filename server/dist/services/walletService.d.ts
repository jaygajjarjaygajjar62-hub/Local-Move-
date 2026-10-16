export declare function getWallet(userId?: string): Promise<{
    balance: number;
    transactions: {
        id: string;
        title: string;
        amount: number;
        type: "credit" | "debit";
        timestamp: string;
    }[];
}>;
export declare function topUpWallet(userId: string | undefined, amount: number): Promise<{
    balance: number;
    transactions: {
        id: string;
        title: string;
        amount: number;
        type: "credit" | "debit";
        timestamp: string;
    }[];
}>;
export declare function deductWallet(userId: string | undefined, amount: number, orderId?: string): Promise<{
    balance: number;
    transactions: {
        id: string;
        title: string;
        amount: number;
        type: "credit" | "debit";
        timestamp: string;
    }[];
}>;
