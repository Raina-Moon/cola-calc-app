import { create } from "zustand";

type Notification = {
  id: number;
  message: string;
  isRead: boolean;
};

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  addNotification: (msg: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((noti) =>
        noti.id === id ? { ...noti, isRead: true } : noti
      ),
    })),
  addNotification: (msg) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now(),
          message: msg,
          isRead: false,
        },
      ],
    })),
}));
