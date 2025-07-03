import type { TravelRequest, TravelRequestWithUsers } from "../../types/TravelRequest";
import { api } from "../axios";

export async function getSentRequestFromUserAPI(userId: string): Promise<TravelRequestWithUsers[]> {
    const res = await api.get(`/travel-requests/search?user_from=${userId}`)
    return res.data;
}

export async function getRecievedRequestByUserAPI(userId: string): Promise<TravelRequestWithUsers[]> {
    const res = await api.get(`/travel-requests/search?user_to=${userId}`);
    return res.data;
}

export async function updateTravelrequestAPI(id: string, data: Partial<TravelRequest>) {
    const res = await api.put(`/travel-requests/${id}`, data);
    return res.data;
}