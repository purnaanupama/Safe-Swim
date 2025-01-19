import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/FirebaseConfig';
import polyline from '@mapbox/polyline';


const GoogleMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);

  const radiusDistance = 120; // 3 km radius

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchPlacesFromFirebase = async (currentLocation) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'SafeAreas'));
      const places = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        places.push({
          id: doc.id,
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      });

      const nearby = places.map((place) => {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          place.latitude,
          place.longitude
        );
        return { ...place, distance };
      }).filter((place) => place.distance <= radiusDistance)
        .sort((a, b) => a.distance - b.distance);

      setNearbyPlaces(nearby);
    } catch (error) {
      console.error('Error fetching places from Firebase:', error);
      Alert.alert('Error', 'Failed to fetch places from database.');
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert(
          'Location Permission',
          'Please enable location services in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(locationData);
      fetchPlacesFromFirebase(locationData);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Failed to get location');
      Alert.alert('Location Error', 'Unable to retrieve your current location.');
    }
  };

  const fetchRoute = async (destination) => {
    const apiKey = "AIzaSyDnpscLl7VNFm4CaPCFu_u4nupDOtj-mto";
    const startLoc = `${location.latitude},${location.longitude}`;
    const endLoc = `${destination.latitude},${destination.longitude}`;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${endLoc}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const coords = points.map(point => ({
          latitude: point[0],
          longitude: point[1]
        }));
        setRouteCoords(coords);
      } else {
        Alert.alert('Route Error', 'No route found to this location.');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={location}
          title="Current Location"
          description="You are here"
        />
        {nearbyPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={`Distance: ${place.distance.toFixed(2)} km`}
            onPress={() => fetchRoute(place)}
          />
        ))}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>
      <FlatList
        data={nearbyPlaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.placeItem}
            onPress={() => fetchRoute(item)}
          >
            <Text style={styles.placeName}>{item.name}</Text>
            <Text>Distance: {item.distance.toFixed(2)} km</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '70%',
  },
  placeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  placeName: {
    fontWeight: 'bold',
  },
});

export default GoogleMap;