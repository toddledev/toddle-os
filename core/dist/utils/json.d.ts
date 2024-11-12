/**
 * This function is much slower than JSON parse without reviver and is a major
 * bottleneck in the runtime performance. Especially during startup.
 */
export declare function parseJSONWithDate(input: string): any;
