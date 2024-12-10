import { View, Text, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../utils/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    setSliderList([]);
    const q = query(collection(db, 'Slider'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSliderList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <View style={{
    marginRight:15
    }}>
      <Text style={{
        fontFamily: 'poppins-extra-bold',
        fontSize: 25,
        color:'#03005C',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
        Home
      </Text>
      <FlatList
        data={sliderList}
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 15, }}
        horizontal={true}
        renderItem={({ item, index }) => (
          <View style={{ height: 170 }}>
            <Image source={{ uri: item.url }}
              style={{
                width: 310,
                height: 170,
                borderRadius: 15,
                marginRight: 15,
              }}
            />
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(13, 12, 12, 0.35)', 'rgba(0, 0, 0, 80)']}
              style={{
                position: 'absolute',
                width: 310,
                height: 170,
                borderRadius: 15,
                marginRight: 15,
              }}
            >
             <View style={{position:'absolute',bottom:17,left:20}}>
             <Text style={{ color: '#fff',fontFamily:'poppins-extra-bold',fontSize:22 }}>{item.content1}</Text>
             <Text style={{ color: '#fff',fontFamily:'poppins-medium'}}>{item.content2}</Text>
             </View>
            </LinearGradient>
          </View>
        )}
      />
    </View>
  );
}
