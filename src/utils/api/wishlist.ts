import type { CreateWishlist, Wishlist } from "../../types/Wishlist";
import { api } from "../axios";

export async function createWishlistAPI(data: CreateWishlist): Promise<Wishlist> {
  const res = await api.post('/wishlists', data);
  return res.data;
}
