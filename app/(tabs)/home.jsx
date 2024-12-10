import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import services from "../../utils/services"
import { useRouter } from 'expo-router'
import Header from '../../components/home/Header'
import Slider from '../../components/home/Slider'
import { LinearGradient } from 'expo-linear-gradient';
import FunctionButtons from '../../components/home/FunctionButtons'
import Suggestions from '../../components/home/Suggestions'


export default function home() {
const router = useRouter();
 useEffect(()=>{
    checkUserAuth();
    },[])
 const checkUserAuth=async()=>{
        const result = await services.getData('login');
        if(result !== 'true'){
          router.push('/login')
        }
        console.log("result",result)
      }
  return (
    <ScrollView  style={styles.container}>
    <LinearGradient
    // Gradient colors with corresponding color stops
    colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
    locations={[0.05, 0.6, 0.83, 1]} // Corresponding stops
   >
    <View>
      {/*header*/}
      <Header/>
      {/*slider*/}
      <Slider/>
      {/*functions*/}
      <FunctionButtons/>
      {/*suggestions*/}
      <Suggestions/>
    </View>
    </LinearGradient>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    height:'100%'
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
});