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

type FilterType = "original" | "zero";
const { width } = Dimensions.get("window");

const home = () => {
  const [filter, setFilter] = useState<FilterType>("original");
  const [sum, setSum] = useState(0);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const weight = useAuthStore((state) => state.user?.weight);

  const max = weight
    ? caculateMaxCola(weight, filter.toUpperCase() as "ORIGINAL" | "ZERO")
    : 1;

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

  const handleSum = (value: number) => {
    setSum((num) => num + value);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
});
