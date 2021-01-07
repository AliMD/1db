import debounce from 'lodash/debounce.js';
import { log, readJsonFile, writeJsonFile, utcTimestamp } from './util.js';
export class OneDB {
    /**
     * Open JSON file
     */
    constructor(storagePath) {
        this.saveRequest = debounce(() => {
            log('Save db');
            this._storage.then(storage => writeJsonFile(this._path, storage));
        }, 100, {
            leading: false,
            trailing: true,
            maxWait: 1000,
        });
        log(`open ${storagePath}`);
        this._path = storagePath;
        this._storage = readJsonFile(this._path, {});
        this._storage.catch(err => { throw err; });
    }
    async _updateIndexList(id) {
        if (id != undefined && this._indexList == undefined) {
            return;
        } // no index created yet and maybe not need at all
        const storage = await this._storage;
        if (this._indexList == undefined) {
            this._indexList = Object.keys(storage);
        }
        if (id != undefined && !(id in this._indexList)) {
            this._indexList.push(id);
        }
    }
    /**
     * Insert/Update a document record
     */
    async set(id, data, replace = false) {
        log(`set ${id}`);
        if (id === '_latest') {
            throw new Error('forbidden_key');
        }
        const storage = await this._storage;
        let oldData = storage[id];
        if (oldData !== undefined && !(typeof oldData === 'object' && '_id' in oldData)) {
            oldData = undefined; // invalid data!
        }
        data._id = id;
        data._modified = oldData?._modified ?? utcTimestamp();
        data._created = oldData?._created ?? data._modified;
        if (data !== oldData && !replace) {
            data = {
                ...oldData,
                ...data,
            };
        }
        storage[id] = data;
        storage._latest = id;
        void this._updateIndexList(id);
        this.saveRequest();
        return data;
    }
    /**
     * Get a document record
     */
    async get(id) {
        log(`get ${id}`);
        if (!(id != null && typeof id === 'string' && id.length > 0)) {
            return;
        }
        const storage = await this._storage;
        const data = storage[id];
        if (typeof data === 'string') {
            return this.get(data);
        }
        else {
            return data;
        }
    }
    /**
     * Find single item
     */
    async find(predicate) {
        log('find');
        await this._updateIndexList();
        const storage = await this._storage;
        for (const id of this._indexList) {
            const documentRecord = storage[id];
            if (documentRecord != null && typeof documentRecord === 'object' && predicate(documentRecord)) {
                return documentRecord;
            }
        }
        return undefined;
    }
    /**
     * Find all item
     */
    async findAll(predicate) {
        log('findAll');
        await this._updateIndexList();
        const storage = await this._storage;
        const result = [];
        for (const id of this._indexList) {
            const documentRecord = storage[id];
            if (documentRecord != null && typeof documentRecord === 'object' && predicate(documentRecord)) {
                result.push(documentRecord);
            }
        }
        return result;
    }
    /**
     * delete items base in query
     */
    async delete(id) {
        log('delete', id);
        const storage = await this._storage;
        delete storage[id];
        delete this._indexList; // need to re-index
        this.saveRequest();
    }
}
