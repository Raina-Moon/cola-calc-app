import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

const SideBar = () => {
  const [selected, setSelected] = useState("home");
  const router = useRouter();
  const handleSelect = (item: string) => {
    setSelected(item);
    switch (item) {
      case "home":
        router.replace("/home");
        break;
      case "profile":
        router.replace("/profile");
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
    { id: "profile", name: "Profile" },
    { id: "settings", name: "Settings" },
    { id: "logout", name: "Logout" },
  ];
  return (
    <View>
      {itemList.map((item) => (
        <View key={item.id}>
          <Text onPress={() => handleSelect(item.id)}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default SideBar;
