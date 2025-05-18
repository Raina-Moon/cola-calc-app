import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useAuthStore } from "./store/authStore";
import { toggleNotif } from "./api/notification";

const settings = () => {
  const [enabled, setEnabled] = useState(true);
  const user = useAuthStore((state) => state.user);
  const updated = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (user) {
      setEnabled(user.notificationEnabled);
    }
  }, [user]);

  const toggleSwitch = async (val: boolean) => {
    if (!user) return;
    try {
      const updatedUser = await toggleNotif(user.id, val);
      updated(updatedUser);
      setEnabled(val);
    } catch (error) {
      console.error("Error toggling notification:", error);
      alert("Failed to update notification settings");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.card}>
      <Text style={styles.label}>
        🔔 Enable Notification
      </Text>
      <Switch
        value={enabled}
        onValueChange={toggleSwitch}
        thumbColor={enabled ? "#fff" : "#ccc"}
        trackColor={{ false: "#888", true: "#4CAF50" }}
      />
      </View>
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ff4747",
  },
  header : {
    fontSize: 32,
    marginVertical: 20,
    color: "#fff",
    fontFamily: "Jersey15_400Regular",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  label : {
    fontSize: 18,
    marginBottom: 10,
    color: "#141414",
    fontFamily: "Jersey15_400Regular",
  }
})