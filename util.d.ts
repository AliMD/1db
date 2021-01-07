import debug from 'debug';
export declare const log: debug.Debugger;
export declare function readJsonFile<T extends Record<string | number, unknown>>(path: string, defaultContent: T): Promise<T>;
export declare function writeJsonFile(path: string, data: unknown): Promise<void>;
export declare function utcTimestamp(): number;
