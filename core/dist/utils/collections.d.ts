export declare const isObject: (input: any) => input is Record<string, any>;
export declare const mapObject: <T, T2>(object: Record<string, T>, f: (kv: [string, T]) => [string, T2]) => Record<string, T2>;
export declare const mapValues: <T, T2>(object: Record<string, T>, f: (value: T) => T2) => Record<string, T2>;
export declare const omit: <T = unknown>(collection: T, key: string[]) => T;
export declare const omitKeys: (object: Record<string, any>, keys: string[]) => {
    [k: string]: any;
};
export declare const groupBy: <T>(items: T[], f: (t: T) => string) => Record<string, T[]>;
export declare const filterObject: <T>(object: Record<string, T>, f: (kv: [string, T]) => boolean) => Record<string, T>;
export declare function get<T = any>(collection: T, [head, ...rest]: string[]): any;
export declare const set: <T = unknown>(collection: T, key: string[], value: any) => T;
export declare const sortObjectEntries: <T>(object: Record<string, T>, f: (kv: [string, T]) => string | number | boolean, ascending?: boolean) => [string, T][];
export declare const easySort: <T>(collection: T[], f: (item: T) => string | number | boolean, ascending?: boolean) => T[];
export declare const deepSortObject: (obj: any) => Record<string, any> | Array<any> | undefined | null;
