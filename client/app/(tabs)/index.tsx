import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { geocodeAddress, calculateDistance } from './locationUtilities';

const restaurants = [
  { name: 'Antonio’s Pizza', address: '31 N Pleasant St, Amherst, MA 01002' },
  { name: 'Mission Cantina', address: '485 West St, Amherst, MA 01002' },
  { name: 'Judie’s Restaurant', address: '51 N Pleasant St, Amherst, MA 01002' },
  { name: 'Bistro 63', address: '63 N Pleasant St, Amherst, MA 01002' },
  { name: 'The Works Café', address: '48 N Pleasant St, Amherst, MA 01002' },
  { name: 'Lone Wolf', address: '63 Main St, Amherst, MA 01002' },
  { name: 'Panda East', address: '103 N Pleasant St, Amherst, MA 01002' },
  { name: 'Momo Tibetan Restaurant', address: '23 N Pleasant St, Amherst, MA 01002' },
  { name: 'Arigato Sushi', address: '11 N Pleasant St, Amherst, MA 01002' },
  { name: 'Amherst Coffee', address: '28 Amity St, Amherst, MA 01002' },
  { name: 'Bueno Y Sano', address: '1 Boltwood Walk, Amherst, MA 01002' },
  { name: 'Fresh Side', address: '39 S Pleasant St, Amherst, MA 01002' },
  { name: 'The Black Sheep Deli', address: '79 Main St, Amherst, MA 01002' },
  { name: 'Henion Bakery', address: '174 N Pleasant St, Amherst, MA 01002' },
  { name: 'Share Coffee', address: '17 Kellogg Ave, Amherst, MA 01002' },
];

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [distances, setDistances] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const distanceResults: { [key: string]: number } = {};

      await Promise.all(
        restaurants.map(async (restaurant) => {
          const restaurantLocation = await geocodeAddress(restaurant.address);

          if (restaurantLocation && currentLocation) {
            const distance = calculateDistance(
              { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
              restaurantLocation
            );
            distanceResults[restaurant.name] = distance;
          }
        })
      );

      setDistances(distanceResults);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#D74938" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Nearby Restaurants</Text>
      </View>
      {restaurants.map((restaurant) => (
        <View key={restaurant.name} style={styles.restaurantContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          <Text style={styles.restaurantDistance}>
            {distances[restaurant.name] ? distances[restaurant.name].toFixed(2) : 'Calculating...'} miles away
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4D4A3', // Tan background
    padding: 16,
  },
  header: {
    backgroundColor: '#D74938', // Red background for header
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF', // White text color for the header
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
    color: '#D74938', // Red color for restaurant name
    fontWeight: 'bold',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#333',
  },
  restaurantDistance: {
    fontSize: 14,
    color: '#666',
  },
});

// import React, { useEffect, useState } from 'react';
// import { View, ScrollView, Text, StyleSheet } from 'react-native';
// import * as Location from 'expo-location';
// import { getDistance } from './locationUtilities';

// interface Restaurant {
//   name: string;
//   address: string;
//   distance?: number | null;
// }

// const restaurants: Restaurant[] = [
//   { name: 'Antonio’s Pizza', address: '31 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Mission Cantina', address: '485 West St, Amherst, MA 01002' },
//   { name: 'Judie’s Restaurant', address: '51 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Bistro 63', address: '63 N Pleasant St, Amherst, MA 01002' },
//   { name: 'The Works Café', address: '48 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Lone Wolf', address: '63 Main St, Amherst, MA 01002' },
//   { name: 'Panda East', address: '103 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Momo Tibetan Restaurant', address: '23 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Arigato Sushi', address: '11 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Amherst Coffee', address: '28 Amity St, Amherst, MA 01002' },
//   { name: 'Bueno Y Sano', address: '1 Boltwood Walk, Amherst, MA 01002' },
//   { name: 'Fresh Side', address: '39 S Pleasant St, Amherst, MA 01002' },
//   { name: 'The Black Sheep Deli', address: '79 Main St, Amherst, MA 01002' },
//   { name: 'Henion Bakery', address: '174 N Pleasant St, Amherst, MA 01002' },
//   { name: 'Share Coffee', address: '17 Kellogg Ave, Amherst, MA 01002' },
// ];

// const HomeScreen: React.FC = () => {
//   const [location, setLocation] = useState<Location.LocationObject | null>(null);
//   const [restaurantDistances, setRestaurantDistances] = useState<Restaurant[]>(restaurants);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.error('Permission to access location was denied');
//         return;
//       }

//       const currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation(currentLocation);

//       if (currentLocation) {
//         const updatedRestaurants = await Promise.all(
//           restaurants.map(async (restaurant) => {
//             const distance = await getDistance(
//               currentLocation.coords.latitude,
//               currentLocation.coords.longitude,
//               42.3765, // Latitude of Amherst, MA (sample)
//               -72.5199 // Longitude of Amherst, MA (sample)
//             );
//             return { ...restaurant, distance };
//           })
//         );
//         setRestaurantDistances(updatedRestaurants);
//       }
//     })();
//   }, []);

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Nearby Restaurants</Text>
//       </View>
//       {restaurantDistances.map((restaurant, index) => (
//         <View key={index} style={styles.restaurantContainer}>
//           <Text style={styles.restaurantName}>{restaurant.name}</Text>
//           <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
//           {restaurant.distance && (
//             <Text style={styles.restaurantDistance}>
//               Distance: {restaurant.distance.toFixed(2)} km
//             </Text>
//           )}
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4D3B4', // Tan background
//   },
//   header: {
//     backgroundColor: '#D7263D', // Poppier red
//     padding: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
//   restaurantContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   restaurantName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#D7263D',
//   },
//   restaurantAddress: {
//     fontSize: 14,
//     color: '#555',
//   },
//   restaurantDistance: {
//     fontSize: 14,
//     color: '#777',
//   },
// });
