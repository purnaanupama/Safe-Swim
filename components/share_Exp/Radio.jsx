import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialIcons } from "@expo/vector-icons";

export default function Radio({ options, checkedValue, onChange }) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            { backgroundColor: option.color },
            checkedValue === option.value && styles.checkedOption,
          ]}
          onPress={() => onChange(option.value)}
        >
          <MaterialIcons
            name={checkedValue === option.value ? 'radio-button-checked' : 'radio-button-unchecked'}
            size={24}
            color="#fff"
          />
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: 12,
    flexDirection: 'row',
    gap: 20,
    width: '82%',
    justifyContent: 'space-between',
  },
  optionButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap:15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 5,
    width: '48%', // Adjusting the width for better spacing
  },
  optionText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'poppins-medium',
    fontSize: 16,
  },
  checkedOption: {
    borderWidth: 2,
    borderColor: 'white', // Optionally, add a border when selected
  },
});
