import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text } from "react-native";
import { View } from "react-native";

const Loading = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require(`../../assets/images/colafairy.png`)}
        style={[styles.image, { transform: [{ translateY: floatAnim }] }]}
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    color: "#202020",
    fontFamily: "Jersey15_400Regular",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});
