import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/FirebaseConfig';
import { client } from '../utils/KindeConfig';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MyExperience() {
  const [userId, setUserId] = useState(null);
  const [commentsByUser, setCommentsByUser] = useState([]);
  const router = useRouter()
  // Get user id
  const getUserId = async () => {
    try {
      const user = await client.getUserDetails();
      setUserId(user.id);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  // Get all user comments
  const getUserComments = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'SafeAreas'));
      let comments = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const docComments = data.comment || [];
        const filteredComments = docComments.filter((comment) => comment.user_id === userId);
        comments = [...comments, ...filteredComments];
      });
      setCommentsByUser(comments);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getUserComments(userId);
    }
  }, [userId]);

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>router.push(`/experienceDetail/${item?.id}`)}>
     <View style={styles.commentContainer}>
      <View style={styles.header}>
        <Text style={styles.place}>{item.place}</Text>
        <View style={{display:'flex',flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center'}}>
        <FontAwesome6 name="location-dot" size={16} color="gray" />
        <Text style={styles.town}>{item.town}</Text>
        </View>
      </View>
      {item.safety == 'safe'? <Text style={styles.safety1}>{item.safety}</Text>:<Text style={styles.safety2}>{item.safety}</Text>}
      <Text style={styles.comment} numberOfLines={2}>
        {item.comment}
      </Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      style={styles.container}
      colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
      locations={[0.05, 0.6, 0.83, 1]}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
      <TouchableOpacity onPress={()=>{router.push('/home')}} style={{marginLeft:20,marginTop:20}}>
      <Ionicons name="arrow-back-circle" style={{marginBottom:10}} size={35} color="black"/>
        </TouchableOpacity>
        <Text style={styles.title}>My Shared Experience</Text>
        <View style={styles.subContainer}>
          <FlatList
            data={commentsByUser}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No comments to display.</Text>
            }
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  title: {
    marginTop: 10,
    marginBottom: 60,
    fontSize: 25,
    fontFamily: 'poppins-extra-bold',
    color: '#03005C',
    textAlign: 'center',
  },
  subContainer: {
    backgroundColor: '#fff',
    flexGrow: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop:20,
  },
  commentContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginHorizontal:15,
    padding: 15,
    marginBottom: 5,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  place: {
    fontSize: 16,
    fontFamily:'poppins-extra-bold',
    color: '#333',
  },
  town: {
    fontSize: 14,
    fontFamily:'poppins-medium',
    color: '#666',
  },
  safety1: {
    fontSize: 14,
    color: 'green',
    fontFamily:'poppins-medium',
    marginBottom: 5,
  },
  safety2: {
    fontSize: 14,
    fontFamily:'poppins-medium',
    color: 'red',
    marginBottom: 5,
  },
  comment: {
    fontSize: 14,
    fontFamily:'poppins-regular',
    color: '#444',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
