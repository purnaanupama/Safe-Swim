import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/home/Header';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../utils/FirebaseConfig';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { getWeatherData } from '../utils/weather';
import Comment from '../components/Explore/Comment';



export default function CheckWaterBodySafety() {
   // State
   const [place, setPlace] = useState([]); // Holds the list of places
   const [searchTerm, setSearchTerm] = useState(''); // User's input in the search bar
   const [suggestions, setSuggestions] = useState([]); // Suggestions based on searchTerm
   const [weather, setWeather] = useState(null); // Weather data
   const [longitude, setLongitude] = useState("");
   const [latitude, setLatitude] = useState("");
   const [incidents, setIncidents] = useState(null);
   const [analysisResult, setAnalysisResult] = useState(null);
   const [loading, setLoading] = useState(false); // Loading state
   const [weatherType, setWeatherType] = useState(""); // Loading state
   const [comments,setComments] = useState([]);
   const router = useRouter();
 
   // Fetch places for suggestions
   const getPlaces = async () => {
     try {
       const q = query(collection(db, 'SafeAreas'), limit(6));
       const querySnap = await getDocs(q);
       const names = [];
       querySnap.forEach((doc) => {
         const { id, name, district, imageURL } = doc.data();
         if (name && district) names.push({ id, name, district, imageURL });
       });
       setPlace(names);
     } catch (error) {
       console.error("Error fetching places: ", error);
     }
   };
 
   useEffect(() => {
     getPlaces();
   }, []);
 
   useEffect(() => {
    if (latitude && longitude) {
      const fetchWeatherAndLog = async () => {
        const weatherData = await getWeatherData(longitude, latitude);
        setWeather(weatherData);
        if (incidents && weatherData) {
          // Send data to AI analyst and call function
          dataAnalyst(weatherData, incidents);
        }
        if (weatherData){
          if(weatherData >= 40){
             setWeatherType("heavy rain climate")
          }else if(weatherData < 40 && weatherData >= 20){
             setWeatherType("rainy climate")
          }else if(weatherData < 20) {
             setWeatherType("low rain climate")
        }} 
      };
      fetchWeatherAndLog();
    }
  }, [latitude, longitude]); // Triggers whenever latitude or longitude changes
 
   // Handle search bar input changes
   const handleSearch = (text) => {
     setSearchTerm(text);
     if (text) {
       const filteredSuggestions = place.filter((item) =>
         item.name.toLowerCase().includes(text.toLowerCase())
       );
       setSuggestions(filteredSuggestions);
     } else {
       setSuggestions([]);
     }
   };
 
   const handleSelectSuggestion = async (name, id) => {
     setSearchTerm(name);
     setSuggestions([]); // Clear suggestions after selection
     try {
       const q = query(collection(db, 'SafeAreas'), where('id', '==', id));
       const querySnapshot = await getDocs(q);
       if (!querySnapshot.empty) {
         querySnapshot.forEach((doc) => {
           const { longitude, latitude, incidents } = doc.data();
           setLatitude(latitude);
           setLongitude(longitude);
           setIncidents(incidents);
         });
       } else {
         console.log("Document not found");
       }
     } catch (error) {
       console.error("Error retrieving document: ", error);
     }
   };
 
   const handleSubmit = (name, id) => {
     handleSelectSuggestion(name, id);
   };

   const getComments =async(name)=>{
      if (!name) {
           console.error("No name provided");
           return;
         }
         try {
          console.log(name);
           const q = query(collection(db, 'SafeAreas'), where('name','==',name));
           
           // Execute the query
           const querySnapshot = await getDocs(q);
     
           if (!querySnapshot.empty) {
             // Assuming only one document matches the query
             const docData = querySnapshot.docs[0].data();
             setComments(docData.comment);
             console.log(docData.comment);
           } else {
             console.log("No document found with the given name.");
           }
         } catch (error) {
           console.error("Error fetching document:", error.message);
         }
   }
 
   const dataAnalyst = async (weather, incidents) => {
    setLoading(true); // Start loading
  
    const prompt = `
    Analyze the following data and output a JSON response based on these rules:
  
    Rules:
    1. If weather > 50.00 mm, it is heavy rain. That means dangerous.
    2. If the number of incidents is greater than 3, it is dangerous.
    3. If the number of incidents is less than or equal to 3 and weather <= 50.00 mm, it is safe.
    4. If the number of incidents is less than or equal to 3 and weather > 50.00 mm, it is dangerous.
    5. If the rainfall is less than 50 mm and incidents less than 3, then also safe.
  
    Additionally:
    - Count all the deaths in the "incidents" array. Each incident has a "no_of_deaths" field. Sum up these values.
    - Include the total death count in the JSON response under the key "deaths".
  
    Data:
    Weather: ${weather} mm (weather is given in mm)
    Incidents: ${JSON.stringify(incidents)}
  
    Provide the response in the following JSON format (do not include any other text besides the json response):
      {
      "status": "safe" or "dangerous",
      "name": "Name of the waterfall or stream exactly same as mentioned i incidents.name"
      "description": "A short explanation (minimum 50 words) about why the selected water body is safe or dangerous.",
      "deaths": total_death_count
      }
    `;
  
    const apiKey = 'AIzaSyDIqjbnFsj7JMQ_rZE6A1FAs5P95RQKTkw'; // Your API key
  
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
    const data = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };
  
    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Log the full response to check its structure
      console.log("Full Response:", response.data);
  
      // Check if 'candidates' exists and has content
      if (response.data?.candidates && response.data.candidates.length > 0) {
        const contentObject = response.data.candidates[0]?.content;
  
        if (contentObject && contentObject.parts && contentObject.parts.length > 0) {
          const textContent = contentObject.parts[0]?.text;
  
          if (textContent) {
            // Extract the JSON from the text (remove the code block syntax)
            const jsonString = textContent.replace(/```json|```/g, '').trim();
  
            // Parse the extracted JSON string
            const parsedResult = JSON.parse(jsonString);
  
            // Set the parsed result in state
            setAnalysisResult(parsedResult); // Update state with the parsed JSON result
            console.log("AI Analysis Result:", parsedResult);
            getComments(parsedResult.name)
          } else {
            console.error("No 'text' field found in the parts array.");
          }
        } else {
          console.error("No 'parts' array found in the content object.");
        }
      } else {
        console.error("No 'candidates' array found in the response.");
      }

    } catch (error) {
      console.error("Error fetching analysis result: ", error.message);
    } finally {
      setLoading(false); // End loading
    }
  };
  

  return (
    <ScrollView style={{ flex: 1 }}>
    <Header />
    <TouchableOpacity
            style={{ position: 'absolute', left: 20, top: 10, zIndex: 10 }}
            onPress={() => {
              router.replace('/(tabs)/home');
            }}
          >
            <Ionicons name="arrow-back-circle" style={{ marginBottom: 10 }} size={35} color="black" />
          </TouchableOpacity>
    <LinearGradient
      style={styles.container}
      colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
      locations={[0.05, 0.6, 0.83, 1]}
    >
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Check Water Body</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a place"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          style={styles.suggestionsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handleSubmit(item.name, item.id);
              }}
              style={styles.suggestionItem}
            >
              <View style={{ display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.imageURL }} style={styles.placeImage} />
                <View style={{ marginLeft: 30 }}>
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  <Text style={styles.suggestionDistrict}>{item.district}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 40 }} />
      ) : (
        analysisResult ? (
          <View>
          <View style={styles.resultContainer}>
            <Text style={{
              fontFamily: 'poppins-semi-bold',
              fontSize: 22,
              paddingVertical: 10,
            }}>{searchTerm}</Text>
            {analysisResult.status == "dangerous"? (
              <Text
                   style={{
                      borderWidth: 4,
                      borderColor: 'red',
                      color: 'red',
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor:'#fec7c7',
                      fontSize: 20,
                      fontFamily: 'poppins-semi-bold',
                      paddingVertical: 10,
                      paddingHorizontal: 70,
                      borderRadius:10
                       }}
                      >
                   {analysisResult.status}
             </Text>
            ):(
              <Text
              style={{
                 borderWidth: 6,
                 borderColor: 'green',
                 color: 'green',
                 width: '100%',
                 textAlign: 'center',
                 fontSize: 20,
                 backgroundColor:'#c7fecb',
                 fontFamily: 'poppins-semi-bold',
                 paddingVertical: 10,
                 paddingHorizontal: 70,
                 borderRadius:10
                  }}
                 >
              {analysisResult.status}
            </Text>
            )}
            <Text style={{ fontFamily: 'poppins-medium', paddingVertical: 15, fontSize: 18 }}>
             {analysisResult.status == "dangerous" ? 'Reason for Danger':'Reason for safe'} 
            </Text>
            <Text style={{ fontFamily: 'poppins-regular' }}>
            {analysisResult.description} 
            </Text>
            <Text style={{fontFamily: 'poppins-medium',fontSize: 16,paddingVertical: 15 }}>Weather: {weather} mm ({weatherType})</Text>
            {analysisResult.status == "dangerous" &&
             <Text style={{fontFamily: 'poppins-medium',color: 'red',fontSize: 14,paddingVertical: 1}}>{analysisResult.deaths} deaths are reported from sources accross the web</Text>
            }
          </View>
          </View>
         
        ):(
          <Text style={{fontFamily: 'poppins-medium',fontSize:22,textAlign:'center',paddingVertical:200,paddingHorizontal:20,color:'#fff' }}>Search a place to check the safety</Text> 
        )
      )}
      {analysisResult && comments.length > 0?(
     <View style={styles.commentContainer}>
     <Text style={{fontFamily: 'poppins-medium',fontSize:18,paddingVertical:25,paddingHorizontal:15,color:'#000' }}>See what others have to say about this place</Text> 
        <FlatList
            showsVerticalScrollIndicator={false}
            data={comments}
            scrollEnabled={true}
            renderItem={({item,index})=>(
        <Comment key={index} item={item}/>
             )}/>
    </View> 
      ):(
        <></>
      )

      }
   
    </LinearGradient>  
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',

  },
  title: {
    fontSize: 24,
    fontFamily: 'poppins-medium',
    color: '#03005C',
    marginBottom: 20,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  searchBar: {
    backgroundColor: '#EBE9E9',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 50,
    fontFamily: 'poppins-medium',
    width: '100%',
    fontSize: 16,
  },
  suggestionsList: {
    backgroundColor: '#FFF',
    borderRadius: 0,
    borderTopWidth: 1,
    width: '100%',
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: 'poppins-medium',
  },
  suggestionDistrict: {
    fontSize: 12,
    fontFamily: 'poppins-medium',
    color: '#BABABA',
  },
  placeImage: {
    width: 50,
    height: 40,
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    marginBottom:20
  },
  resultText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  commentContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom:20
  },
});

