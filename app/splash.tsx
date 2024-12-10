import { View, Text, ImageBackground, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import splashfall from '../assets/images/splashfalls.jpg';
import { LinearGradient } from 'expo-linear-gradient';
import swimmer from '../assets/images/swimmer.png';
import { client } from '../utils/KindeConfig';

export default function Splash() {
  const [user, setUser] = useState(null); // Initialize with null to differentiate between loading and false
  const router = useRouter();

  // Create an animated value for scaling
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Fetch user details
  useEffect(() => {
    const checkUserAndNavigate = async () => {
      try {
        const userProfile = await client.getUserDetails();
        setUser(!!userProfile); // Set user as true if userProfile exists
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(false);
      }
    };

    checkUserAndNavigate();
  }, []);

  // Handle navigation
  useEffect(() => {
    if (user !== null) { // Ensure navigation only happens after user state is determined
      const timeoutId = setTimeout(() => {
        if (user) {
          router.push('/home');
        } else {
          router.push('/login');
        }
      }, 8000);

      return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
    }
  }, [user, router]);

  // Handle animation
  useEffect(() => {
    const animateImage = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Run the animation every 2 seconds
    const interval = setInterval(animateImage, 2000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [scaleAnim]);

  return (
    <LinearGradient
      colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
      locations={[0.05, 0.6, 0.83, 1]}
      style={styles.container}
    >
      <ImageBackground
        source={splashfall}
        style={{
          flex: 1,
          opacity: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      />
      <View
        style={{
          zIndex: 10,
          position: 'absolute',
          display: 'flex',
          top: 170,
          gap: 220,
          alignContent: 'center',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontFamily: 'qwigley-regular', fontSize: 96, color: '#03005C' }}>
          Safe Swim
        </Text>
        {/* Animated Image */}
        <Animated.Image
          source={swimmer}
          style={{
            height: 250,
            width: 250,
            position: 'absolute',
            bottom: 40,
            opacity: 0.7,
            transform: [{ scale: scaleAnim }], // Bind the scaling animation
          }}
        />
        <Text style={{ fontSize: 23, fontFamily: 'blackhansans-regular', color: '#fff' }}>
          Swim Safe... Stay Safe...
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
