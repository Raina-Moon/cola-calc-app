import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

interface Props {
  onClose: () => void;
}
const SideBar = ({ onClose }: Props) => {
  const [selected, setSelected] = useState("home");
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const userName = useAuthStore((state) => state.user?.name);
  const logout = useAuthStore((state) => state.logout);

  const handleSelect = (item: string) => {
    setSelected(item);
    if (item === "logout") {
      setOpenModal(true);
    } else {
      router.replace(`/${item}` as `/home` | `/siplog` | `/settings`);
      onClose();
    }
  };

  const confirmLogout = async () => {
    await logout();
    setOpenModal(false);
    router.replace("/login");
  };

  const itemList = [
    { id: "home", name: "Home" },
    { id: "siplog", name: "Sip Log" },
    { id: "settings", name: "Settings" },
    { id: "logout", name: "Logout" },
  ];
  return (
    <View>
      <TouchableOpacity onPress={() => router.replace("/profile")}>
        <Text
          style={{
            color: "#fff",
            fontSize: 26,
            fontFamily: "Jersey15_400Regular",
            marginTop: 80,
          }}
        >
          Hi!
          <Text style={{ textDecorationLine: "underline" }}> {userName}</Text>
        </Text>
      </TouchableOpacity>
      {itemList.map((item) => (
        <View key={item.id}>
          <Text
            onPress={() => handleSelect(item.id)}
            style={{
              color: "#fff",
              fontSize: 22,
              marginTop: 40,
              fontFamily: "Jersey15_400Regular",
            }}
          >
            {item.name}
          </Text>
        </View>
      ))}

      {openModal && (
        <Modal
          transparent
          visible={openModal}
          animationType="fade"
          onRequestClose={() => setOpenModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                Are you sure you want to logout?
              </Text>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.yesButton}>
                  <Text onPress={confirmLogout} style={styles.yesText}>
                    Yes
                  </Text>
                </Pressable>
                <Pressable style={styles.noButton}>
                  <Text
                    onPress={() => setOpenModal(false)}
                    style={styles.noText}
                  >
                    No
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SideBar;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    width: 300,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "Jersey15_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 40,
  },
  yesButton: {
    borderColor: "#ff2727",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: "#ff2727",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesText: {
    color: "#141414",
    fontFamily: "Jersey15_400Regular",
    fontSize: 18,
  },
  noText: {
    color: "#fff",
    fontFamily: "Jersey15_400Regular",
    fontSize: 18,
  },
});
