import type { Lodge } from "../../types/Lodge";
import type { TourLodge } from "../../types/TourLodge";
import type { CreateTourTransport, TourTransportWithTransport } from "../../types/TourTransport";
import type { CreateTravelPlan, TravelPlan } from "../../types/TravelPlan";
import type { UserResponse } from "../../types/User";
import { api } from "../axios";

export async function createTravelPlanAPI(data: CreateTravelPlan): Promise<TravelPlan> {
  const res = await api.post(`/travel-plans`, data);
  return res.data;
}

export async function getTravelPlansByPlannerId(plannerId: string) {
  const res = await api.get(`/travel-plans/search?planner_id=${plannerId}`);
  return res.data;
}

export async function getTravelPlanByIdAPI(id: string): Promise<TravelPlan> {
  const res = await api.get(`travel-plans/${id}`);
  return res.data;
}

export async function createTourMemberAPI(data: { user_id: string, travelplan_id: string }): Promise<{ user_id: string, travelplan_id: string }> {
  const res = await api.post(`/travel-plans/members`, data);
  return res.data;
}

export async function getMembersForTravelPlanAPI(id: string): Promise<UserResponse[]> {
  const res = await api.get(`travel-plans/${id}/members`);
  return res.data;
}

export async function getAccomodationsForTravelPlanAPI(id: string): Promise<Lodge[]> {
  const res = await api.get(`/travel-plans/${id}/lodges`);
  return res.data;
}

export async function addTransportToTravelplanAPI(data: CreateTourTransport): Promise<TourTransportWithTransport> {
  const res = await api.post(`travel-plans/transports`, data);
  return res.data;
}

export async function addLodgeToTravelPlanAPI(data: TourLodge): Promise<TourLodge> {
  const res = await api.post(`/travel-plans/lodges`, data);
  return res.data;
}

export async function removeTransportFromTravelPlanAPI(id: string): Promise<number> {
  const res = await api.delete(`/travel-plans/transports/${id}`);
  return res.status;
}

export async function removeAccomodationFromTravelPlan(travelPlanId: string, accomodationId: string): Promise<number> {
  const res = await api.delete(`/travel-plans/${travelPlanId}/lodges/${accomodationId}`);
  return res.status;
}

export async function removeMemberFromTravelPlan(travelPlanId: string, userId: string): Promise<number> {
  const res = await api.delete(`/travel-plans/${travelPlanId}/members/${userId}`);
  return res.status;
}

export async function SuggestedMembersAPI(userId: string): Promise<UserResponse[]> {
  const res = await api.get(`/wishlists/matchmaking?userId=${userId}&radius=20&timeDiff=1m`);
  return res.data;
}
