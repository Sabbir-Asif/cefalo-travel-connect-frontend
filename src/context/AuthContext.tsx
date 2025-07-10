import { createContext } from "react";
import type { UserResponse } from "../types/User";

export interface AuthContextType {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    phone_number: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
