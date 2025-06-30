export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  displayPicture: string | null;
  bio: string | null;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}
