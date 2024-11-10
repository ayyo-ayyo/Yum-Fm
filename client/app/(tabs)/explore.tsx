import React, { useState } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet, Keyboard, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        if (query) {
            try {
                const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/search?type=restaurant&q=${query}`);
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="camera-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for restaurants..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="map-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.restaurant_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.resultItem}>
                        <Text style={styles.resultTitle}>{item.restaurant_name}</Text>
                        <Text style={styles.resultDesc}>{item.restaurant_desc}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.resultsContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4D4A3',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#F4D4A3',
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
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    resultTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultDesc: {
        fontSize: 14,
        color: '#666',
    },
});