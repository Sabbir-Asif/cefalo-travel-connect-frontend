import { api } from "../axios";

export async function getTravelPlansByPlannerId(plannerId: string) {
  const res = await api.get(`/travel-plans/search?planner_id=${plannerId}`);
  return res.data;
}
