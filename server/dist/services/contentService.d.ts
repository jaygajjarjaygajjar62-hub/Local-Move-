export declare function getProhibitedItems(): Promise<{
    id: string;
    name: string;
    category: string;
    fineAmount: number;
    riskLevel: "critical" | "high" | "medium";
}[]>;
export declare function addProhibitedItem(item: {
    name: string;
    category: string;
    fineAmount: number;
    riskLevel: string;
}): Promise<{
    name: string;
    category: string;
    fineAmount: number;
    riskLevel: string;
    id: string;
}>;
export declare function deleteProhibitedItem(id: string): Promise<{
    success: boolean;
}>;
export declare function getFAQs(category?: string): Promise<{
    id: string;
    category: "customer" | "driver" | "safety";
    question: string;
    answer: string;
}[]>;
export declare function addFAQ(faq: {
    category: string;
    question: string;
    answer: string;
}): Promise<{
    category: string;
    question: string;
    answer: string;
    id: string;
}>;
