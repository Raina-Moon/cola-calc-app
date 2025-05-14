import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
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

  const setLoading = useGlobalLoadingStore((state) => state.setLoading)

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
    <KeyboardAvoidingView>
      <ScrollView>
        <Text>Login</Text>
        <Text>Name</Text>
        <TextInput placeholder="Name" onChangeText={setName} value={name} />
        <Text>Birthday</Text>
        <Text>Year</Text>
        <TextInput placeholder="Year" onChangeText={setYear} value={year} />
        <Text>Month</Text>
        <TextInput placeholder="Month" onChangeText={setMonth} value={month} />
        <Text>Day</Text>
        <TextInput placeholder="Day" onChangeText={setDay} value={day} />

        <TouchableOpacity onPress={handleLogin}>
          <Text>Login</Text>
        </TouchableOpacity>

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
