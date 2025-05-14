import axios from "axios";

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
  return res.data;
};

export const refreshAccessToken = async (refreshtoken: string) => {
  const res = await axios.post(`${API_URL}/auth/refresh`, {
    refreshtoken,
  });
  return res.data.accessToken;
};
