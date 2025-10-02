import { apiClient } from "./client";
import { AuthUser } from "../types";

type ProfileResponse = {
  user: AuthUser;
};

export const profileApi = {
  async getProfile() {
    const { data } = await apiClient.get<ProfileResponse>("/api/profile");
    return data.user;
  },
  async updateProfile(payload: Pick<AuthUser, "fullName" | "bio" | "avatarUrl">) {
    const { data } = await apiClient.put<ProfileResponse>("/api/profile", payload);
    return data.user;
  },
};
