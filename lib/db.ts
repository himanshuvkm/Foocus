import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Task } from './types';

interface FoocusDB extends DBSchema {
    tasks: {
        key: string;
        value: Task;
        indexes: { 'by-status': string; 'by-priority': string };
    };
    analytics: {
        key: string;
        value: {
            date: string; // YYYY-MM-DD (Key)
            totalFocusTime: number; // in seconds
            sessionsCompleted: number;
        };
    };
}

const DB_NAME = 'foocus-db';
const DB_VERSION = 2;

export const initDB = async (): Promise<IDBPDatabase<FoocusDB>> => {
    return openDB<FoocusDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
            if (!db.objectStoreNames.contains('tasks')) {
                const store = db.createObjectStore('tasks', { keyPath: 'id' });
                store.createIndex('by-status', 'status');
                store.createIndex('by-priority', 'priority');
            }

            if (oldVersion < 2) {
                // If upgrading from v1, we might need to recreate analytics or handle migration
                if (db.objectStoreNames.contains('analytics')) {
                    db.deleteObjectStore('analytics');
                }
                db.createObjectStore('analytics', { keyPath: 'date' });
                // No index needed for date since it's the key
            }
        },
    });
};

export const getDB = async () => {
    return await initDB();
};
