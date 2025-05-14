import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_URL = "http://54.161.66.184/5000/api";

export const register = async (
  name: string,
  birthday: string,
  weight: number
) => {
  const res = await axios.post(
    `${API_URL}/user`,
    {
      name,
      birthday,
      weight,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status !== 201) {
    throw new Error("Failed to register");
  }

  return res.data;
};

export const login = async (name: string, birthday: string) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    name,
    birthday,
  });

  if (res.status !== 200) throw new Error("Failed to login");

  const { accessToken, refreshtoken, user } = res.data;
  await useAuthStore.getState().login(user, accessToken, refreshtoken);

  return user;
};

export const refreshAccessToken = async () => {
  const refreshtoken = useAuthStore.getState().refreshToken;

  if (!refreshtoken) throw new Error("No refresh token found");

  try {
    const res = await axios.post(`${API_URL}/auth/refresh`, {
      refreshtoken: refreshtoken,
    });

    const newAccessToken = res.data.accessToken;

    useAuthStore.setState({ accessToken: newAccessToken });
    return newAccessToken;
  } catch (err) {
    await useAuthStore.getState().logout();
    throw new Error("Failed to refresh access token");
  }
};
