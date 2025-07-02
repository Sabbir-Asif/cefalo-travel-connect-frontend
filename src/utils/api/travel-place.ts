import type { TravelPlaceType } from "../../types/TravelPlace";
import { api } from "../axios";

export async function getAllTravelPlaceAPI(): Promise<TravelPlaceType[]> {
    const res = await api.get('/travel-places');
    return res.data;
}

export async function getTravelPlaceByPagination(pageNum: number, limit: number): Promise<TravelPlaceType[]> {
    const res = await api.get(`/travel-places/search?page=${pageNum}&limit=${limit}`);
    return res.data;
}

export async function getTravelPlaceByIdAPI(travelPlaceId: string): Promise<TravelPlaceType> {
    const res = await api.get(`/travel-places/${travelPlaceId}`);
    return res.data;
}

export async function updateTravelPlaceAPI(travelPlaceId: string, updateData: Partial<TravelPlaceType>): Promise<TravelPlaceType> {
  const res = await api.put(`/travel-places/${travelPlaceId}`, updateData);
  return res.data;
}