import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "./store/authStore";
import { profilePatch } from "./api/auth";

const profile = () => {
  const [weight, setWeight] = useState(0);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);
  const updated = useAuthStore((state) => state.updateUser);

  const handleUpdate = async () => {
    if (!validateWeight || !user) return;

    await updated({ ...user, weight });
    await profilePatch();
    setUpdate(false);
  };

  const validateWeight = (val: string) => {
    const num = Number(val);

    if (isNaN(num)) {
      setError("Please enter a valid number");
      return false;
    }
    if (num < 10 || num > 200) {
      setError("Weight must be between 10 and 200");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name: {user?.name}</Text>
      {update ? (
        <>
          <Text style={styles.label}>Weight : </Text>
          <TextInput
            keyboardType="numeric"
            value={String(weight)}
            onChangeText={(val) => {
              setWeight(Number(val));
              validateWeight(val);
            }}
            style={styles.input}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Weight: {user?.weight}</Text>
          <TouchableOpacity
            onPress={() => setUpdate(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Edit Weight</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#ff4747",
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ffffff",
    fontFamily: "Jersey15_400Regular",
  },
  label: {
    fontSize: 30,
    marginBottom: 10,
    color: "#ffffff",
    fontFamily: "Jersey15_400Regular",
  },
  button: {
    backgroundColor: "#fff",
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#141414",
    fontFamily: "Jersey15_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    marginBottom: 20,
    width: "50%",
    borderRadius: 5,
    backgroundColor: "#fff",
    fontFamily: "Jersey15_400Regular",
    fontSize: 24,
  },
  errorText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Jersey15_400Regular",
    marginTop: 10,
  },
});
