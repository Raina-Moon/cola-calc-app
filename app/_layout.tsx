import { Stack } from "expo-router";
import { useGlobalLoadingStore } from "./store/useGlobalLoadingStore ";
import { ActivityIndicator, View } from "react-native";

const GlobalLoading = () => {
  const loading = useGlobalLoadingStore((state) => state.loading);

  if (!loading) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};
export default function RootLayout() {
  return (
    <>
      <Stack />
      <GlobalLoading />
    </>
  );
}
