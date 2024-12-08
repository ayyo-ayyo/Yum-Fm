import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, SafeAreaView, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RestaurantCard from '../../components/RestaurantCard';
import * as SessionInfo from '../session_info';

// Define type of Restaurant for TypeScript
interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
}

export default function ExploreTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);

  const router = useRouter();

  // Handle fetching of search results when pressing "Enter"
  const handleSearch = async () => {
    if (query) {
      try {
        //const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/search?type=restaurant&q=${query}`);

        const token = SessionInfo.getAuthToken();
        if (token === undefined) {
          throw Error('Undefined token');
        }

        const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/search?type=restaurant&q=${query}`, {
          headers: {
            'Authorization': token
          }
        });

        if (response.status == 401) {
          router.navigate('/login');
          Alert.alert('Session expired');
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        Keyboard.dismiss(); // Dismiss the keyboard after search
      }
    } else {
      setResults([]);
    }
  };

  // Add restaurant to favorites
  const handleAddToFavorites = (id: number) => {
    console.log(`Added restaurant with ID: ${id} to favorites`);
    // Implement favorite functionality here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for restaurants..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="map-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <RestaurantCard
              restaurant={item}
              onAddToFavorites={handleAddToFavorites}
              size="large"
            />
          </View>
        )}
        contentContainerStyle={styles.resultsContainer}
        horizontal={false} // Use vertical scrolling for list
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />} // Add separator between items
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E2CF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#D74938',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  resultContainer: {
    marginBottom: 16, // Space between each restaurant card
    borderWidth: 1, // Border around each result
    borderColor: '#D74938', // Light grey border color
    borderRadius: 12, // Rounded corners for the border
    padding: 4, // Padding inside the border
    backgroundColor: 'white', // Background color inside the border
  },
  itemSeparator: {
    height: 16, // Space between items
  },
});
