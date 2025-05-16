import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import API from "../api/axios";

interface User {
  id: number;
  name: string;
  birthday: string;
  weight: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<User | null>;
  refeshAccessToken: () => Promise<string>;
  updateUser: (updatedUser: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  login: async (user, accessToken, refreshToken) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    set({ user, accessToken, refreshToken });
  },
  logout: async () => {
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    set({ user: null, accessToken: null, refreshToken: null });
  },
  loadFromStorage: async () => {
    const user = await AsyncStorage.getItem("user");
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (user && accessToken && refreshToken) {
      const parsedUser = JSON.parse(user);
      set({ user: parsedUser, accessToken, refreshToken });
      return parsedUser;
    } else {
      await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
      set({ user: null, accessToken: null, refreshToken: null });
      return null;
    }
  },

  refeshAccessToken: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) throw new Error("No refresh token found");
    try {
      const res = await API.post("/auth/refresh", { refreshToken });
      const newAccessToken = res.data.accessToken;
      await AsyncStorage.setItem("accessToken", newAccessToken);
      set({ accessToken: newAccessToken });
      return newAccessToken;
    } catch (err: any) {
      await get().logout();
      throw err;
    }
  },
  updateUser: async (updatedUser: User) => {
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
