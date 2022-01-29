export type Tables = 'documents-meta'|'documents-data'|'lol';

export default class IndexedDBController {

    private idb: IDBFactory;
    private connection: IDBOpenDBRequest | null;

    private connected = false;
    private database: IDBDatabase | null;

    private readonly name: string;
    private readonly version: number;
    constructor(name: string, version: number) {
        this.idb = window.indexedDB;
        this.name = name;
        this.version = version;
        this.connection = null;
        this.database = null;
        // this.connection = this.idb.open(name, version);
    }

    update(table: Tables, index: string, data): Promise<any> {
        return this.delete(table, index)
            .then(() => this.insert(table, index, data));
    }

    delete(table: Tables, index: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.connected || this.connection === null || this.database === null)
                throw new Error('Not connected to database.');

            const request = this.database.transaction(['documents-meta', 'documents-data'] as Tables[], 'readwrite')
                .objectStore(table)
                .delete(index)

            request.onsuccess = function(evt) {
                resolve(this.result)
            }

            request.onerror = function(evt) {
                reject(this.error);
            }
        })
    }

    insert(table: Tables, index: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.connected || this.connection === null || this.database === null)
                throw new Error('Not connected to database.');

            if (typeof data !== 'object') {
                data = { data }
            }

            const request = this.database
                .transaction(['documents-meta', 'documents-data'] as Tables[], 'readwrite')
                .objectStore(table)
                .add({...data, id: index});

            request.onsuccess = function(evt) {
                resolve(this.result)
            }

            request.onerror = function(evt) {
                reject(this.error);
            }
        })
    }

    fetchAll(table: Tables, index?: string | RegExp): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.connected || this.connection === null || this.database === null)
                throw new Error('Not connected to database.');

            const request = this.database.transaction(['documents-meta', 'documents-data'] as Tables[], 'readonly')
                .objectStore(table)
                .getAll()
                // .getAll(IDBKeyRange.lowerBound('meta-', true))
                // .getAll({
                //     includes(key: any): boolean {
                //         return key.indexOf(index) >= 0;
                //     },
                // } )

            request.onsuccess = function(evt) {
                resolve(this.result)
            }

            request.onerror = function(evt) {
                reject(this.error);
            }
        })
    }

    fetch(table: Tables, index: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.connected || this.connection === null || this.database === null)
                throw new Error('Not connected to database.');

            const request = this.database.transaction(['documents-meta', 'documents-data'] as Tables[], 'readonly')
                .objectStore(table)
                .get(index);

            request.onsuccess = function(evt) {
                resolve(this.result)
            }

            request.onerror = function(evt) {
                reject(this.error);
            }
        })
    }

    async connect() {
        this.connection = this.idb.open(this.name, this.version);
        const controller = this;
        return new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.onupgradeneeded = function(ev) {
                    const db = {} as any;
                    db.result = this.result;
                    this.result.createObjectStore('documents-meta', { keyPath: 'id' });
                    this.result.createObjectStore('documents-data', { keyPath: 'id' });
                }
                this.connection.onerror = function(ev) {
                    reject(this.error);
                }
                this.connection.onsuccess = function(ev) {
                    controller.connected = true;
                    controller.database = this.result;
                    resolve(this.result);
                }
            }
        })
        // return this.connection;
    }

}