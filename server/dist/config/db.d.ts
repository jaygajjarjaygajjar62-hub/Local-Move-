export interface ExecuteOptions {
    sql: string;
    args?: any[];
}
export interface ExecuteResult {
    rows: any[];
    rowCount: number;
}
export declare function convertPlaceholders(sql: string): string;
export declare const db: {
    execute: (input: string | ExecuteOptions) => Promise<ExecuteResult>;
    query: (sql: string, args?: any[]) => Promise<ExecuteResult>;
    init: () => Promise<void>;
    close: () => Promise<void>;
};
export declare function initPragmas(): Promise<void>;
export declare function initDatabase(): Promise<void>;
