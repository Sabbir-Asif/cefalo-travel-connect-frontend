import type { Blog, BlogDetailsResponse } from "../../types/Blog";
import { api } from "../axios";

export async function getAllBlogsAPI(): Promise<Blog[]> {
    const res = await api.get('/blogs');
    return res.data;
}

export async function getBlogById(id: string) : Promise<BlogDetailsResponse> {
    const res = await api.get(`/blogs/${id}`);
    return res.data;
}

export async function getBlogsByUserId(userId: string) {
  const res = await api.get(`/blogs/search?userId=${userId}`);
  return res.data;
}