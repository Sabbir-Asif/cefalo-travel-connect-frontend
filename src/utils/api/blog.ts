import type { Blog, BlogDetailsResponse, CreateBlog } from "../../types/Blog";
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

export async function createBlogAPI(blogData: CreateBlog): Promise<Blog> {
  const res = await api.post('/blogs', blogData);
  return res.data;
}

export async function updateBlogAPI(blogId: string, updateData: Partial<Blog>): Promise<Blog> {
  const res = await api.put(`/blogs/${blogId}`, updateData);
  return res.data;
}