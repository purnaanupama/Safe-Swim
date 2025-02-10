import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome7 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';

export default function FunctionButtons() {
  return (
    <View style={{
        marginTop:40,
        display:'flex',
        gap:15,
        paddingHorizontal:15,
    }}>
      <TouchableOpacity onPress={
        ()=>router.replace("/googleMap/GoogleMap")
        }>
      <Text style={{
        backgroundColor:'#090930',
        color:'#fff',
        fontFamily:'poppins-semi-bold',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        fontSize:17,
        paddingVertical:10,
        paddingHorizontal:25,
      }}>
        <FontAwesome6 name="location-dot" size={18} color="white" />
        &nbsp;&nbsp;&nbsp;Find safe water body near you</Text>
       </TouchableOpacity>
       <TouchableOpacity>
      <Text style={{
        backgroundColor:'#090930',
        color:'#fff',
        fontFamily:'poppins-semi-bold',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        fontSize:17,
        paddingVertical:10,
        paddingHorizontal:25,
      }}>
        <Feather name="search" size={18} color="white" />
        &nbsp;&nbsp;&nbsp;Find safe water body </Text>
       </TouchableOpacity>
       <TouchableOpacity>
      <Text style={{
        backgroundColor:'#090930',
        color:'#fff',
        fontFamily:'poppins-semi-bold',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        fontSize:17,
        paddingVertical:10,
        paddingHorizontal:25,
      }}>
       <FontAwesome7 name="triangle-exclamation" size={18} color="white" />
        &nbsp;&nbsp;&nbsp;Check water body safety</Text>
       </TouchableOpacity>
    </View>
  )
}