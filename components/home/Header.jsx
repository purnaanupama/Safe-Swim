import { View, Text, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import swimmer from './../../assets/images/swimming-man12.png';
import { client } from '../../utils/KindeConfig';

export default function Header() {
  const [profileImage, setProfileImage] = useState('');
  
  const userdetails = async () => {
    const userProfile = await client.getUserDetails();
    setProfileImage(userProfile.picture);
  };

  useEffect(() => {
    userdetails();
  }, []);
  
  return (
    <View style={{
      paddingHorizontal: 20,
      zIndex:10,
      height: 131,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      paddingVertical: 0,
      backgroundColor: '#fff',
      elevation: 10, // Shadow for Android
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 55
      }}>
         {profileImage ? (
          <Image source={{ uri: profileImage }} 
          style={{ height: 50, width: 50, borderRadius:50,borderWidth:1, borderColor:'#000',marginTop:10}} />
        ) : (
          <Text>Loading...</Text> // Placeholder text or loading spinner
        )}
        <Image source={swimmer} style={{ height: 80, width: 80 }} />
       
      </View>
    </View>
  );
}
