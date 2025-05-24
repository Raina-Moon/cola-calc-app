import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../store/authStore";
import API from "./axios";

export const register = async (
  name: string,
  weight: number
) => {
  const res = await API.post("/user", {
    name,
    weight,
  });

  if (res.status !== 201) {
    throw new Error("Failed to register");
  }

  return res.data;
};

export const login = async (name: string) => {
  const res = await API.post("/auth/login", {
    name,
  });

  if (res.status !== 200) throw new Error("Failed to login");

  const { accessToken, refreshtoken, user } = res.data;
  await useAuthStore.getState().login(user, accessToken, refreshtoken);

  return user;
};

export const profilePatch = async () => {
  const user = useAuthStore.getState().user;
  const res = await API.patch(`/user/${user?.id}`, {
    weight: user?.weight,
  });

  if (res.status !== 200) {
    throw new Error("Failed to update profile");
  }

  await useAuthStore.getState().updateUser(res.data);

  return res.data;
};

export const refreshAccessToken = async () => {
  const refreshtoken = useAuthStore.getState().refreshToken;

  if (!refreshtoken) throw new Error("No refresh token found");

  try {
    const res = await API.post("/auth/refresh", {
      refreshtoken: refreshtoken,
    });

    const newAccessToken = res.data.accessToken;
    await AsyncStorage.setItem("accessToken", newAccessToken);
    useAuthStore.setState({ accessToken: newAccessToken });
    return newAccessToken;
  } catch (err) {
    await useAuthStore.getState().logout();
    throw new Error("Failed to refresh access token");
  }
};
