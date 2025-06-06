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
  const [weight, setWeight] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [weightError, setWeightError] = useState("");
  const [nameError, setNameError] = useState("");

  const router = useRouter();

  const setLoading = useGlobalLoadingStore((state) => state.setLoading);

  const handleSignup = async () => {
    setErrorMessage("");
    setWeightError("");
    setNameError("");

    let hasError = false;

 
    const weightNum = parseInt(weight, 10);

    if (isNaN(weightNum) || weightNum <= 0) {
      setWeightError("Please enter a valid weight.");
      hasError = true;
    }

    if (!name) {
      setNameError("Please enter your name.");
      hasError = true;
    }

    if (hasError) return;


    try {
      setLoading(true);
      await register(name, Number(weight));
      await login(name);
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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
        >
          <Text style={styles.title}>You sip. We sense.</Text>
          <Text style={styles.subtitle}>
            Welcome to the fizzy future of self-awareness.
          </Text>
          <Text style={styles.inputText}>Name</Text>
          <TextInput
            placeholder="Put your name here..."
            placeholderTextColor="#888"
            onChangeText={setName}
            style={[
              styles.input,
              nameError
                ? { borderColor: "#ff0000" }
                : { borderColor: "#141414" },
            ]}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          
          <Text style={styles.inputText}>Weight (Kg)</Text>
          <TextInput
            onChangeText={(text) => {
              setWeight(text);
              setWeightError("");
            }}
            keyboardType="numeric"
            placeholder="Enter your weight"
            placeholderTextColor="#888"
            style={[
              styles.input,
              weightError
                ? { borderColor: "#ff0000" }
                : { borderColor: "#141414" },
            ]}
          />
          {weightError ? (
            <Text style={styles.errorText}>{weightError}</Text>
          ) : null}
          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text
              style={{ color: "#141414", fontFamily: "Jersey15_400Regular" }}
            >
              Already Have Account?
            </Text>
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
  inputText: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    color: "#141414",
    marginLeft: "10%",
    marginBottom: 8,
    marginTop: 10,
    fontFamily: "Jersey15_400Regular",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
color: "#141414 !important",  },
  errorText: {
    color: "#ff0000",
    fontSize: 9,
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginTop: 3,
    fontFamily: "Jersey15_400Regular",
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
    fontFamily: "Jersey15_400Regular",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#141414",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "Jersey15_400Regular",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Jersey15_400Regular",
  },
});
