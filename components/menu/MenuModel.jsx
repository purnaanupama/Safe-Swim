import React, { useRef, useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Animated} from 'react-native';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router'


export default function MenuModel({ onClose, visibility }) {
  const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen at the bottom
  const router = useRouter()
  useEffect(() => {
    if (visibility) {
      // Slide up when modal becomes visible
      Animated.timing(slideAnim, {
        toValue: 0, // Move to 0 (visible position)
        duration: 300, // Animation duration in ms
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    } else {
      // Slide down when modal becomes hidden
      Animated.timing(slideAnim, {
        toValue: 300, // Move back off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visibility]);

  const preventTouchPropagation = (e) => {
    e.stopPropagation(); // Prevent touches inside the modal from propagating to the parent
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={preventTouchPropagation}>
          <Animated.View
            style={[
              styles.modal,
              { transform: [{ translateY: slideAnim }] }, // Animate the Y position
            ]}
          >
            <TouchableOpacity  onPress={()=>router.replace('/shareExperience')}>
            <Text style={styles.modalText}>
             <Fontisto name="share-a" size={21} color="black" />
             &nbsp;&nbsp;&nbsp;Share your experience</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.replace('/myExperience')}>
            <Text style={styles.modalText}>
            <MaterialCommunityIcons name="view-grid" size={21} color="black" />
             &nbsp;&nbsp;&nbsp;View my shared experiences</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.replace('/profile')}>
            <Text style={styles.modalText}>
            <Entypo name="user" size={23} color="black" />
             &nbsp;&nbsp;&nbsp;My profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>router.replace('/hire_lifeguard/MakePayment')}>
            <Text style={styles.modalText}>
            <MaterialCommunityIcons name="shield-check" size={23} color="black"/>
             &nbsp;&nbsp;&nbsp;Hire lifeguard</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slight transparent background
    justifyContent: 'flex-end', // Align modal at the bottom
  },
  modal: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop:30

  },
  modalText: {
    display:'flex',
    alignItems:'center',
    width:'100%',
    borderBottomWidth:1,
    borderColor:'#b6b6b8',
    paddingVertical:14,
    fontSize: 18,
    fontFamily:'poppins-medium',
    paddingHorizontal:20,
    color: '#000',
  }
});
