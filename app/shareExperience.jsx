import { View, Text, StyleSheet, ImageBackground, TextInput, FlatList, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import back_image from '../assets/images/splashfalls.jpg';
import { collection, getDocs, limit, query, where, updateDoc,arrayUnion } from 'firebase/firestore';
import { db } from '../utils/FirebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import { Radio, CheckBox } from '../components/share_Exp';
import { client } from '../utils/KindeConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { v4 as uuidv4 } from 'uuid'; 
import 'react-native-get-random-values';


export default function ShareExperience() {
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [townSuggestions, setTownSuggestions] = useState([]);
  const [place, setPlace] = useState([]);
  const [waterSource, setWaterSource] = useState('');
  const [town, setTown] = useState([]);
  const [safety, setSafety] = useState("");
  const [deathReported, setDeathReported] = useState(false);
  const [numDeaths, setNumDeaths] = useState(0); // State for "No. of deaths"
  const [comment, setComment] = useState(''); // State for "Comment description"
  //User state
  const [userId,setUserId]=useState('');
  const [userEmail,setUserEmail]=useState('');
  const [userImage,setUserImage]=useState('');
  //Other state
  const [loading,setLoading]=useState(false);

  //Get the user
  const userdetails = async () => {
    const userProfile = await client.getUserDetails();
    setUserId(userProfile.id)
    setUserEmail(userProfile.email)
    setUserImage(userProfile.picture)
   };

useEffect(() => {
    userdetails();
 }, []);

 const validateForm = () => {
  if (!input) {
    ToastAndroid.show('Place name is required', ToastAndroid.SHORT);
    return false;
  }
  if (!waterSource) {
    ToastAndroid.show('Water source is required', ToastAndroid.SHORT);
    return false;
  }
  if (!input2) {
    ToastAndroid.show('Nearest town is required', ToastAndroid.SHORT);
    return false;
  }
  if (!safety) {
    ToastAndroid.show('Safety information is required', ToastAndroid.SHORT);
    return false;
  }
  if (safety !== 'safe' && deathReported && (!numDeaths || numDeaths <= 0)) {
    ToastAndroid.show('Number of deaths must be greater than 0', ToastAndroid.SHORT);
    return false;
  }
  if (!comment) {
    ToastAndroid.show('Comment description is required', ToastAndroid.SHORT);
    return false;
  }
  return true;
};


const resetForm = () => {
  setInput('');
  setInput2('');
  setWaterSource('');
  setSafety('');
  setDeathReported(false);
  setNumDeaths(0);
  setComment('');
};
  
 const handleSubmit = async () => {
  if (!validateForm()) return;
  try {
    if (safety === "safe") {
      setDeathReported(false);
      setNumDeaths(0);
    }
    setLoading(true);

    // Create a query to filter documents where the 'name' field matches the input
    const q = query(collection(db, 'SafeAreas'), where('name', '==', input));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      for (const docSnap of querySnapshot.docs) {
        const docRef = docSnap.ref; // Get document reference
        const data = docSnap.data(); // Get document data (optional, for logging or further processing)
        console.log('Document data:', data);

        // Generate a unique ID for the comment
        const commentId = uuidv4();

        // Update the document with new comment data
        await updateDoc(docRef, {
          comment: arrayUnion({
            id: commentId, // Add unique ID to the comment
            place: input,
            water_source: waterSource,
            town: input2,
            safety: safety,
            death_reported: deathReported,
            no_of_deaths: numDeaths,
            comment: comment,
            user_id: userId,
            user_email: userEmail,
            userImage: userImage,
            time: new Date().toISOString()
          }),
        });

        ToastAndroid.show('Comment Added Successfully!', ToastAndroid.BOTTOM);
        console.log('Document updated successfully:', docRef.id);
        setLoading(false);
        resetForm();
      }
    } else {
      setLoading(false);
      console.log('No document found with the name:', input);
    }
  } catch (error) {
    setLoading(false);
    console.error('Error fetching or updating documents:', error);
  }
  setLoading(false);
};
  

  
  const getPlaces = async () => {
    setPlace([]);
    const q = query(collection(db, 'Places'), limit(6));
    const querySnap = await getDocs(q);

    const names = [];
    querySnap.forEach((doc) => {
      const { name } = doc.data();
      if (name) names.push(name);
    });
    setPlace(names);
  };

  const getTown = async () => {
    setTown([]);
    const q = query(collection(db, 'Nearest-Town'), limit(6));
    const querySnap = await getDocs(q);

    const towns = [];
    querySnap.forEach((doc) => {
      const { name } = doc.data();
      if (name) towns.push(name);
    });
    setTown(towns);
  };

  useEffect(() => {
    getPlaces();
    getTown();
  }, []);

  const filterSuggestions = (text) => {
    setInput(text);
    if (text) {
      const filtered = place.filter((place) =>
        place.toLowerCase().startsWith(text.toLowerCase())
      );
      if(filtered.length < 1){
        setSuggestions([`No results found`]);
        return
      }
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const filterTownSuggestions = (text) => {
    setInput2(text);
    if (text) {
      const filtered = town.filter((town) =>
        town.toLowerCase().startsWith(text.toLowerCase())
      );
      if(filtered.length < 1){
        setTownSuggestions([`No results found`]);
        return
      }
      setTownSuggestions(filtered);
    } else {
      setTownSuggestions([]);
    }
  };

  const handlePlaceSelect = (place) => {
    setInput(place);
    setSuggestions([]);
  };

  const handleTownSelect = (town) => {
    setInput2(town);
    setTownSuggestions([]);
  };

  const handleWaterSourceChange = (value) => {
    setWaterSource(value);
  };

  return (
    <ImageBackground source={back_image} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.overlay}>
        <TouchableOpacity onPress={()=>router.replace('/home')} style={{position:'absolute',left:20,top:20}}>
                <Ionicons name="arrow-back-circle" size={40} color="#fff"/>
      </TouchableOpacity>
          <Text style={styles.headerText}>Share Your Experience</Text>

          {/* Search Input for Place */}
          <TextInput
            style={styles.searchInput}
            placeholder="Name of the place"
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={filterSuggestions}
          />

          {/* Dropdown Suggestions for Place */}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePlaceSelect(item)} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsContainer}
            />
          )}

          {/* Water Source Picker */}
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              placeholder={{
                label: 'Select water source...',
                value: null,
              }}
              onValueChange={handleWaterSourceChange}
              items={[
                { label: 'Waterfall', value: 'waterfall' },
                { label: 'Stream', value: 'stream' },
              ]}
              value={waterSource}
            />
          </View>

          {/* Search Input for Nearest Town */}
          <TextInput
            style={styles.searchInput}
            placeholder="Nearest town"
            placeholderTextColor="#aaa"
            value={input2}
            onChangeText={filterTownSuggestions}
          />

          {/* Dropdown Suggestions for Town */}
          {townSuggestions.length > 0 && (
            <FlatList
              data={townSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleTownSelect(item)} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsContainer}
            />
          )}

          {/* Safety Question and Radio Buttons */}
          <Text style={styles.safetyQuestion}>Is this location safe for bath/swim?</Text>
          <View style={styles.radioButtonsContainer}>
            <Radio
              options={[
                { label: 'Safe', value: 'safe', color: '#1DB727' },
                { label: 'Danger', value: 'danger', color: 'red' },
              ]}
              checkedValue={safety}
              onChange={setSafety}
            />
          </View>
          {(safety && safety!=="safe") && (
              <>
           {/* Death Report Checkbox */}
          <View style={styles.checkboxContainer}>
           <CheckBox
            options={[{ label: 'Deaths Reported ?', value: true }]}
            checkedValue={deathReported}
            onChange={setDeathReported}
        />
      </View>
 
      {/* Input for No. of Deaths */}
      <TextInput
        style={styles.searchInput}
        placeholder="No. of deaths"
        placeholderTextColor="#aaa"
        value={numDeaths}
        onChangeText={(text) => setNumDeaths(text.replace(/[^0-9]/g, ''))} // Allow only numbers
        keyboardType="numeric"
      />
    </>
  )
}

          {/* Textarea for Comment Description */}
          <TextInput
            style={[styles.searchInput, { height: 120 }]} // Taller for textarea
            placeholder="Comment description"
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            multiline
          />
      {/* Gradient Submit Button */}
      <LinearGradient
          colors={['#3A3A3A', '#69696B', '#464646']} // Define gradient colors
          start={{ x: 0, y: 0 }} // Starting point of the gradient
          end={{ x: 0, y: 1 }} // Ending point of the gradient
          style={{
            marginBottom: 30,
            paddingHorizontal: 12,
            paddingVertical: 12,
            width: '85%',
            marginTop: 15,
            borderRadius: 5,
          }}
        >
          <TouchableOpacity
            disabled={loading}
            onPress={handleSubmit}
            style={{
              width: '100%',
              borderRadius: 5
            }}
          >
            <Text
              style={{
                fontFamily: 'poppins-semi-bold',
                color: '#fff',
                textAlign: 'center',
              }}
            >
              {loading ? 'Loading' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  overlay: {
    alignItems: 'center',
    padding: 20,
    height:'100%',
    display:'flex',
    gap:10,
    justifyContent:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    marginTop:50,
    fontFamily: 'poppins-semi-bold',
  },
  searchInput: {
    width: '85%',
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 15,
    fontFamily: 'poppins-regular',
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  suggestionsContainer: {
    width: '85%',
    marginTop: 5,
    backgroundColor: '#d8d8d8',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#737373',
    fontFamily: 'poppins-regular',
  },
  pickerContainer: {
    fontFamily: 'poppins-regular',
    width: '85%',
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  safetyQuestion: {
    fontSize: 17,
    width: '85%',
    textAlign: 'left',
    color: '#fff',
    marginTop: 20,
    fontFamily: 'poppins-medium',
  },
  checkboxContainer: {
    width: '85%',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});
