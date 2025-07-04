import type { TourTransportWithTransport } from "../../types/TourTransport";
import type { TransportLocation } from "../../types/Transport";
import { api } from "../axios";

export async function gettransportsForTravelPlanAPI(travelPlanId: string): Promise<TourTransportWithTransport[]> {
    const res = await api.get(`/travel-plans/transports/search?travelplan_id=${travelPlanId}`);
    return res.data;
}

export async function getAllStartingPointsAPI(): Promise<TransportLocation[]> {
    const res = await api.get(`/transports/startingLocationNames`);
    return res.data;
}

export async function getAllDesticationPointsAPI(): Promise<TransportLocation[]> {
    const res = await api.get(`transports/destinationLocationNames`);
    return res.data;
}

export async function searchTransportAPI(start: string, dest: string, type: string) {
    const res = await api.get(`/transports/search?startingLocationName=${start}&destinationLocationName=${dest}&type=${type}&sortBy=fare&order=asc`)
    return res.data;
}