import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/home/Header'
import ContactBody from '../../components/contact/ContactBody'
import { LinearGradient } from 'expo-linear-gradient';

export default function contact() {
  return (
    <LinearGradient 
    // Gradient colors with corresponding color stops
    colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
    locations={[0.05, 0.6, 0.83, 1]} // Corresponding stops
   >
    <View>
      <Header/>
      <Text style={{
        fontFamily: 'poppins-extra-bold',
        fontSize: 25,
        color:'#03005C',
        paddingHorizontal: 20,
        paddingVertical: 20,
      }}>Contact</Text>
      <ContactBody/>
    </View>
    </LinearGradient>
  )
}