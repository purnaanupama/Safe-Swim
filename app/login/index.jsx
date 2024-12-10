import { StyleSheet, View, Text, Button, Image } from 'react-native';
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import swimmer from '../../assets/images/swimmer.png'
import { client } from '../../utils/KindeConfig';
import services from '../../utils/services';
import { useRouter } from 'expo-router';



export default function LoginScreen() {
    const router = useRouter();
    const handleSignIn = async () => {
        const token = await client.login();
        if (token) {
          await services.storeData('login','true')
          router.replace('/home')
        }
      };
  return (
    <LinearGradient
    // Gradient colors with corresponding color stops
    colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
    locations={[0.05, 0.6, 0.83, 1]} // Corresponding stops
    style={styles.container}
   >
    <View>
        <View style={{display:'flex',alignItems:'center',justifyContent:'center',height:'95%'}}>
        <Text style={{fontSize:32,fontFamily:'poppins-medium',color:'#fff',marginBottom:15}}>Welcome To</Text>
        <Text style={{fontSize:96,fontFamily:'qwigley-regular',color:'#03005C',marginBottom:35}}>Safe Swim</Text>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={{
            width:310,
            backgroundColor:'#090930',
            color:'#fff',
            paddingVertical:7,
            fontSize:18,
            borderRadius:10,
            fontFamily:'poppins-medium',
            textAlign:'center'}}>
           Sign in
          </Text>
        </TouchableOpacity>

        </View>

    </View>
    <Image source={swimmer} style={{height:100,width:100,position:'absolute',bottom:40}}/>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center'
    },
    text: {
      color: 'white',
      fontSize: 24,
    },
  });