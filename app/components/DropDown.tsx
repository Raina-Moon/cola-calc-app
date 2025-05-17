import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DropDown = ({
  selectedValue,
  options,
  onSelect,
}: {
  selectedValue: string;
  options: string[];
  onSelect: (val: string) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState(false);
  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity
        onPress={() => setSelectedOption(!selectedOption)}
        style={styles.dropdown}
      >
        <Text style={styles.selected}>{selectedValue}</Text>
      </TouchableOpacity>

      {selectedOption && (
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                setSelectedOption(false);
              }}
              style={styles.option}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.optionContainer}
        />
      )}
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: "#141414",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selected: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#141414",
  },
  optionContainer: {
    borderWidth: 1,
    borderColor: "#141414",
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
    marginTop: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#141414",
  },
});
