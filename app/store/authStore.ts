import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

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
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
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
    if (user && accessToken && refreshToken)
      return set({ user: JSON.parse(user), accessToken, refreshToken });
  },
}));
