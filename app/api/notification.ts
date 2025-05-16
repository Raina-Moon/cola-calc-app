import { useAuthStore } from "../store/authStore";
import API from "./axios";

export const getNotification = async () => {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) throw new Error("User not found");

  const res = await API.get(`/notification/${userId}`);

  if (res.status !== 200) {
    throw new Error("Failed to get notification");
  }

  return res.data;
};

export const markNotifAsRead = async (id : number) => {
    const res = await API.patch(`/notification/${id}`)

    if(res.status !== 200) {
        throw new Error("Failed to mark notification as read");
    }

    return res.data;
}