import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function login() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const router = useRouter();
  const handleLogin = async () => {
    const isCompleted = name && year && month && day;
    if (!isCompleted) return;

    const data = { name, birthday: { year, month, day } };
    await AsyncStorage.setItem("users", JSON.stringify(data));

    router.replace("/home");
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
