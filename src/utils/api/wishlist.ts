import type { CreateWishlist, Wishlist, WishlistWithUser } from "../../types/Wishlist";
import { api } from "../axios";

export async function createWishlistAPI(data: CreateWishlist): Promise<Wishlist> {
  const res = await api.post('/wishlists', data);
  return res.data;
}

export async function getPublicWishlistAPI(): Promise<WishlistWithUser[]> {
  const res = await api.get('/wishlists/search?status=PUBLIC');
  return res.data;
}

export async function getWishlistByIdAPI(id: string): Promise<WishlistWithUser> {
   console.log("wishlistId: " , id);
  const res = await api.get(`/wishlists/${id}`)
  return res.data;
}

export async function updateWishlistAPI(id: string, data: Partial<Wishlist>): Promise<WishlistWithUser> {
  const res = await api.put(`/wishlists/${id}`, data);
  return res.data;
}

export async function getWishlistByUserIdAPI(userId: string) : Promise<Wishlist[]> {
  const res = await api.get(`/users/${userId}/wishlists`);
  return res.data;
}