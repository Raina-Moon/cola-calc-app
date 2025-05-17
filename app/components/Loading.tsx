import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { Image, View } from "react-native";

const Loading = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require(`../../assets/images/colafairy.png`)}
        style={styles.image}
      />
      <Text style={styles.text}>Fetching your sip data...</Text>
      <ActivityIndicator
        size="large"
        color="#ff4d4d"
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    color: "#202020",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
