import type { CreateDiscussion, Discussion, DiscussionWithSender } from "../../types/Discussion";
import { api } from "../axios";

export async function getDiscussionsForTravelPlanAPI(travelPlanId: string) : Promise<DiscussionWithSender[]> {
    const res = await api.get(`/travel-plans/${travelPlanId}/discussions`);
    return res.data;
}

export async function createDiscussionAPI(data: CreateDiscussion): Promise<Discussion> {
    const res = await api.post(`/discussions`, data);
    return res.data;
}