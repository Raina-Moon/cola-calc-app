import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/authStore";

const SideBar = () => {
  const [selected, setSelected] = useState("home");
  const router = useRouter();

  const userName = useAuthStore((state) => state.user?.name);
  const handleSelect = (item: string) => {
    setSelected(item);
    switch (item) {
      case "home":
        router.replace("/home");
        break;
      case "settings":
        router.replace("/settings");
        break;
      case "logout":
        router.replace("/logout");
        break;
      default:
        break;
    }
  };

  const itemList = [
    { id: "home", name: "Home" },
    { id: "settings", name: "Settings" },
    { id: "logout", name: "Logout" },
  ];
  return (
    <View>
      <TouchableOpacity onPress={() => router.replace("/profile")}>
        <Text>
          Hi!
          <Text style={{ textDecorationLine: "underline" }}>{userName}</Text>
        </Text>
      </TouchableOpacity>
      {itemList.map((item) => (
        <View key={item.id}>
          <Text onPress={() => handleSelect(item.id)}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default SideBar;
