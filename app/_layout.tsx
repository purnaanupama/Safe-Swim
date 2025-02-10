import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native"; // Added for loading indicator

export default function RootLayout() {
  // Load the fonts using useFonts
  const [fontsLoaded] = useFonts({
    "poppins-medium": require("./../assets/fonts/Poppins-Medium.ttf"),
    "poppins-extra-bold": require("./../assets/fonts/Poppins-ExtraBold.ttf"),
    "poppins-semi-bold": require("./../assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-regular": require("./../assets/fonts/Poppins-Regular.ttf"),
    "qwigley-regular": require("./../assets/fonts/Qwigley-Regular.ttf"),
    "blackhansans-regular": require("./../assets/fonts/BlackHanSans-Regular.ttf"),
  });

  // State to track when fonts are loaded
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setIsReady(true);
    }
  }, [fontsLoaded]);

  // If fonts are not loaded yet, render a loading indicator
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Optional: add a default screen transition
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="splash" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}