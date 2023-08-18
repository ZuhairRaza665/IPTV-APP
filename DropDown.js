import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export let optionSelected = 1;

const CustomDropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    console.log("selected option: ", option.value);
    setSelectedOption(option);
    optionSelected = option.value;
    setIsOpen(false);
  };

  let dropdownOptions = options;
  if (selectedOption.value === options[0].value) {
    dropdownOptions = options.slice(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdownButton} onTouchStart={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>{selectedOption.label}</Text>
        <Icon
          name={isOpen ? "angle-up" : "angle-down"} // Adjust icon names
          size={18}
          color="white"
        />
      </View>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {dropdownOptions.map((option) => (
            <View
              key={option.value}
              style={styles.optionItem}
              onTouchStart={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center", // Center horizontally
    width: 200, // Adjusted width
    top: 20,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#212020",
    borderRadius: 5,
    backgroundColor: "#212020",
    width: "100%", // Full width of container
    height: "auto",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "white",
  },
  dropdownOptions: {
    position: "absolute",
    top: 42, // Positioned below button
    left: 0,
    width: "100%", // Full width of container
    backgroundColor: "#212020",
    borderWidth: 1,
    borderColor: "#212020",
    borderRadius: 5,
    elevation: 5,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#0B0B0B",
  },
  optionText: {
    fontSize: 16,
    color: "white",
  },
});

export default CustomDropdown;
