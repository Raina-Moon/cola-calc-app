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
import ChatBot from "./components/ChatBot";

type FilterType = "original" | "zero";
const { width } = Dimensions.get("window");

const home = () => {
  const [filter, setFilter] = useState<FilterType>("original");
  const [sum, setSum] = useState(0);
  const fillAnim = useRef(new Animated.Value(0)).current;

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
      <View>
        <Text
          style={{
            fontFamily: "Jersey15_400Regular",
            fontSize: 24,
            textAlign: "center",
          }}
        >
          You Drank {sum} ml of Cola Today!
        </Text>
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

      <ChatBot sum={sum} filter={filter} />
    </ScrollView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    alignContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
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
    marginBottom: 40,
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
    fontFamily: "Jersey15_400Regular",
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
    marginTop: 20,
    marginBottom: 20,
  },
  filledBar: {
    height: "100%",
    backgroundColor: "#fd3333",
    position: "absolute",
    flexDirection: "row",
  },
  maxText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    color: "#0c0c0c",
    fontFamily: "Jersey15_400Regular",
  },
});
