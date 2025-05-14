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
  token: string | null;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (user, token) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("token", token);
    set({ user, token });
  },
  logout: async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    set({ user: null, token: null });
  },
  loadFromStorage: async () => {
    const user = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");
    if (user && token) return set({ user: JSON.parse(user), token });
  },
}));
