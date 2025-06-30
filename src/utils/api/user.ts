import type { UserResponse } from "../../types/User";
import { api } from "../axios";

export async function getAllUsers(): Promise<UserResponse[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function getUserById(id: string): Promise<UserResponse> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function updateUserRole(
  id: string,
  role: "ADMIN" | "TRAVELER" | "EXPLORER"
): Promise<UserResponse> {
  const { data } = await api.put(`/users/${id}`, { role });
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
