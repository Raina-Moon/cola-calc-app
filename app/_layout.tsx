import { Stack, usePathname } from "expo-router";
import { useGlobalLoadingStore } from "./store/useGlobalLoadingStore ";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";
import {
  useFonts as useJersey,
  Jersey15_400Regular,
} from "@expo-google-fonts/jersey-15";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";

const initializingUseAuth = () => {
  const [ready, setReady] = useState(false);
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadFromStorage();
      } finally {
        setReady(true);
      }
    };
    initialize();
  }, [loadFromStorage]);

  return ready;
};

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

const { width } = Dimensions.get("window");

export default function RootLayout() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const slideAnim = new Animated.Value(-300);
  const pathname = usePathname();

  const isReady = initializingUseAuth();

  const hideTopBarRoutes = ["/login", "/signup","/index"];
  const showTopBar = !hideTopBarRoutes.includes(pathname);

  useEffect(() => {
    if (sideBarVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [sideBarVisible]);

  const [jerseyLoaded] = useJersey({
    Jersey15_400Regular,
  });
  if (!isReady || !jerseyLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {showTopBar && (
          <SafeAreaView edges={["top"]}>
            <TopBar onMenuPress={() => setSideBarVisible((prev) => !prev)} />
          </SafeAreaView>
        )}
        <View style={{ flex: 1,marginTop:20 }}>
          <Stack screenOptions={{headerShown:false}}/>
        </View>

        {sideBarVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSideBarVisible(false)}
            style={styles.overlay}
          >
            <Animated.View
              style={[
                styles.sideBarBox,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <SideBar onClose={() => setSideBarVisible(false)} />
            </Animated.View>
          </TouchableOpacity>
        )}
        <GlobalLoading />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    zIndex: 20,
  },
  sideBarBox: {
    width: "45%",
    height: "100%",
    backgroundColor: "#de0000",
    padding: 20,
  },
});
