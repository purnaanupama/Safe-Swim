import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '../../constants/Colors';
import MenuModel from '../../components/menu/MenuModel';


export default function Tablayout() {
  // State to control visibility of MenuModel
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenuModal = () => {
    setIsMenuVisible(!isMenuVisible); // Toggle the state between true and false
  };

  return (
    <View style={{flex:1}}>
      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarStyle: {
            paddingBottom: 7,
            paddingTop: 7,
            height: 60
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: {
              fontFamily: 'poppins-medium',
              fontSize: 10
            },
            tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="contact"
          options={{
            tabBarLabel: 'Contact',
            tabBarLabelStyle: {
              fontFamily: 'poppins-medium',
              fontSize: 10
            },
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="phone-message" size={24} color={color} />
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            tabBarLabel: 'Menu',
            tabBarLabelStyle: {
              fontFamily: 'poppins-medium',
              fontSize: 10
            },
            tabBarIcon: ({ color }) => (
              <Feather name="menu" size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Prevent default navigation
              toggleMenuModal(); // Toggle the visibility of the modal
            },
          }}
        />
      </Tabs>

      {/* Conditionally render the MenuModel based on the state */}
      {isMenuVisible && <MenuModel onClose={()=>setIsMenuVisible(prev=>!prev)} visibility={isMenuVisible}/>}
    </View>
  );
}
