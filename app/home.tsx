import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterType = "original" | "zero";

const home = () => {
  const [filter, setFilter] = useState<FilterType>("original");

  const colaImages: Record<FilterType, any[]> = {
    original: [
      require(`../assets/images/colasmallcan.png`),
      require(`../assets/images/colabigcan.png`),
      require(`../assets/images/colabottle.png`),
      require(`../assets/images/colaglass.png`),
    ],
    zero: [
      require(`../assets/images/zerosmallcan.png`),
      require(`../assets/images/zerobigcan.png`),
      require(`../assets/images/zerobottle.png`),
      require(`../assets/images/zeroglasscup.png`),
    ],
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        {colaImages[filter].map((img, idx) => (
          <TouchableOpacity key={idx} style={styles.button}>
            <Image source={img} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
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
});
