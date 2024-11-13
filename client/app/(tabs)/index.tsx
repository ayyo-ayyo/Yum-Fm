//index.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import RestaurantCard from '../../components/RestaurantCard';

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
}

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      // Request location permission and fetch location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Fetch restaurant data
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

  const handleAddToFavorites = (id: number) => {
    console.log(`Add to favorites: Restaurant ID ${id}`);
    // Logic to add restaurant to favorites
  };

  // Categorize restaurants based on name
  const categories = {
    closest: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() < 'H'),
    forYou: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() >= 'H' && r.restaurant_name[0].toUpperCase() < 'N'),
    foodItems: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() >= 'N' && r.restaurant_name[0].toUpperCase() < 'T'),
    favorites: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() >= 'T'),
  };

  const renderCategory = (title: string, data: Restaurant[]) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((restaurant) => (
          <RestaurantCard
            key={restaurant.restaurant_id}
            restaurant={restaurant}
            onAddToFavorites={handleAddToFavorites}
          />
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ActivityIndicator size="large" color="#D74938" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderCategory("Restaurants Closest To You", categories.closest)}
        {renderCategory("Restaurants For You", categories.forYou)}
        {renderCategory("Food Items For You", categories.foodItems)}
        {renderCategory("Favorites List", categories.favorites)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F3E2CF',
  },
  container: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Text color set to white
    marginBottom: 8,
    backgroundColor: '#D74938', // Solid background color for the category box
    padding: 12, // Padding for better spacing
    width: '100%', // Ensures the box spans the entire width
    textAlign: 'left', // Centers the text
    borderRadius: 15
  },
});
