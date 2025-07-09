import type { Blog, BlogDetailsResponse, BlogResponse, CreateBlog } from "../../types/Blog";
import type { BlogFood } from "../../types/BlogFood";
import type { BlogLodge } from "../../types/BlogLodge";
import type { BlogTransport } from "../../types/BlogTransport";
import type { Food } from "../../types/Food";
import type { LikedBlog, LikedBlogResponse } from "../../types/LikedBlog";
import type { Lodge } from "../../types/Lodge";
import type { Transport } from "../../types/Transport";
import type { UserResponse } from "../../types/User";
import { api } from "../axios";

export async function getAllBlogsAPI(): Promise<BlogResponse[]> {
  const res = await api.get('/blogs');
  return res.data;
}

export async function getBlogById(id: string): Promise<BlogDetailsResponse> {
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

export async function getTransportsForBlogAPI(blogId: string): Promise<Transport[]> {
  const res = await api.get(`/blogs/${blogId}/transports`);
  return res.data;
}

export async function getAccomodationsForBlogAPI(blogId: string): Promise<Lodge[]> {
  const res = await api.get(`/blogs/${blogId}/lodges`);
  return res.data;
}

export async function getFoodsForBlogAPI(blogId: string): Promise<Food[]> {
  const res = await api.get(`/blogs/${blogId}/foods`);
  return res.data;
}

export async function getInsightsForBlogAPI(blogId: string): Promise<Blog[]> {
  const res = await api.get(`/blogs/${blogId}/insights`);
  return res.data;
}

export async function createBlogTransportAPI(data: BlogTransport): Promise<BlogTransport> {
  const res = await api.post(`/blogs/transports`, data);
  return res.data;
}

export async function deleteBlogTransportAPI(blogId: string, transportId: string): Promise<number> {
  const res = await api.delete(`/blogs/${blogId}/transports/${transportId}`);
  return res.status;
}

export async function createBlogLodgeAPI(data: BlogLodge): Promise<BlogLodge> {
  const res = await api.post(`/blogs/lodges`, data);
  return res.data;
}

export async function deleteBlogLodgeAPI(blogId: string, lodgeId: string): Promise<number> {
  const res = await api.delete(`blogs/${blogId}/lodges/${lodgeId}`);
  return res.status;
}

export async function createBlogFoodAPI(data: BlogFood): Promise<BlogFood> {
  const res = await api.post(`/blogs/foods`, data);
  return res.data;
}

export async function deleteFoodFromBlogAPI(blogId: string, foodId: string): Promise<number> {
  const res = await api.delete(`blogs/${blogId}/foods/${foodId}`);
  return res.status;
}

export async function reactToBlogAPI(userId: string, blogId: string): Promise<LikedBlogResponse> {
  const data: LikedBlog = {
    user_id: userId,
    blog_id: blogId,
    reaction_name: 'inspired'
  }

  const res = await api.post(`/blogs/react`, data);
  return res.data;
}

export async function removeReactionAPI(blogId: string): Promise<number> {
  const res = await api.delete(`/blogs/${blogId}/react`);
  return res.status;
}

export async function getUsersWhoReactedAPI(blogId: string): Promise<UserResponse[]> {
  const res = await api.get(`/blogs/${blogId}/react`);
  return res.data;
}