import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function Comment({ item }) {
  // Format the date and time from item.time
  const commentDate = new Date(item.time);
  const formattedDate = commentDate.toLocaleDateString(); // Extracts the date
  const formattedTime = commentDate.toLocaleTimeString(); // Extracts the time
  return (
    <View style={styles.commentContainer}>
      {/* User Email and Date/Time */}
      <View style={styles.header}>
        <Image source={{ uri: item.userImage }} style={styles.userImage} />
        <View style={styles.textContainer}>
          <Text style={styles.email}>{item.user_email}</Text>
          <Text style={styles.dateTime}>{formattedDate} | {formattedTime}</Text>
        </View>
      </View>
      {/* Description */}
      <Text style={styles.description}>{item.comment}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal:20,
    backgroundColor:'#E0E1FF',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  email: {
    fontSize: 16,
    fontFamily: 'poppins-medium',
    color: '#333',
  },
  dateTime: {
    fontSize: 12,
    fontFamily: 'poppins-regular',
    color: '#5C5C5C',
  },
  description: {
    fontSize: 14,
    fontFamily: 'poppins-regular',
    color: '#555',
    marginTop: 5,
  },
})
