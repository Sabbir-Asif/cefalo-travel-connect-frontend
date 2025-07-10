import type { Lodge, LodgeLocation } from "../../types/Lodge";
import { api } from "../axios";

export async function getLodgeLocationsAPI(): Promise<LodgeLocation[]> {
    const res = await api.get(`/lodges/locationNames`);
    return res.data;
}

export async function searchLodgeAPI(name: string, location: string): Promise<Lodge[]> {
    const res = await api.get(`/lodges/search?name=${name}&location_name=${location}&sortBy=price&order=desc`);
    return res.data;
}