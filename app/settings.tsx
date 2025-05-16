import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
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
    <View>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Toggle Notifications!
      </Text>
      <Switch
        value={enabled}
        onValueChange={toggleSwitch}
        thumbColor={enabled ? "#fff" : "#ccc"}
        trackColor={{ false: "#888", true: "#4CAF50" }}
      />
    </View>
  );
};

export default settings;
