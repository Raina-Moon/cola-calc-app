import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "./store/authStore";
import { LineChart } from "react-native-chart-kit";
import { getDailyCola, getMonthlyCola, getYearlyCola } from "./api/cola";
import DropDown from "./components/DropDown";

const screenWidth = Dimensions.get("window").width;

const siplog = () => {
  const [dailyData, setDailyData] = useState<number[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [yearlyData, setYearlyData] = useState<number[]>([]);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "monthly" | "yearly"
  >("daily");
  const [selectedType, setSelectedType] = useState("original");
  const [isOpen, setIsOpen] = useState(true);

  const userName = useAuthStore((state) => state.user?.name);

  const isClose = () => setIsOpen(false);

  const fetchDailyData = async () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    const newData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const colaType = selectedType === "original" ? "ORIGINAL" : "ZERO";
      const data = await getDailyCola(date, colaType);
      newData.push(data);
    }
    setDailyData(newData);
  };

  const fetchMonthlyData = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const newData = Array(12).fill(0);
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);
      const colaType = selectedType === "original" ? "ORIGINAL" : "ZERO";
      const data = await getMonthlyCola(date, colaType);
      newData[i] = data;
    }
    setMonthlyData(newData);
  };

  const fetchYearlyData = async () => {
    const thisYear = new Date().getFullYear();
    const newData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(thisYear -5 + i, 0, 1);
      const colaType = selectedType === "original" ? "ORIGINAL" : "ZERO";
      const data = await getYearlyCola(date, colaType);
      newData.push(data);
    }
    setYearlyData(newData);
  };

  useEffect(() => {
    if (selectedPeriod === "daily") {
      fetchDailyData();
    }
  }, [selectedPeriod, selectedType]);

  useEffect(() => {
    if (selectedPeriod === "monthly") {
      fetchMonthlyData();
    }
  }, [selectedPeriod, selectedType]);

  useEffect(() => {
    if (selectedPeriod === "yearly") {
      fetchYearlyData();
    }
  }, [selectedPeriod, selectedType]);

  const thisYear = new Date().getFullYear();
  const yearLabels = Array.from({ length: 6 }, (_, i) => String(thisYear -5 + i));
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Text>{userName}'s sip log</Text>
      <View>
        <DropDown
          selectedValue={selectedPeriod}
          options={["daily", "monthly", "yearly"]}
          onSelect={(val) =>
            setSelectedPeriod(val as "daily" | "monthly" | "yearly")
          }
        />
      </View>

      <View>
        <TouchableOpacity onPress={() => setSelectedType("original")}>
          <Text>Original</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedType("zero")}>
          <Text>Zero</Text>
        </TouchableOpacity>
      </View>

      <View>
        {selectedPeriod === "daily" && (
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  data: dailyData,
                },
              ],
            }}
            width={screenWidth - 30}
            height={220}
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f8f8f8",
              backgroundGradientTo: "#f8f8f8",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#b02828",
              },
            }}
            bezier
            style={{ marginVertical: 20, borderRadius: 10 }}
          />
        )}
      </View>

      <View>
        {selectedPeriod === "monthly" && (
          <LineChart
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [{ data: monthlyData }],
            }}
            width={screenWidth - 30}
            height={220}
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f8f8f8",
              backgroundGradientTo: "#f8f8f8",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#b02828",
              },
            }}
            bezier
            style={{ marginVertical: 20, borderRadius: 10 }}
          />
        )}
      </View>

      <View>
        {selectedPeriod === "yearly" && (
          <LineChart
            data={{
              labels: yearLabels,
              datasets: [{ data: yearlyData }],
            }}
            width={screenWidth - 30}
            height={220}
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#f8f8f8",
              backgroundGradientTo: "#f8f8f8",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#b02828",
              },
            }}
            bezier
            style={{ marginVertical: 20, borderRadius: 10 }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default siplog;
