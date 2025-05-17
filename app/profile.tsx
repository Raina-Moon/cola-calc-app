import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
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
    <View>
      <Text>Profile</Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Name: {user?.name}</Text>
      {update ? (
        <>
          <Text>Weight : </Text>
          <TextInput
            keyboardType="numeric"
            value={String(weight)}
            onChangeText={(val) => {
              setWeight(Number(val));
              validateWeight(val);
            }}
          />
          {error ? <Text>{error}</Text> : null}
          <TouchableOpacity onPress={handleUpdate}>
            <Text>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Weight: {user?.weight}
          </Text>
          <TouchableOpacity onPress={() => setUpdate(true)}>
            <Text>Edit Weight</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default profile;
