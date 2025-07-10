import type { UserResponse } from "./User";

export interface Discussion {
  id: string;
  travel_plan_id: string;
  sender_id: string;
  content: string;
  created_at: Date;
}

export interface CreateDiscussion {
  travel_plan_id: string;
  content: string;
}

export interface DiscussionWithSender extends Discussion {
  sender: UserResponse;
}
