import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../utils/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../../components/home/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import { getWeatherData } from '../../utils/weather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Comment from '../../components/Explore/Comment';


export default function Area() {
  const { areaid } = useLocalSearchParams(); // Extract areaid from the route parameters
  const [areaData, setAreaData] = useState(null); // State to store the fetched data
  const router = useRouter();
  const [weather, setWeather] = useState(""); // Loading state
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [comment,setComment] = useState("")

  // Function to fetch the document based on the "id" field
  const fetchAreaData = async () => {
    if (!areaid) {
      console.error("No areaid provided");
      return;
    }

    try {
      // Create a query to find the document where the "id" field matches the areaid
      const q = query(collection(db, 'SafeAreas'), where('id', '==', areaid));
      
      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming only one document matches the query
        const docData = querySnapshot.docs[0].data();
        setAreaData(docData);
        setLatitude(docData.latitude)
        setLongitude(docData.longitude)
        setComment(docData.comment);
      } else {
        console.log("No document found with the given areaid.");
      }
    } catch (error) {
      console.error("Error fetching document:", error.message);
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchAreaData();
  }, [areaid,comment]);

  useEffect(()=>{
      const fetchWeatherAndLog = async () => {
        const weatherData = await getWeatherData(longitude,latitude);
        setWeather(weatherData);
       } 
       fetchWeatherAndLog()
  },[longitude,latitude,weather])

  return (
    <View style={{ flex: 1 }}>
      {areaData ? (
        <View style={{ flex: 1,borderRadius:20}}>
        
          <TouchableOpacity
            style={{ position: 'absolute', left: 20, top: 20,zIndex:10 }}
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back-circle" style={{ marginBottom: 10 }} size={35} color="white" />
          </TouchableOpacity>

      

          {/* Scrollable Content with Gradient */}
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* <LinearGradient
              style={{
                backgroundColor:'transparent',
                flex: 1,
              }}
              colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
              locations={[0.05, 0.6, 0.83, 1]}
            > */}
                {/* Image Section */}
          <View style={{ height: 200, marginTop: -15 }}>
            <Image
              source={{ uri: areaData.imageURL }}
              style={{
                width: '100%',
                height: 200,
              }}
            />
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(13, 12, 12, 0.35)', 'rgba(0, 0, 0, 80)']}
              style={{
                position: 'absolute',
                width: '100%',
                height: 200,
              }}
            >
              <View style={{ position: 'absolute', bottom: 17, left: 20 }}>
                <Text style={{ color: '#fff', fontFamily: 'poppins-extra-bold', fontSize: 22 }}>{areaData.name}</Text>
                <Text style={{ color: '#fff', fontFamily: 'poppins-medium' }}>{areaData.district}</Text>
              </View>
            </LinearGradient>
          </View>

              {/* Additional Content */}
              <View
                style={{
                  backgroundColor: 'white',
                  marginTop: 20,
                  width: '100%',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingTop: 30,
                }}
              >
                  {/* Map Section */}
              {areaData.latitude && areaData.longitude ? (
                <View style={{ marginTop: 20, height: 300, overflow: 'hidden' }}>
                  <MapView
                    style={{ flex: 1, width: '100%', height: 300 }}
                    initialRegion={{
                      latitude: areaData.latitude,
                      longitude: areaData.longitude,
                      latitudeDelta: 0.0922, // Zoom level
                      longitudeDelta: 0.0421,
                    }}
                    provider="google"
                  >
                    <Marker
                      coordinate={{
                        latitude: areaData.latitude,
                        longitude: areaData.longitude,
                      }}
                      title={areaData.name}
                      description={areaData.district}
                    />
                  </MapView>
                </View>
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
                  Loading map...
                </Text>
              )}
                <Text style={{ 
                  color: '#000', 
                  fontFamily: 'poppins-semi-bold', 
                  marginBottom: 10, 
                  marginTop:40,
                  paddingHorizontal:18,
                  fontSize:20 }}>Explore {areaData.name}</Text>
                <Text style={{ 
                  color: '#000', 
                  fontFamily: 'poppins-regular', 
                  marginBottom:10, 
                  marginTop:10,
                  paddingHorizontal:18,
                  fontSize:14 }}>{areaData.description}</Text>
               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal:18, }}>
                <FontAwesome5 name="cloud-sun-rain" size={24} color="#5C5C5C" />
               <Text style={{ 
    color: '#5C5C5C', 
    fontFamily: 'poppins-medium', 
    fontSize: 14, 
    marginLeft: 10, // Adds space between the icon and text
  }}>
    {weather} mm rainfall
              </Text>
              </View>

<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal:18, }}>
  <MaterialIcons name="today" size={28} color="#5C5C5C" />
  <Text style={{ 
    color: '#5C5C5C', 
    fontFamily: 'poppins-medium', 
    fontSize: 14, 
    marginLeft: 10, // Adds space between the icon and text
  }}>
    {new Date().toISOString().split('T')[0]}
  </Text>
  </View>
           <Text style={{ 
                  color: '#000', 
                  fontFamily: 'poppins-semi-bold', 
                  marginBottom: 10, 
                  marginTop:20,
                  paddingHorizontal:18,
                  fontSize:16 }}>See what other people have to say about {areaData.name}</Text>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                    data={comment}
                    scrollEnabled={true}
                    renderItem={({item,index})=>(
                    <Comment key={index} item={item}/>
                     )}
                    />
              </View>
            {/* </LinearGradient> */}
          </ScrollView>
        </View>
      ) : (
        <Text>Loading area data...</Text>
      )}
    </View>
  );
}
