import type { TravelPlan } from "../../types/TravelPlan";
import { api } from "../axios";

export async function getTravelPlansByPlannerId(plannerId: string) {
  const res = await api.get(`/travel-plans/search?planner_id=${plannerId}`);
  return res.data;
}

export async function getTravelPlanByIdAPI(id: string): Promise<TravelPlan> {
  const res = await api.get(`travel-plans/${id}`);
  return res.data;
}