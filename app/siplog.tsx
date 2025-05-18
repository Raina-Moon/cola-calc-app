import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    value: 0,
    visible: false,
  });

  const user = useAuthStore((state) => state.user);

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

  const totalIntake = {
    daily: dailyData.reduce((acc, val) => acc + val, 0),
    monthly: monthlyData.reduce((acc, val) => acc + val, 0),
    yearly: yearlyData.reduce((acc, val) => acc + val, 0),
  };

  const intakePerKg = {
    daily: totalIntake.daily / (user?.weight || 60),
    monthly: totalIntake.monthly / (user?.weight || 60),
    yearly: totalIntake.yearly / (user?.weight || 60),
  };

  const calculateHealthScore = (intake: number, type: "original" | "zero") => {
    if (type === "original") {
      if (intake > 20) return 30;
      if (intake > 15) return 50;
      if (intake > 10) return 70;
      if (intake > 5) return 85;
      return 100;
    } else {
      if (intake > 20) return 50;
      if (intake > 15) return 70;
      if (intake > 10) return 85;
      if (intake > 5) return 95;
      return 100;
    }
  };

  const dailyScore = calculateHealthScore(
    intakePerKg.daily,
    selectedType as "original" | "zero"
  );
  const monthlyScore = calculateHealthScore(
    intakePerKg.monthly,
    selectedType as "original" | "zero"
  );
  const yearlyScore = calculateHealthScore(
    intakePerKg.yearly,
    selectedType as "original" | "zero"
  );

  const generateHealthReport = () => {
    if (!user) return;
    const riskMsgOriginal = (value: number, label: string) => {
      if (value > 15) {
        return `⚠️ Your ${label} intake of original cola is very high relative to your body weight. High sugar intake may increase your risk of diabetes, fatty liver, and obesity.`;
      } else if (value > 10) {
        return `🟠 Your ${label} intake is a bit high. Be cautious about potential weight gain and tooth decay.`;
      } else if (value > 5) {
        return `🟢 Your ${label} intake is moderate. Try to reduce it further for better health.`;
      } else {
        return `💚 Your ${label} intake is low. You're managing your health well—keep it up!`;
      }
    };

    const riskMsgZero = (value: number, label: string) => {
      if (value > 15)
        return `⚠️ ${label} intake is high. Watch out for sweeteners.`;
      if (value > 10) return `🟠 ${label} intake is a bit high.`;
      if (value > 5) return `🟢 ${label} intake is okay.`;
      return `💚 ${label} intake is low.`;
    };

    const riskMsg = selectedType === "original" ? riskMsgOriginal : riskMsgZero;

    return (
      <View style={styles.card}>

        {selectedPeriod === "daily" && (
          <>
            <Text style={styles.reportText}>
              📅 Last 7 Days: {totalIntake.daily}ml
            </Text>
            <Text style={styles.reportText}>
              👉 {riskMsg(intakePerKg.daily, "Daily")}
            </Text>
            <Text style={styles.reportText}>🧪 Score: {dailyScore}/100</Text>
            <View style={styles.divider} />
          </>
        )}

        {selectedPeriod === "monthly" && (
          <>
            <Text style={styles.reportText}>
              📅 Last 12 Months: {totalIntake.monthly}ml
            </Text>
            <Text style={styles.reportText}>
              👉 {riskMsg(intakePerKg.monthly, "Monthly")}
            </Text>
            <Text style={styles.reportText}>🧪 Score: {monthlyScore}/100</Text>
            <View style={styles.divider} />
          </>
        )}

        {selectedPeriod === "yearly" && (
          <>
            <Text style={styles.reportText}>
              📅 Last 6 Years: {totalIntake.yearly}ml
            </Text>
            <Text style={styles.reportText}>
              👉 {riskMsg(intakePerKg.yearly, "Yearly")}
            </Text>
            <Text style={styles.reportText}>🧪 Score: {yearlyScore}/100</Text>
            <View style={styles.divider} />
          </>
        )}
      </View>
    );
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
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.header}>{user?.name}'s sip log</Text>
        <View style={styles.dropdownContainer}>
          <DropDown
            selectedValue={selectedPeriod}
            options={["daily", "monthly", "yearly"]}
            onSelect={(val) =>
              setSelectedPeriod(val as "daily" | "monthly" | "yearly")
            }
          />
        </View>

        <View style={styles.typeButtonRow}>
          {["original", "zero"].map((type) => {
            const active = selectedType === type;
            return (
              <TouchableOpacity
                onPress={() => setSelectedType(type)}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.typeButtonActive,
                ]}
                key={type}
              >
                <Text
                  style={
                    active ? styles.typeButtonTextActive : styles.typeButtonText
                  }
                >
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ position: "relative" }}>
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
              width={screenWidth - 30}
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
              onDataPointClick={({ value, x, y }) => {
                setTooltipPos({ x, y, value, visible: true });
              }}
              decorator={() => {
                return tooltipPos.visible ? (
                  <View
                    style={{
                      position: "absolute",
                      top: tooltipPos.y - 40,
                      left: tooltipPos.x - 30,
                      backgroundColor: "#fff",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {tooltipPos.value}ml
                    </Text>
                  </View>
                ) : null;
              }}
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
                      monthlyData.length === 12
                        ? monthlyData
                        : Array(12).fill(0),
                  },
                ],
              }}
              width={screenWidth - 30}
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
                  strokeWidth: "2",
                  stroke: "#ff0000",
                },
                fillShadowGradient: "#ff0000",
                fillShadowGradientOpacity: 0.8,
              }}
              bezier
              style={{ marginVertical: 20, borderRadius: 10 }}
              onDataPointClick={({ value, x, y }) => {
                setTooltipPos({ x, y, value, visible: true });
              }}
              decorator={() => {
                return tooltipPos.visible ? (
                  <View
                    style={{
                      position: "absolute",
                      top: tooltipPos.y - 40,
                      left: tooltipPos.x - 30,
                      backgroundColor: "#fff",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {tooltipPos.value}ml
                    </Text>
                  </View>
                ) : null;
              }}
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
                    data:
                      yearlyData.length === 6 ? yearlyData : Array(6).fill(0),
                  },
                ],
              }}
              width={screenWidth - 30}
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
              onDataPointClick={({ value, x, y }) => {
                setTooltipPos({ x, y, value, visible: true });
              }}
              decorator={() => {
                return tooltipPos.visible ? (
                  <View
                    style={{
                      position: "absolute",
                      top: tooltipPos.y - 40,
                      left: tooltipPos.x - 30,
                      backgroundColor: "#fff",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {tooltipPos.value}ml
                    </Text>
                  </View>
                ) : null;
              }}
            />
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Report</Text>
          <Text style={styles.reportText}>{generateHealthReport()}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default siplog;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#141414",
    fontFamily: "Jersey15_400Regular",
  },
  dropdownContainer: {
    width: "80%",
    marginBottom: 15,
  },
  typeButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginBottom: 20,
    gap: 20,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor: "#ff2727",
    borderWidth: 1,
  },
  typeButtonActive: {
    backgroundColor: "#ff2727",
  },
  typeButtonText: {
    color: "#141414",
    fontFamily: "Jersey15_400Regular",
    fontSize: 18,
  },
  typeButtonTextActive: {
    color: "#fff",
    fontFamily: "Jersey15_400Regular",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#2e2e2e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Jersey15_400Regular",
  },
  reportText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jersey15_400Regular",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 12,
  },
});
