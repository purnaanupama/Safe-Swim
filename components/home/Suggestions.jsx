import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import SuggestionCard from './SuggestionCard';
import { query, collection, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../utils/FirebaseConfig';
import { useRouter } from 'expo-router';


export default function Suggestions() {
  const [safeZoneList, setSafeZoneList] = useState([]);
  const router = useRouter()

  useEffect(() => {
    GetSafeAreaList();
  },[]);

  const GetSafeAreaList = async () => {
    setSafeZoneList([]); // Clear the list before fetching new data
    try {
      const q = query(
        collection(db, 'SafeAreas'),
        where('known_to_be_safe', '==', true), // Filter by the field
        limit(3) // Limit the results to 3
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setSafeZoneList((prev) => [...prev, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching safe areas: ", error);
    }
  };

  return (
    <View
      style={{
        flex: 1, // Fills the available screen space
        backgroundColor: '#fff',
        marginTop: 55,
        borderRadius: 20,
        marginBottom:50,
        paddingBottom:25,
        alignItems:'center',
        justifyContent:'center'
      }}
    >
      <Text
        style={{
          color:'#000',
          fontSize: 20,
          paddingHorizontal: 30,
          lineHeight: 30,
          marginBottom: 10,
          marginTop: 10,
          paddingVertical: 10,
          textAlign: 'center',
          fontFamily: 'poppins-semi-bold',
        }}
      >
        Suggested safe water bodies for a swim
      </Text>
      <FlatList
        data={safeZoneList}
        style={{
          paddingBottom: 40,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            <SuggestionCard data={item} key={index+1}/>
          </View>
        )}
      />
       <TouchableOpacity onPress={()=>{router.push('/FindSafe')}}>
          <Text style={{
            fontSize: 16,
            borderRadius:5,
            fontFamily: 'poppins-semi-bold', 
            backgroundColor:'#090930',
            paddingHorizontal:10,
            paddingVertical:10,
            width:270,
            textAlign:'center',
            color:'#fff',
            marginTop:15
          }}>
            View More
          </Text>
        </TouchableOpacity>
    </View>
  );
}
