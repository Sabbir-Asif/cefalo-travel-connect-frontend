import type { TravelPlan } from "../../types/TravelPlan";
import type { UserResponse } from "../../types/User";
import { api } from "../axios";

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