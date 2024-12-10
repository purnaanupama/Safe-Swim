import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../utils/FirebaseConfig';
import { client } from '../utils/KindeConfig';


export default function MyExperience() {
const [userId,setUserId] = useState(false)
//Get user id
const getUserId =async()=>{
    const user = await client.getUserDetails();
    setUserId(user.id)
    console.log(userId);  
}
//Get all user comments
const getUserComments =async(userId)=>{
   try {
    const querySnapshot = await getDocs(collection(db,'SafeAreas'))
    let commentsByUser = [];
    querySnapshot.forEach((doc)=>{
        const data = doc.data()
        const comments = data.comment || []
        const filteredComments = comments.filter(comment => comment.user_id === userId)

          // Add filtered comments to the result array
        commentsByUser = [...commentsByUser, ...filteredComments];
    });
    console.log("Comments bu user:",commentsByUser);
   } catch (error) {
    console.log(error);
    
   }
}

useEffect(()=>{
    getUserId()
    if(userId){
        getUserComments(userId)
    }
})
  return (
    <LinearGradient
      style={styles.container}
      colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
      locations={[0.05, 0.6, 0.83, 1]}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>My Shared Experience</Text>
        <View style={styles.subContainer}>
          <Text>Oh babyin</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the LinearGradient covers the full screen
  },
  scrollView: {
    flexGrow: 1, // Ensures the ScrollView's content fills the screen
  },
  title: {
    marginTop: 50,
    marginBottom: 60,
    fontSize: 25,
    fontFamily: 'poppins-extra-bold',
    color: '#03005C',
    textAlign: 'center',
  },
  subContainer: {
    backgroundColor: '#fff',
    flexGrow: 1, // Fills the remaining space in the ScrollView
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20, // Optional padding for content inside
  },
});
