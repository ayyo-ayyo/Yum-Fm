//index.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import RestaurantCard from '../../components/RestaurantCard';
import HelpModal from '@/components/HelpModal';
import HelpButton from '@/components/HelpButton';
import { indexHelp } from '@/constants/Help';
import * as SessionInfo from '../session_info';

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
  restaurant_img: string;
}

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [helpVisible, setHelpVisible] = useState(false);


  const router = useRouter();

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
        //const response = await fetch('https://yum-fm-90558e78d331.herokuapp.com/api/restaurants');
        const token = SessionInfo.getAuthToken();
        if (token === undefined) {
          throw Error('Undefined token');
        }

        const response = await fetch('https://yum-fm-90558e78d331.herokuapp.com/api/restaurants', {
          headers: {
            'Authorization': token
          }
        });

        if (response.status == 401) {
          router.navigate('/login');
          Alert.alert('Session expired');
        }

        if (!response.ok) throw new Error(`Error fetching data: ${await response.text()}`);
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
      <View style={styles.categoryTitleContainer}>
        <Text style={styles.categoryTitle}>{title}</Text>
      </View>
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

      <HelpModal showModal={setHelpVisible} visible={helpVisible} text={indexHelp}></HelpModal>
      <HelpButton showModal={setHelpVisible}></HelpButton>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F3E2CF'
  },
  container: {
    padding: 4,
    flex: 1
  },
  categoryContainer: {
    marginBottom: 10,
    flex:1
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Text color set to white
    width: '100%', // Ensures the box spans the entire width
    textAlign: 'left', // Centers the text
  },
  categoryTitleContainer: {
    backgroundColor: '#D74938',
    borderRadius: 15,
    padding: 10,
    width: '100%',
    marginBottom: 8
  },
});
