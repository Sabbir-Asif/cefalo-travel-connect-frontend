import type { UserResponse } from "./User";

export interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  label: string;
  data: string;
  created_at: Date;
  updated_at: Date;
}

export interface CommentResponse {
  id: string;
  blog_id: string;
  user_id: string;
  user: UserResponse;
  label: string;
  data: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateComment {
  label: string;
  data: string;
}

export interface UpdateComment {
  label?: string;
  data?: string;
}
