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

  const router = useRouter();

  const setLoading = useGlobalLoadingStore((state) => state.setLoading);

  const handleSignup = async () => {
    setErrorMessage("");
    const iscompleted = name && year && month && day && weight;
    if (!iscompleted) return;

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
            onChangeText={setName}
            style={styles.input}
          />
          <Text style={styles.inputText}>Birthday</Text>
          <View>
            <Text>Month</Text>
            <TextInput onChangeText={setMonth} placeholder="Month" />
            <Text>Day</Text>
            <TextInput onChangeText={setDay} placeholder="Day" />
            <Text>Year</Text>
            <TextInput onChangeText={setYear} placeholder="Year" />
          </View>
          <Text style={styles.inputText}>Weight (Kg)</Text>
          <TextInput
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Enter your weight"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSignup}>
            <Text>Sign Up</Text>
          </TouchableOpacity>

          {errorMessage ? <Text>{errorMessage}</Text> : null}
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
});
