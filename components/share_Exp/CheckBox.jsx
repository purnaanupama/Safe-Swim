import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CheckBox({ options, checkedValue, onChange }) {
  const handlePress = (value) => {
    // Toggle checkbox state
    onChange(value === checkedValue ? false : value); // Toggle between checked and unchecked
  };

  return (
    <View style={styles.checkboxContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkboxOption}
          onPress={() => handlePress(option.value)} // Pass value to handlePress
        >
          <View
            style={[
              styles.checkboxBox,
              {
                backgroundColor: checkedValue === option.value ? '#1DB727' : '#fff',
                borderColor: checkedValue === option.value ? '#1DB727' : '#ddd',
              },
            ]}
          >
            {checkedValue === option.value && <View style={styles.checkedInnerCircle} />}
          </View>
          <Text style={styles.checkboxLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Allows wrapping of checkboxes onto the next line
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  checkedInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'poppins-medium',
  },
});
