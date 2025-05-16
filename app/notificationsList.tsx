import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNotificationStore } from "./store/notificationStore";
import { getNotification, markNotifAsRead } from "./api/notification";

const notificationsList = () => {
  const notif = useNotificationStore((state) => state.notifications);
  const isRead = useNotificationStore((state) => state.markAsRead);
  const setNotif = useNotificationStore.setState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotification();
        setNotif(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView>
      {notif.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            marginVertical: 20,
            fontSize: 18,
            color: "#141414",
          }}
        >
          No notifications yet!
        </Text>
      ) : (
        notif.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            onPress={async () => {
              try {
                await markNotifAsRead(notification.id);
                isRead(notification.id);
              } catch (err) {
                console.error(err);
                alert("Failed to mark notification as read");
              }
            }}
          >
            <View
              style={{
                backgroundColor: notification.isRead ? "#f0f0f0" : "#fff",
                padding: 10,
                marginVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text>{notification.message}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default notificationsList;
