import { apiClient } from "./client";
import { AuthUser } from "../types";

type AuthResponse = {
  user: AuthUser;
};

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>("/api/auth/login", { email, password });
    return data.user;
  },
  async register(fullName: string, email: string, password: string) {
    const { data } = await apiClient.post<AuthResponse>("/api/auth/register", { fullName, email, password });
    return data.user;
  },
  async me() {
    const { data } = await apiClient.get<AuthResponse>("/api/auth/me");
    return data.user;
  },
  async logout() {
    await apiClient.post("/api/auth/logout");
  },
};
