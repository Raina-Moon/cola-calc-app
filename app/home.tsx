import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "./store/authStore";
import { caculateMaxCola } from "@/utils/calculator";
import { getDailyCola, postCola } from "./api/cola";
import { Ionicons } from "@expo/vector-icons";
import SideBar from "./components/SideBar";
import { useRouter } from "expo-router";

type FilterType = "original" | "zero";
const { width } = Dimensions.get("window");

const home = () => {
  const [filter, setFilter] = useState<FilterType>("original");
  const [sum, setSum] = useState(0);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width * 0.8)).current;
  const router = useRouter();

  const weight = useAuthStore((state) => state.user?.weight);

  const colaType = filter === "original" ? "ORIGINAL" : "ZERO";
  const max = weight ? caculateMaxCola(weight, colaType) : 1;

  useEffect(() => {
    if (!weight) return;
    Animated.timing(fillAnim, {
      toValue: sum / max,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [sum, weight, filter]);

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

  const colaImages: Record<FilterType, { image: any; ml: number }[]> = {
    original: [
      { image: require(`../assets/images/colasmallcan.png`), ml: 250 },
      { image: require(`../assets/images/colabigcan.png`), ml: 355 },
      { image: require(`../assets/images/colabottle.png`), ml: 355 },
      { image: require(`../assets/images/colaglass.png`), ml: 200 },
    ],
    zero: [
      { image: require(`../assets/images/zerosmallcan.png`), ml: 250 },
      { image: require(`../assets/images/zerobigcan.png`), ml: 355 },
      { image: require(`../assets/images/zerobottle.png`), ml: 500 },
      { image: require(`../assets/images/zeroglasscup.png`), ml: 200 },
    ],
  };

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const colaType = filter === "original" ? "ORIGINAL" : "ZERO";
        const total = await getDailyCola(new Date(), colaType);
        setSum(total);
      } catch (e) {
        setSum(0);
      }
    };

    fetchToday();
  }, [filter]);

  const handleSum = async (value: number) => {
    setSum((num) => num + value);
    try {
      const colaType = filter === "original" ? "ORIGINAL" : "ZERO";

      await postCola(value, colaType);
      const total = await getDailyCola(new Date(), colaType);

      setSum(total);
    } catch (error) {
      console.error("Error posting cola:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setSideBarVisible((prev) => !prev)}>
        <Ionicons name="menu" size={30} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/notificationsList")}>
        <Ionicons name="notifications" size={30} color="#000" />
      </TouchableOpacity>
      <View>
        <Text>You Drank {sum} ml of Cola Today!</Text>
        <View style={styles.barContainer}>
          <Animated.View
            style={[
              styles.filledBar,
              {
                width: fillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width * 0.8],
                }),
              },
            ]}
          ></Animated.View>
          <Text style={styles.maxText}>{Math.floor(max)}ml</Text>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter("original")}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>Original</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("zero")}
          style={styles.filterButton}
        >
          <Text style={styles.filterText}>Zero</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {colaImages[filter].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.button}
            onPress={() => handleSum(item.ml)}
          >
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      <Image source={require(`../assets/images/colafairy.png`)} />

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
            <SideBar />
          </Animated.View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    alignContent: "center",
  },
  buttonContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 80,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#181717",
    borderRadius: 5,
    margin: 5,
  },
  filterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  barContainer: {
    width: "80%",
    height: 40,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  filledBar: {
    height: "100%",
    backgroundColor: "#b02828",
    position: "absolute",
    flexDirection: "row",
  },
  bubble: {
    width: 8,
    height: 8,
    backgroundColor: "white",
    borderRadius: 4,
    position: "absolute",
  },
  maxText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
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
