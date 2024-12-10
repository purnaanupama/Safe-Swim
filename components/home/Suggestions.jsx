import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import SuggestionCard from './SuggestionCard';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../utils/FirebaseConfig';

export default function Suggestions() {
  const [safeZoneList, setSafeZoneList] = useState([]);

  useEffect(() => {
    GetSafeAreaList();
  }, []);

  const GetSafeAreaList = async () => {
    setSafeZoneList([]);
    const q = query(collection(db, 'SafeAreas'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSafeZoneList((prev) => [...prev, doc.data()]);
    });
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
            <SuggestionCard data={item} key={index} />
          </View>
        )}
      />
       <TouchableOpacity>
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
