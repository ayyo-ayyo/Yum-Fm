import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LocationObject } from 'expo-location';
import * as Location from 'expo-location';

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
}

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Fetch restaurant data from server
      try {
        const response = await fetch('https://yum-fm-90558e78d331.herokuapp.com/api/restaurants');
        if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#D74938" />;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Nearby Restaurants</Text>
        </View>
        {restaurants.map((restaurant) => (
          <View key={restaurant.restaurant_id} style={styles.restaurantContainer}>
            <Text style={styles.restaurantName}>{restaurant.restaurant_name}</Text>
            <Text style={styles.restaurantDesc}>{restaurant.restaurant_desc}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F4D4A3',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    backgroundColor: '#D74938',
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  restaurantContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 18,
    color: '#D74938',
    fontWeight: 'bold',
  },
  restaurantDesc: {
    fontSize: 14,
    color: '#333',
  },
});
