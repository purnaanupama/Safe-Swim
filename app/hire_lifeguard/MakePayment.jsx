import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import lifeguard from '../../assets/images/vecteezy_lifeguard-hut-3d-isometric_45980760.png'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'

export default function MakePayment() {
  const router = useRouter()
  return (
    <LinearGradient
      style={styles.container}
      colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
      locations={[0.05, 0.6, 0.83, 1]}
    >
      <TouchableOpacity onPress={()=>{router.push('/home')}} style={{top:20,left:20,position:'absolute',zIndex:10}}>
      <Ionicons name="arrow-back-circle" size={35} color="black"/>
      </TouchableOpacity>
      <View style={styles.box}>
        <Text style={styles.title}>PAYMENT</Text>
        <Text style={styles.subtitle}>
          Make a payment of LKR 1000 to access all our lifeguard details to hire a lifeguard for your protection
        </Text>
        <Text style={styles.amount}>Amount: LKR 1000.00</Text>
        <TouchableOpacity onPress={()=>{router.push('/hire_lifeguard/LifeguardDetails')}} style={styles.button}>
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
         <Image source={lifeguard} style={{ height: 200, width: 200 }} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: 'poppins-extra-bold',
    marginBottom: 10,
    color: '#09072F',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4D4E8B',
    marginBottom: 20,
    fontFamily:'poppins-regular',
  },
  amount: {
    fontSize: 16,
    fontFamily:'poppins-medium',
    marginBottom: 20,
    color: '#2D2E5B',
  },
  button: {
    backgroundColor: '#4D4E8B',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom:20
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily:'poppins-medium',
  },
});
