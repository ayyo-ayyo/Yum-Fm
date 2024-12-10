//index.tsx

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import RestaurantCard from '../../components/RestaurantCard';
import * as SessionInfo from '../session_info';

interface Restaurant {
  _id: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
  restaurant_img: string;
  rest_fulfilled_filters: String[];
}

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userFavorites, setUserFavorites] = useState<Restaurant[]>([]);


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

        // Get user data
        const userJSON = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/users/${SessionInfo.getUserId()}`, {
          headers: {
            'Authorization': token
          }
        });
      
        const userFavorites = await userJSON.json().then(userData => Promise.all(userData.favorites_list.map((restId: string) => {
          return fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/restaurants/${restId}`, {
            headers: {
              'Authorization': token
            }
          }).then(restJSON => restJSON.json());
        })));

        setUserFavorites(userFavorites);

      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }

      setLoading(false);
    })();
  }, []);

  // Categorize restaurants based on name
  const categories = {
    closest: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() < 'H'),
    forYou: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() >= 'H' && r.restaurant_name[0].toUpperCase() < 'N'),
    foodItems: restaurants.filter((r) => r.restaurant_name[0].toUpperCase() >= 'N' && r.restaurant_name[0].toUpperCase() < 'T'),
    favorites: userFavorites
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
              setUserFavorites={setUserFavorites}
              favorites={userFavorites}
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
        {renderCategory("Favorites", categories.favorites)}
      </ScrollView>
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
