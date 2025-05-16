import { useAuthStore } from "../store/authStore";
import API from "./axios";

type ColaType = "ORIGINAL" | "ZERO";
export const postCola = async (amount: number, type: ColaType) => {
  try {
    const res = await API.post("/cola", {
      amount,
      type,
    });

    if (res.status !== 201) {
      throw new Error("Failed to get cola");
    }

    return res.data;
  } catch (err: any) {
    throw err;
  }
};

export const getDailyCola = async (date: Date, type: ColaType) => {
  const config = {
    params: {
      date: date.toISOString().split("T")[0],
      type,
    },
  };

  try {
    const res = await API.get("/cola/daily", config);

    if (res.status !== 200) {
      throw new Error("Failed to get daily cola");
    }

    return res.data.totalMl;
  } catch (err: any) {
    throw err;
  }
};

export const getMonthlyCola = async (date: Date, type: ColaType) => {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("User not found");

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const res = await API.get("/cola/monthly", {
    params: {
      year,
      month,
      type,
    },
  });
  if (res.status !== 200) {
    throw new Error("Failed to get monthly cola");
  }

  return res.data.totalMl;
};

export const getYearlyCola = async (date: Date, type: ColaType) => {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("User not found");

  const year = date.getFullYear();

  const res = await API.get("/cola/yearly", {
    params: {
      year,
      type,
    },
  });
  if (res.status !== 200) {
    throw new Error("Failed to get yearly cola");
  }

  return res.data.totalMl;
};
