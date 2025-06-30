export interface BlogInsight {
  id: string;
  blog_id: string,
  user_id: string,
  label: string;
  data: string;
  created_at: Date;
  updated_at: Date;
}