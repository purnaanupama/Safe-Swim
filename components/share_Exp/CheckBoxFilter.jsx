import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CheckBoxFilter({ options, checkedValue, onChange }) {
  const handlePress = (value) => {
    onChange(!checkedValue); // Toggle between checked and unchecked
  };

  return (
    <View style={styles.checkboxContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkboxOption}
          onPress={() => handlePress(option.value)}
        >
          <View
            style={[
              styles.checkboxBox,
              {
                backgroundColor: checkedValue ? '#1DB727' : '#fff',
                borderColor: checkedValue ? '#1DB727' : '#ddd',
              },
            ]}
          >
            {checkedValue && <View style={styles.checkedInnerCircle} />}
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
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
