// explore.tsx

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../../components/RestaurantCard';
import { router } from 'expo-router';

// Define type of Restaurant for TypeScript
interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
}

export default function ExploreTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);

  // Handle fetching of search results when pressing "Enter"
  const handleSearch = async () => {
    const baseURL = process.env.baseUrl;
    if (query) {
      try {
        const response = await fetch(`${baseURL}search?type=restaurant&q=${query}`);
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
          <Ionicons name="camera-outline" size={24} color="#fff" onPress={() => {
                        router.push('/camera');

                     }} />
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
          <RestaurantCard
            restaurant={item}
            onAddToFavorites={handleAddToFavorites}
            size = "large"
          />
        )}
        contentContainerStyle={styles.resultsContainer}
        horizontal={false} // Use vertical scrolling for list
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
});
