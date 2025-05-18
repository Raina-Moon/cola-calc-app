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
import { login } from "./api/auth";
import { useGlobalLoadingStore } from "./store/useGlobalLoadingStore ";

export default function loginPage() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const setLoading = useGlobalLoadingStore((state) => state.setLoading);

  const handleLogin = async () => {
    const isCompleted = name && year && month && day;
    if (!isCompleted) return;

    const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    try {
      setLoading(true);
      await login(name, birthday);
      router.replace("/home");
    } catch (error) {
      setError("Invalid name or birthday. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Sip in and let's sense together 🥤
          </Text>
          <Text style={styles.inputText}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            onChangeText={setName}
            value={name}
            placeholderTextColor="#888"
            style={styles.input}
          />
          <Text style={styles.inputText}>Birthday</Text>
          <View style={styles.birthdayContainer}>
            <View style={styles.birthdayColumn}>
              <Text style={styles.birthdayLabel}>Month</Text>
              <TextInput
                placeholder="MM"
                onChangeText={setMonth}
                value={month}
                placeholderTextColor="#888"
                keyboardType="numeric"
                style={styles.birthdayInput}
              />
            </View>
            <View style={styles.birthdayColumn}>
              <Text style={styles.birthdayLabel}>Day</Text>
              <TextInput
                placeholder="DD"
                onChangeText={setDay}
                value={day}
                keyboardType="numeric"
                placeholderTextColor="#888"
                style={styles.birthdayInput}
              />
            </View>
            <View style={styles.birthdayColumn}>
              <Text style={styles.birthdayLabel}>Year</Text>
              <TextInput
                placeholder="YYYY"
                onChangeText={setYear}
                value={year}
                placeholderTextColor="#888"
                keyboardType="numeric"
                style={styles.birthdayInput}
              />
            </View>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

          <TouchableOpacity onPress={() => router.replace("/signup")}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#141414",
    textAlign: "center",
    marginBottom: 4,
    fontFamily:"Jersey15_400Regular"
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    fontFamily:"Jersey15_400Regular"
  },
  inputText: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    color: "#141414",
    marginLeft: "10%",
    marginBottom: 8,
    marginTop: 10,
    fontFamily:"Jersey15_400Regular"
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderColor: "#141414",
  },
  birthdayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  birthdayColumn: {
    flex: 1,
    alignItems: "center",
  },
  birthdayLabel: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "500",
    color: "#141414",
    alignSelf: "flex-start",
    marginLeft: "5%",
    fontFamily:"Jersey15_400Regular"
  },
  birthdayInput: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    color: "#141414",
    borderColor: "#141414",
  },
  button: {
    backgroundColor: "#ee0202",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    fontFamily:"Jersey15_400Regular" 
  },
  linkText: {
    color: "#141414",
    fontSize: 14,
    textAlign: "center",
    fontFamily:"Jersey15_400Regular"
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    fontFamily:"Jersey15_400Regular"
  },
});
