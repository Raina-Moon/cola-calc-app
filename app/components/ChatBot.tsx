import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { caculateMaxCola } from "@/utils/calculator";
import { useChatFlow } from "../store/useChatFlow";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getDailyCola } from "../api/cola";

interface Props {
  sum: number;
  filter: "original" | "zero";
}

const ChatBot = ({ sum, filter }: Props) => {
  const [dailyData, setDailyData] = useState<number[]>([]);
  const [typedMsg, setTypedMsg] = useState("");
  const [isFirst, setIsFirst] = useState(true);

  const user = useAuthStore((state) => state.user);
  const weight = user?.weight;
  const max = caculateMaxCola(
    Number(weight),
    filter === "original" ? "ORIGINAL" : "ZERO"
  );
  const overLimit = dailyData.filter((data) => data > max).length >= 3;
  const isLate = new Date().getHours() >= 22;

  const bubbleAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchWeekly = async () => {
      const start = new Date();
      start.setDate(start.getDate() - 6);
      const colaType = filter === "original" ? "ORIGINAL" : "ZERO";

      const newData: number[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        const data = await getDailyCola(date, colaType);
        newData.push(typeof data === "number" ? data : 0);
      }
      setDailyData(newData);
    };
    fetchWeekly();
  }, [filter]);

  const { message, option, setStep } = useChatFlow({
    sum,
    max: Math.floor(max),
    colaType: filter === "original" ? "ORIGINAL" : "ZERO",
    lateMessage: isLate
      ? "It's late! Caffeine might disturb your sleep 💤"
      : "",
    overLimitMessage: overLimit
      ? "\n⚠️ You've exceeded your limit 3 or more times this week!"
      : "",
  });

  useEffect(() => {
    setTypedMsg("");
    const isStart = message.startsWith("Hey there!");
    setIsFirst(isStart);

    if (isStart) {
      Animated.parallel([
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      setTypedMsg(message);
    } else {
      const interval = setInterval(() => {
        setTypedMsg((prev) => {
          if (prev.length < message.length) {
            return prev + message.charAt(prev.length);
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [message]);

  const getOptionColor = (idx: number) => {
    const colors = ["#fe4a4a", "#fe7676", "#ff9f9f"];
    return colors[idx];
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatRow}>
        <Image
          source={require(`../../assets/images/colafairy.png`)}
          style={styles.fairy}
        />
        <Animated.View
          style={
            isFirst
              ? [
                  styles.bubbleLeft,
                  {
                    transform: [{ translateY: bubbleAnim }],
                    opacity: opacityAnim,
                  },
                ]
              : styles.bubbleLeft
          }
        >
          <Text style={styles.message}>{typedMsg}</Text>
        </Animated.View>
      </View>
      <View style={styles.chatRowUser}>
        {option.map((item, idx) => (
          <Animated.View
            style={[
              { transform: [{ translateY: bubbleAnim }], opacity: opacityAnim },
            ]}
            key={idx}
          >
            <TouchableOpacity
              onPress={() => setStep(item.next)}
              style={[
                styles.optionButton,
                { backgroundColor: getOptionColor(idx) },
              ]}
            >
              <Text style={styles.optionText}>{item.text}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#fd8e8e",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  fairy: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  message: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Jersey15_400Regular",
  },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
    color: "#000",
    fontFamily: "Jersey15_400Regular",
  },
  chatRowUser: {
    alignItems: "flex-end",
    gap: 6,
    marginTop: 8,
  },
  bubbleLeft: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: "#f0f0f0",
    maxWidth: "80%",
  },
});
