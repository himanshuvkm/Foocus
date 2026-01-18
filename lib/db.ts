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
            id: string;
            date: string; // YYYY-MM-DD
            focusTime: number; // in seconds
            completedTasks: number;
        };
        indexes: { 'by-date': string };
    };
}

const DB_NAME = 'foocus-db';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<FoocusDB>> => {
    return openDB<FoocusDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('tasks')) {
                const store = db.createObjectStore('tasks', { keyPath: 'id' });
                store.createIndex('by-status', 'status');
                store.createIndex('by-priority', 'priority');
            }
            if (!db.objectStoreNames.contains('analytics')) {
                const store = db.createObjectStore('analytics', { keyPath: 'id' });
                store.createIndex('by-date', 'date');
            }
        },
    });
};

export const getDB = async () => {
    return await initDB();
};
