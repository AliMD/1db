/// <reference types="lodash" />
export interface DocumentStorage extends Record<string, DocumentRecord | string | undefined> {
    _latest?: string;
}
export interface DocumentRecord extends Record<string, unknown> {
    _id: string;
    _created: number;
    _modified: number;
}
export declare class OneDB {
    private _path;
    private _indexList?;
    _storage: Promise<DocumentStorage>;
    /**
     * Open JSON file
     */
    constructor(storagePath: string);
    protected _updateIndexList(id?: string): Promise<void>;
    /**
     * Insert/Update a document record
     */
    set(id: string, data: Record<string, unknown>, replace?: boolean): Promise<DocumentRecord>;
    /**
     * Get a document record
     */
    get<T extends DocumentRecord>(id: string): Promise<T | undefined>;
    /**
     * Find single item
     */
    find(predicate: (documentRecord: DocumentRecord) => boolean): Promise<DocumentRecord | undefined>;
    /**
     * Find all item
     */
    findAll(predicate: (documentRecord: DocumentRecord) => boolean): Promise<Array<DocumentRecord>>;
    /**
     * delete items base in query
     */
    delete(id: string): Promise<void>;
    saveRequest: import("lodash").DebouncedFunc<() => void>;
}
