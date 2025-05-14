import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { refreshAccessToken } from "./auth";
import Constants from "expo-constants";

const API = axios.create({ baseURL: Constants.expoConfig?.extra?.API_URL });

API.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.resonse?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        await useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
