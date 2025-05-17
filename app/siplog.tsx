import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "./store/authStore";
import { LineChart } from "react-native-chart-kit";
import { getDailyCola, getMonthlyCola, getYearlyCola } from "./api/cola";
import DropDown from "./components/DropDown";
import Loading from "./components/Loading";

const screenWidth = Dimensions.get("window").width;

const siplog = () => {
  const [dailyData, setDailyData] = useState<number[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [yearlyData, setYearlyData] = useState<number[]>([]);

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "monthly" | "yearly"
  >("daily");
  const [selectedType, setSelectedType] = useState("original");
  const [isLoading, setIsLoading] = useState(false);

  const userName = useAuthStore((state) => state.user?.name);

  const fetchDailyData = async () => {
    setIsLoading(true);
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
    setDailyData(
      newData.map((val) => (typeof val === "number" && isFinite(val) ? val : 0))
    );
    setIsLoading(false);
  };

  const fetchMonthlyData = async () => {
    setIsLoading(true);
    const today = new Date();
    const year = today.getFullYear();
    const newData = Array(12).fill(0);

    for (let i = 0; i < 12; i++) {
      const date = new Date(year, i, 1);
      const colaType = selectedType === "original" ? "ORIGINAL" : "ZERO";
      const data = await getMonthlyCola(date, colaType);
      newData[i] = data;
    }
    setMonthlyData(
      newData.map((val) => (typeof val === "number" && isFinite(val) ? val : 0))
    );
    setIsLoading(false);
  };

  const fetchYearlyData = async () => {
    setIsLoading(true);
    const thisYear = new Date().getFullYear();
    const newData = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(thisYear - 5 + i, 0, 1);
      const colaType = selectedType === "original" ? "ORIGINAL" : "ZERO";
      const data = await getYearlyCola(date, colaType);
      newData.push(data);
    }
    setYearlyData(
      newData.map((val) => (typeof val === "number" && isFinite(val) ? val : 0))
    );
    setIsLoading(false);
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
  const yearLabels = Array.from({ length: 6 }, (_, i) =>
    String(thisYear - 5 + i)
  );

  if (isLoading) return <Loading />;

  return (
    <View>
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
                  data: dailyData.length === 7 ? dailyData : Array(7).fill(0),
                },
              ],
            }}
            width={isFinite(screenWidth - 30) ? screenWidth - 30 : 300}
            height={220}
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: "#4e4e4e",
              backgroundGradientFrom: "#2b2b2b",
              backgroundGradientTo: "#2b2b2b",
              color: (opacity = 1) => `rgba(255, 99, 99, ${opacity})`,
              decimalPlaces: 0,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              fillShadowGradient: "#ff0000",
              fillShadowGradientOpacity: 0.8,
              propsForDots: {
                r: "4",
                strokeWidth: "4",
                stroke: "#ff0000",
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
              datasets: [
                {
                  data:
                    monthlyData.length === 12 ? monthlyData : Array(12).fill(0),
                },
              ],
            }}
            width={isFinite(screenWidth - 30) ? screenWidth - 30 : 300}
            height={220}
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: "#202020",
              backgroundGradientFrom: "#2b2b2b",
              backgroundGradientTo: "#2b2b2b",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 99, 99, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "4",
                stroke: "#ff0000",
              },
              fillShadowGradient: "#ff0000",
              fillShadowGradientOpacity: 0.8,
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
              datasets: [
                {
                  data: yearlyData.length === 6 ? yearlyData : Array(6).fill(0),
                },
              ],
            }}
            width={isFinite(screenWidth - 30) ? screenWidth - 30 : 300}
            height={220}
            yAxisSuffix="ml"
            chartConfig={{
              backgroundColor: "#202020",
              backgroundGradientFrom: "#2b2b2b",
              backgroundGradientTo: "#2b2b2b",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 99, 99, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "4",
                stroke: "#ff0000",
              },
              fillShadowGradient: "#ff0000",
              fillShadowGradientOpacity: 0.8,
            }}
            bezier
            style={{ marginVertical: 20, borderRadius: 10 }}
          />
        )}
      </View>
    </View>
  );
};

export default siplog;
