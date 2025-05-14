import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { login, register } from "./api/auth";
import { useGlobalLoadingStore } from "./store/useGlobalLoadingStore ";

export default function Signup() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [weight, setWeight] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [monthError, setMonthError] = useState("");
  const [dayError, setDayError] = useState("");
  const [yearError, setYearError] = useState("");
  const [weightError, setWeightError] = useState("");

  const router = useRouter();

  const setLoading = useGlobalLoadingStore((state) => state.setLoading);

  const handleSignup = async () => {
    setErrorMessage("");
    setMonthError("");
    setDayError("");
    setYearError("");
    setWeightError("");

    let hasError = false;

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);
    const weightNum = parseInt(weight, 10);

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      setMonthError("Invalid month. Please enter a valid month (1-12).");
      hasError = true;
    }

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      setDayError("Invalid day. Please enter a valid day (1-31).");
      hasError = true;
    }

    if (
      isNaN(yearNum) ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear()
    ) {
      setYearError("Invalid year. Please enter a valid year.");
      hasError = true;
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      setWeightError("Invalid weight. Please enter a valid weight.");
      hasError = true;
    }

    if (!name || !year || !month || !day || !weight) {
      setErrorMessage("Please fill in all fields.");
      hasError = true;
    }

    if (hasError) return;

    const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    try {
      setLoading(true);
      await register(name, birthday, Number(weight));
      await login(name, birthday);
      router.replace("/home");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 409) {
        setErrorMessage("User already exists. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.inputText}>Name</Text>
          <TextInput
            placeholder="Put your name here..."
            placeholderTextColor="#888"
            onChangeText={setName}
            style={styles.input}
          />
          <Text style={styles.inputText}>Birthday</Text>
          <View style={styles.birthdayContainer}>
            <View style={styles.birthdayColumn}>
              <Text style={styles.birthdayLabel}>Month</Text>
              <TextInput
                onChangeText={(text) => {
                  setMonth(text);
                  setMonthError("");
                }}
                placeholder="MM"
                keyboardType="numeric"
                style={styles.birthdayInput}
                placeholderTextColor="#888"
              />
              {monthError ? (
                <Text style={styles.errorText}>{monthError}</Text>
              ) : null}
            </View>

            <View style={styles.birthdayColumn}>
              <Text style={styles.birthdayLabel}>Day</Text>
              <TextInput
                onChangeText={(text) => {
                  setDay(text);
                  setDayError("");
                }}
                placeholder="DD"
                keyboardType="numeric"
                style={styles.birthdayInput}
                placeholderTextColor="#888"
              />
              {dayError ? (
                <Text style={styles.errorText}>{dayError}</Text>
              ) : null}
            </View>

            <View style={styles.birthdayColumn}>
              <Text style={styles.birthdayLabel}>Year</Text>
              <TextInput
                onChangeText={(text) => {
                  setYear(text);
                  setYearError("");
                }}
                placeholder="YYYY"
                keyboardType="numeric"
                style={styles.birthdayInput}
                placeholderTextColor="#888"
              />
              {yearError ? (
                <Text style={styles.errorText}>{yearError}</Text>
              ) : null}
            </View>
          </View>
          <Text style={styles.inputText}>Weight (Kg)</Text>
          <TextInput
            onChangeText={(text) => {
              setWeight(text);
              setWeightError("");
            }}
            keyboardType="numeric"
            placeholder="Enter your weight"
            placeholderTextColor="#888"
            style={styles.input}
          />
          {weightError ? (
            <Text style={styles.errorText}>{weightError}</Text>
          ) : null}
          <TouchableOpacity onPress={handleSignup}>
            <Text>Sign Up</Text>
          </TouchableOpacity>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text>Already Have Account?</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  birthdayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  birthdayColumn: {
    flex: 1,
    alignItems: "center",
  },
  birthdayLabel: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "500",
  },
  birthdayInput: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    color: "#000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
});
