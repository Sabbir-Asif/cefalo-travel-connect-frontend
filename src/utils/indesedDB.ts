import { openDB, type DBSchema } from "idb";

export interface Marker {
    id: string;
    label: string;
    lat: number;
    long: number;
}

interface MarkerDB extends DBSchema {
    markers: {
        key: string;
        value: Marker;
        indexes: { "by-label": string };
    };
}

const DB_NAME = "LiveJourneyDB";
const DB_VERSION = 1;
const STORE_NAME = "markers";

async function getDB() {
    return openDB<MarkerDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("by-label", "label");
            }
        },
    });
}

export async function addMarker(marker: Marker): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, marker);
}

export async function getAllMarkers(): Promise<Marker[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
}

export async function deleteMarker(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
}
