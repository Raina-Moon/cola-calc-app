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

export default function loginPage() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleLogin = async () => {
    const isCompleted = name && year && month && day;
    if (!isCompleted) return;

    const birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    try {
      await login(name, birthday);
      router.replace("/home");
    } catch (error) {
      setError("Invalid name or birthday. Please try again.");
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
