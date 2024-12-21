import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function LifegaurdDetails() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [lifeSavers, setLifeSavers] = useState([]);
  const router = useRouter();
  // Fetch data from Firestore
  const GetData = async () => {
    try {
      const q = query(collection(db, 'District'));
      const querySnapshot = await getDocs(q);
      const districtData = [];
      querySnapshot.forEach((doc) => {
        const { dis_name, life_savers } = doc.data();
        districtData.push({ label: dis_name, value: dis_name, life_savers });
      });
      setDistricts(districtData);
    } catch (error) {
      console.error('Error fetching safe areas: ', error);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    const selected = districts.find((item) => item.value === district);
    setLifeSavers(selected?.life_savers || []);
  };

  return (
     <LinearGradient
          style={styles.container}
          colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
          locations={[0.05, 0.6, 0.83, 1]}
        >
         <TouchableOpacity onPress={()=>{router.back()}}  style={{left:10,top:10}}>
         <Ionicons name="arrow-back-circle" size={40} color="#000"/>
        </TouchableOpacity>
    <View style={styles.container}>
      <Text style={styles.header}>Lifeguard Details</Text>
      <View>
      <Text style={styles.header2}>Select a district to find the nearest lifeguard</Text>
      <RNPickerSelect
        onValueChange={handleDistrictChange}
        items={districts}
        placeholder={{ label: 'Select a district', value: null }}
        style={pickerSelectStyles}
      />
      </View>
      {selectedDistrict && (
        <>
        {
          lifeSavers.length > 0 ?(
            <>
            <Text style={styles.subHeader}>Life Savers in {selectedDistrict}</Text>
            <FlatList
              data={lifeSavers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardText1}>Name: {item.name}</Text>
                  <Text style={styles.cardText}>Contact: {item.contact}</Text>
                  <Text style={styles.cardText}>Experience: {item.experience} years</Text>
                </View>
              )}
            />
            </>
          ):(
            <Text style={styles.subHeader}>No lifeguards for this district available</Text>
          )
        }
        </>
      )}
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontFamily:'poppins-medium',
    marginBottom: 16,
    marginTop:10
  },
  header2: {
    fontSize: 16,
    fontFamily:'poppins-regular',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontFamily:'poppins-regular',
    color:'#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor:'#E0E1FF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    fontFamily:'poppins-regular',
  },
  cardText1: {
    fontSize: 16,
    fontFamily:'poppins-semi-bold',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    fontFamily:'poppins-medium',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 14,
    color: 'black',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
};
