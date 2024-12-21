import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../utils/FirebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function Experience() {
  const { experienceid } = useLocalSearchParams();
  const [comment, setComment] = useState(null); // Updated to hold a single object
  const router = useRouter()
  const getCommentById = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'SafeAreas'));
      let comments = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const docComments = data.comment || [];
        comments = [...comments, ...docComments];
      });
      const mycomment = comments.find((comment) => comment.id === experienceid); // Use `find` for single object
      setComment(mycomment || null); // Set comment or null if not found
    } catch (error) {
      console.log('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    getCommentById();
  }, [experienceid]);

  if (!comment) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Extract date part from the `time` field
  const date = comment.time.split('T')[0];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{router.back()}}>
      <Ionicons name="arrow-back-circle" style={{marginBottom:10}} size={35} color="black"/>
        </TouchableOpacity>
      {/* Place (Main Title) */}
      <Text style={styles.mainTitle}>{comment.place}</Text>

      {/* Water Source (Subtitle) */}
      <Text style={styles.subtitle}>{comment.water_source}</Text>

      {/* Town */}
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',gap:10}}>
      <FontAwesome6 name="map-location-dot" size={24} color="black"/>
      <Text style={{fontFamily:'poppins-medium'}}>{comment.town}</Text>
      </View>
      {/* Safety */}
      <Text
        style={[
          styles.safety,
          { color: comment.safety === 'danger' ? 'red' : 'green' },
        ]}
      >
        {comment.safety.toUpperCase()}
      </Text>

      {/* Deaths Reported */}
      <Text style={styles.deathsReported}>
        Deaths Reported: {comment.no_of_deaths}
      </Text>

      {/* Main Content */}
      <Text style={styles.comment}>{comment.comment}</Text>

      {/* Date */}
      <Text style={styles.date}>Date: {date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width:'100%',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  mainTitle: {
    fontSize: 34,
    fontFamily:'poppins-extra-bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    fontFamily:'poppins-medium',
    marginBottom: 8,
  },
  town: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  safety: {
    fontSize: 25,
    fontFamily:'poppins-medium',
    marginBottom: 8,
    marginTop: 10,
  },
  deathsReported: {
    fontFamily:'poppins-semi-bold',
    fontSize: 18,
    marginBottom: 8,
  },
  comment: {
    fontSize: 16,
    color: '#333',
    fontFamily:'poppins-regular',
    marginBottom: 8,
    lineHeight: 22,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily:'poppins-semi-bold',
  },
});
