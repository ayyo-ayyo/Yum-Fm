import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, ActivityIndicator } from 'react-native';
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
        const response = await fetch('http://localhost:3000/api/restaurants');
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
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4D4A3',
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



// import React, { useEffect, useState } from 'react';
// import { StyleSheet, ScrollView, View, Text, ActivityIndicator } from 'react-native';
// import { LocationObject } from 'expo-location';
// import * as Location from 'expo-location';
// import { geocodeAddress, calculateDistance } from './locationUtilities';

// const restaurants = [
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
//   const [location, setLocation] = useState<LocationObject | null>(null);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);
//   const [distances, setDistances] = useState<{ [key: string]: number }>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       setLocation(currentLocation);

//       const distanceResults: { [key: string]: number } = {};

//       await Promise.all(
//         restaurants.map(async (restaurant) => {
//           const restaurantLocation = await geocodeAddress(restaurant.address);

//           if (restaurantLocation && currentLocation) {
//             const distance = calculateDistance(
//               { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
//               restaurantLocation
//             );
//             distanceResults[restaurant.name] = distance;
//           }
//         })
//       );

//       setDistances(distanceResults);
//       setLoading(false);
//     })();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#D74938" />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Nearby Restaurants</Text>
//       </View>
//       {restaurants.map((restaurant) => (
//         <View key={restaurant.name} style={styles.restaurantContainer}>
//           <Text style={styles.restaurantName}>{restaurant.name}</Text>
//           <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
//           <Text style={styles.restaurantDistance}>
//             {distances[restaurant.name] ? distances[restaurant.name].toFixed(2) : 'Calculating...'} miles away
//           </Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4D4A3', // Tan background
//     padding: 16,
//   },
//   header: {
//     backgroundColor: '#D74938', // Red background for header
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   headerText: {
//     fontSize: 24,
//     color: '#FFFFFF', // White text color for the header
//     fontWeight: 'bold',
//   },
//   restaurantContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     marginBottom: 16,
//   },
//   restaurantName: {
//     fontSize: 18,
//     color: '#D74938', // Red color for restaurant name
//     fontWeight: 'bold',
//   },
//   restaurantAddress: {
//     fontSize: 14,
//     color: '#333',
//   },
//   restaurantDistance: {
//     fontSize: 14,
//     color: '#666',
//   },
// });
