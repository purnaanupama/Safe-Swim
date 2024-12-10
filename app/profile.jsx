import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { client } from '../utils/KindeConfig';
import { router } from 'expo-router';
import services from '../utils/services';
import Ionicons from '@expo/vector-icons/Ionicons';
import swimmer from '../assets/images/swimmer.png'


export default function Profile() {
    const [profileImage, setProfileImage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const logout=async()=>{
      const loggedOut = await client.logout();
          await services.storeData('login','false')
          if(!loggedOut){
            router.push('/login');
          }
    }

    const userdetails = async () => {
        const userProfile = await client.getUserDetails();
        console.log(userProfile);
        setProfileImage(userProfile.picture);
        setName(`Name: ${userProfile.given_name} ${userProfile.family_name}`);
        setEmail(`Email: ${userProfile.email}`);
    };

    useEffect(() => {
        userdetails();
    }, []);

    return (
        <LinearGradient
            style={styles.container}
            colors={['#D1D2FF', '#4D4E8B', '#2D2E5B', '#09072F']}
            locations={[0.05, 0.6, 0.83, 1]}
        >
            <View style={styles.content}>
                <TouchableOpacity onPress={()=>router.replace('/home')} style={{position:'absolute',left:0,top:0}}>
                <Ionicons name="arrow-back-circle" size={40} color="#03005C"/>
                </TouchableOpacity>

                <Text style={styles.title}>My Profile</Text>
                {profileImage ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.profileImage}
                        />
                    </View>
                ) : (
                    <Text>Loading...</Text>
                )}
                <Text style={styles.textBox}>{name}</Text>
                <Text style={styles.textBox}>{email}</Text>
                <TouchableOpacity style={{zIndex:1}} onPress={logout}>
                    <Text style={{
                        fontFamily:'poppins-extra-bold',
                        color:'#fff',
                        zIndex:1,
                        backgroundColor:'#03005C',
                        width:150,
                        textAlign:'center',
                        borderRadius:10,
                        paddingHorizontal:20,
                        paddingVertical:17}}>Logout</Text>
                </TouchableOpacity>
                <Image source={swimmer}  style={{height:100,width:100,position:'absolute',bottom:-200}}/>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 40,
        display: 'flex',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center', // Centers content horizontally
    },
    title: {
        fontSize: 27,
        fontFamily: 'poppins-extra-bold',
        color: '#03005C',
        textAlign: 'center',
        paddingTop: 30,
    },
    imageContainer: {
        alignItems: 'center', // Centers the image horizontally
        justifyContent: 'center', // Centers the image vertically within the container
        marginTop: 30,
        marginBottom: 40,
        zIndex:1,
        height: 150,
        width: 150,
    },
    profileImage: {
        zIndex:1,
        height: 150,
        width: 150,
        resizeMode:"cover",
        borderRadius: 100,
        borderWidth: 0.2,
        borderColor: '#000',
        objectFit:'cover'
    },
    textBox: {
        opacity:0.8,
        zIndex:1,
        backgroundColor: '#D9D9D9',
        paddingVertical: 17,
        paddingHorizontal: 20,
        fontFamily: 'poppins-regular',
        fontSize: 14,
        color: '#4E4E4E',
        borderRadius: 10,
        marginBottom: 25,
        width: 320,
    },
});
