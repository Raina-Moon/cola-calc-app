import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";

interface Props {
  onMenuPress: () => void;
}

const TopBar = ({ onMenuPress }: Props) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={30} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/notificationsList")}>
        <Ionicons name="notifications" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 100,
  },
});
