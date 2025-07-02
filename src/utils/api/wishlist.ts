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