import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";
import { useAuthStore } from "./store/authStore";

const { width } = Dimensions.get("window");

interface Bubble {
  id: number;
  x: number;
  size: number;
  anim: Animated.Value;
  opacity: Animated.Value;
}

export default function Index() {
  const [ready, setReady] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const scaleAnim = new Animated.Value(0);
  const bubbleId = useRef(0);
  const router = useRouter();

  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const startAnimation = async () => {
      await loadFromStorage()
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(async () => {
        await SplashScreen.hideAsync();
        setReady(true);


        setTimeout(() => {
          if (user) {
            router.replace("/home");
          } else {
            router.replace("/userStorage");
          }
        }, 1000);
      });
    };
    startAnimation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      addBubble();
      addBubble();
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const addBubble = () => {
    const id = bubbleId.current++;
    const size = Math.random() * 20 + 10;
    const logoCenterX = width / 2;
    const x = logoCenterX + Math.random() * 200 - 100;

    const anim = new Animated.Value(0);
    const opacity = new Animated.Value(1);

    const newBubble: Bubble = {
      id,
      x,
      size,
      anim,
      opacity,
    };
    setBubbles((prev) => [...prev, newBubble]);

    Animated.parallel([
      Animated.timing(anim, {
        toValue: -150,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    });
  };

  return (
    <View style={styles.container}>
      {bubbles.map((bubble) => (
        <Animated.View
          key={bubble.id}
          style={[
            styles.bubble,
            {
              width: bubble.size,
              height: bubble.size,
              left: bubble.x,
              opacity: bubble.opacity,
              transform: [{ translateY: bubble.anim }],
            },
          ]}
        />
      ))}
      <Image
        source={require(`../assets/images/sipsense.png`)}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignContent: "center",
  },
  logo: {
    width: 300,
    height: 150,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      {
        translateX: -150,
      },
      { translateY: -150 },
    ],
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(121, 47, 47, 0.5)",
    borderRadius: 50,
  },
});
