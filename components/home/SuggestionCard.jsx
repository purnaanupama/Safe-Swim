import { View, Text, Image } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function SuggestionCard({data}) {
  return (
    <View 
      style={{
        marginLeft:15,
        marginRight:15,
        marginTop:20,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,  // for Android shadow
        backgroundColor: 'white', // Background color to make the shadow visible
        borderRadius: 10,         // Optional: rounded corners
        overflow: 'hidden',
        paddingBottom:10,
        marginBottom:6
      }}
    >
      <Image 
        source={{uri:data.imageURL}} 
        style={{
          width: '100%',
          height: 168,
        }}
      />
      <View 
        style={{
          width: '100%',
          height: 142,
          padding: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }} 
      >
        <Text style={{ 
          fontSize: 23,
          fontFamily: 'poppins-semi-bold',
        }}>
          {data.name}
        </Text>
        <Text 
          numberOfLines={2} 
          style={{
            fontSize: 14,
            fontFamily: 'poppins-regular', 
            paddingHorizontal:10,
            textAlign:'center'
          }}
        >
             {data.description}
        </Text>
        <TouchableOpacity>
          <Text style={{
            fontSize: 14,
            borderRadius:5,
            fontFamily: 'poppins-semi-bold', 
            backgroundColor:'#090930',
            paddingHorizontal:10,
            paddingVertical:5,
            width:200,
            textAlign:'center',
            color:'#fff',
            marginTop:15
          }}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
