import { View, Text, StyleSheet,Image } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function ContactBody() {
  return (

    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>safeswim@gmail.com</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Telephone</Text>
        <Text style={styles.value}>011-2345678 / 0740339157</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Website</Text>
        <Text style={styles.value}>www.safeswim.lk</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Website</Text>
        <Text style={styles.value}>www.safeswim.lk</Text>
      </View>
      <Text style={{fontSize:76, textAlign:'center',fontFamily:'qwigley-regular',color:'#03005C',marginTop:20}}>Safe Swim</Text>
      <View style={styles.social}>
      <FontAwesome name="facebook-square" size={34} color="black" />
      <AntDesign name="linkedin-square" size={34} color="black" />
      <FontAwesome5 name="instagram-square" size={34} color="black" />
      <FontAwesome6 name="square-youtube" size={34} color="black" />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: '#fff',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    paddingHorizontal:30,
    paddingTop:60
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  label: {
    fontSize: 17,
    fontFamily:'poppins-extra-bold',
    color: '#333',
    flex: 1, // Ensures the label takes some space to align properly
  },
  value: {
    fontSize: 17,
    fontFamily:'poppins-regular',
    color: '#555',
    flex: 2, // Ensures the value has more space than the label
    textAlign: 'right',
  },
  social :{
   marginTop:30,
   display:'flex',
   flexDirection:'row',
   alignItems:'center',
   gap:20,
   paddingBottom:20
  }
});
