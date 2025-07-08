import type { UserResponse } from "../../types/User";
import { api } from "../axios";

export async function loginAPI(email: string, password: string): Promise<{
  user: UserResponse;
  accessToken: string;
}> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function signupAPI(data: {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}): Promise<UserResponse> {
  const res = await api.post("/auth/signup", data);
  return res.data;
}

export async function refreshTokenAPI(): Promise<{ accessToken: string }> {
  const res = await api.post("/auth/refresh-token");
  return res.data;
}

export async function logoutAPI(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMeAPI(): Promise<UserResponse> {
  const res = await api.get("/users/me");
  return res.data;
}

export async function requestPasswordResetAPI(email: string): Promise<void> {
  await api.post("/auth/reset-password/request", { email });
}

export async function resetPasswordAPI(token: string, password: string): Promise<void> {
  console.log({token, password});
  await api.post("/auth/reset-password/reset", { token, password });
}
