export interface TravelPlaceType {
  id: string;
  user_id: string;
  name: string;
  location_name: string;
  location_point: {
    lat: number;
    long: number;
  };
  cover_image?: string;
  description?: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateTravelPlace {
  name: string;
  location_name: string;
  location_point: {
    lat: number;
    long: number;
  };
  cover_image?: string;
  description?: string;
  tags?: string[];
}