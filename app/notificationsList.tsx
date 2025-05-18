import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotificationStore } from "./store/notificationStore";
import { getNotification, markNotifAsRead } from "./api/notification";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalLoadingStore } from "./store/useGlobalLoadingStore ";

const notificationsList = () => {
  const notif = useNotificationStore((state) => state.notifications);
  const isRead = useNotificationStore((state) => state.markAsRead);
  const setNotif = useNotificationStore.setState;
  const setLoading = useGlobalLoadingStore((state) => state.setLoading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getNotification();
        setNotif(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {notif.length === 0 ? (
        <Text style={styles.emptyText}>No notifications yet!</Text>
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
            style={[
              styles.notificationCard,
              notification.isRead ? styles.read : styles.unread,
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome
                name={notification.isRead ? "check-circle" : "bell"}
                size={20}
                color={notification.isRead ? "#999" : "#ff4d4d"}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.messageText}>{notification.message}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default notificationsList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#999",
    fontFamily: "Jersey15_400Regular",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    backgroundColor: "#fff",
  },
  unread: {
    backgroundColor: "#ffecec",
  },
  read: {
    backgroundColor: "#f5f5f5",
  },
  iconWrapper: {
    marginRight: 12,
    marginTop: 4,
  },
  textWrapper: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Jersey15_400Regular",
  },
});
