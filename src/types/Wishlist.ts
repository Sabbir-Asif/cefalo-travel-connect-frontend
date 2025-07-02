import type { UserResponse } from "./User";

export type WishlistStatus = "PRIVATE" | "PUBLIC"
export interface Wishlist {
  id: string;
  user_id: string;
  title: string;
  location_name: string;
  location_point: {
    lat: number;
    long: number;
  };
  travel_date: Date;
  tags: string[];
  note?: string;
  blog_id?: string | null;
  travel_place_id?: string | null;
  cover_image?: string;
  status: WishlistStatus;
  created_at: Date;
  updated_at: Date;
}

export interface WishlistWithUser {
  id: string;
  user_id: string;
  user: UserResponse;
  title: string;
  location_name: string;
  location_point: {
    lat: number;
    long: number;
  };
  travel_date: Date;
  tags: string[];
  note?: string;
  blog_id?: string | null;
  travel_place_id?: string | null;
  cover_image?: string;
  status: WishlistStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWishlist {
  title: string;
  location_name: string;
  location_point: {
    lat: number;
    long: number;
  };
  travel_date: Date | string;
  tags?: string[];
  note?: string;
  blog_id?: string;
  travel_place_id?: string;
  cover_image?: string;
  status?: WishlistStatus;
}

export interface UpdateWishlist {
  title?: string;
  location_name?: string;
  location_point?: {
    lat: number;
    long: number;
  };
  travel_date?: Date | string;
  tags?: string[];
  note?: string;
  blog_id?: string | null;
  travel_place_id?: string | null;
  cover_image?: string;
  status?: WishlistStatus;
}
