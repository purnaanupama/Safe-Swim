import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from "../components/home/Header";
import { LinearGradient } from 'expo-linear-gradient';
import { CheckBoxFilter } from '../components/share_Exp';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/FirebaseConfig';
import { useRouter } from 'expo-router';
import SuggestionCard from '../components/home/SuggestionCard';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function FindSafe() {
  const [safeZoneList, setSafeZoneList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [waterfall, setWaterfall] = useState(false);
  const [stream, setStream] = useState(false);
  const [district, setDistrict] = useState('All');
  const router = useRouter();

  const districts = ['All', 'Nuwara Eliya', 'Matale', 'Kalutara', 'Badulla'];

  // Fetch data from Firestore
  const GetSafeAreaList = async () => {
    try {
      const q = query(collection(db, 'SafeAreas'), where('known_to_be_safe', '==', true));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setSafeZoneList(data);
      setFilteredList(data); // Initialize filteredList with all data
    } catch (error) {
      console.error("Error fetching safe areas: ", error);
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = [...safeZoneList];

    // Apply water source filter
    if (waterfall && !stream) {
      filtered = filtered.filter(item => item.water_source === 'waterfall');
    } else if (stream && !waterfall) {
      filtered = filtered.filter(item => item.water_source === 'stream');
    }

    // Apply district filter
    if (district && district !== 'All') {
      filtered = filtered.filter(item => item.district === district);
    }

    // If no filters are selected, show all data
    if (!waterfall && !stream && district === 'All') {
      filtered = [...safeZoneList];
    }

    setFilteredList(filtered);
  }, [waterfall, stream, district, safeZoneList]);

  useEffect(() => {
    GetSafeAreaList();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
        locations={[0.05, 0.6, 0.83, 1]}>
        {/* Header */}

        <Header />
        <TouchableOpacity onPress={()=>{router.push('/home')}}  style={{position:'absolute',zIndex:10,left:20,top:10}}>
                <Ionicons name="arrow-back-circle" size={40} color="#000"/>
        </TouchableOpacity>
        <Text style={{
                fontFamily: 'poppins-extra-bold',
                fontSize: 25,
                color:'#03005C',
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}>
                Find safe water body
              </Text>
        <View style={{
          backgroundColor:'#fff',
          borderTopLeftRadius:20,
          padding:10,
          paddingBottom:50,
          borderTopRightRadius:20}}>
             <Text style={{
                fontFamily: 'poppins-medium',
                fontSize: 25,
                color:'#000',
                paddingHorizontal: 20,
                marginTop:25
              }}>
                Filters
              </Text>
          <View style={styles.filterContainer}>
            {/* Water Source Checkboxes */}
            <View style={styles.checkboxContainer}>
              <CheckBoxFilter
                options={[{ label: 'Waterfall', value: true }]}
                checkedValue={waterfall}
                onChange={setWaterfall}
              />
              <CheckBoxFilter
                options={[{ label: 'Stream', value: true }]}
                checkedValue={stream}
                onChange={setStream}
              />
            </View>

            {/* District Dropdown */}
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                placeholder={{
                  label: 'Select District...',
                  value: 'All',
                }}
                onValueChange={(value) => setDistrict(value)}
                items={districts.map(d => ({ label: d, value: d }))}
                value={district}
              />
            </View>
          </View>
          <Text style={{
                fontFamily: 'poppins-medium',
                fontSize: 15,
                color:'#000',
                paddingHorizontal: 20,
                marginTop:15
              }}>
               Below water bodies are known to be save according to our data
              </Text>

          {/* Render Filtered List */}
          {
            filteredList.length > 0 ?
           (<FlatList
            data={filteredList}
            style={{ paddingBottom: 40 }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View>
                <SuggestionCard data={item} key={index + 1} />
              </View>
            )}
          />) : (
            <Text style={{
              fontFamily: 'poppins-medium',
              fontSize: 18,
              color:'#000',
              paddingHorizontal: 20,
              marginTop:25
            }}>
              No results found
            </Text>
          )
          }
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  filterContainer: {
    padding: 20,
  },
  checkboxContainer: {
    justifyContent: 'space-between',
    marginBottom: 20,
    gap:10
  },
  pickerContainer: {
    fontFamily: 'poppins-regular',
    width: '85%',
    backgroundColor:'#eeeeee',
    borderRadius: 5,
    padding: 0,
  },
});
