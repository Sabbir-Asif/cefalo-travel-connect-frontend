import type { UserResponse } from "./User";

export type TravelRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface TravelRequest {
  id: string;
  travel_plan_id: string;
  user_from: string;
  user_to: string;
  title: string;
  message?: string;
  status: TravelRequestStatus;
  created_at: Date;
  updated_at: Date;
}

export interface TravelRequestWithUsers extends TravelRequest {
  from_user: UserResponse;
  to_user: UserResponse;
}

export interface CreateTravelRequest {
  travel_plan_id: string;
  user_to: string;
  title: string;
  message?: string;
}

export interface UpdateTravelRequest {
  title?: string;
  message?: string;
  status?: TravelRequestStatus;
}
