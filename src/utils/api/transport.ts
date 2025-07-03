import type { TourTransportWithTransport } from "../../types/TourTransport";
import { api } from "../axios";

export async function gettransportsForTravelPlanAPI(travelPlanId: string): Promise<TourTransportWithTransport[]> {
    const res = await api.get(`/travel-plans/transports/search?travelplan_id=${travelPlanId}`);
    return res.data;
}