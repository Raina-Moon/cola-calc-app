import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { caculateMaxCola } from "@/utils/calculator";
import { useChatFlow } from "../store/useChatFlow";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getDailyCola } from "../api/cola";

interface Props {
  sum: number;
  filter: "original" | "zero";
}
const ChatBot = ({ sum, filter }: Props) => {
  const [dailyData, setDailyData] = useState<number[]>([]);
  const user = useAuthStore((state) => state.user);
  const weight = user?.weight;
  const max = caculateMaxCola(
    Number(weight),
    filter === "original" ? "ORIGINAL" : "ZERO"
  );
  const overLimit = dailyData.filter((data) => data > max).length >= 3;
  const isLate = new Date().getHours() >= 22;

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

  return (
    <View style={styles.container}>
      <View style={styles.chatRow}>
        <Image
          source={require(`../../assets/images/colafairy.png`)}
          style={styles.fairy}
        />
        <View style={styles.bubble}>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View style={styles.options}>
          {option.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setStep(item.next)}
              style={styles.optionButton}
            >
              <Text style={styles.optionText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
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
  bubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 10,
    flexShrink: 1,
  },
  message: {
    fontSize: 14,
    color: "#333",
  },
  options: {
    flexDirection: "column",
    gap: 6,
  },
  optionButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  optionText: {
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
});
