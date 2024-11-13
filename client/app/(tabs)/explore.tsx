import React, { useState } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        if (query) {
            try {
                const response = await fetch(`http://localhost:3000/api/search?type=restaurant&q=${query}`);
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
        <View style={styles.container}>
            {/* Top bar with camera, search bar, and map icons */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="camera-outline" size={24} color="#333" onPress={() => {
                        router.push('/camera');

                     }} />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for restaurants..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch} // Triggers search on "Enter"
                />
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="map-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search results */}
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
        </View>
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
        padding: 10,
        backgroundColor: '#F4D4A3',
    },
    iconButton: {
        padding: 10,
    },
    searchBar: {
        flex: 1,
        padding: 8,
        marginHorizontal: 10,
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



// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { searchRestaurants } from './searchFunctions';

// // Define type of Restaurant for TypeScript
// interface Restaurant {
//     restaurant_id: number;
//     restaurant_name: string;
//     restaurant_desc: string;
// }

// export default function ExploreTab() {
//     const [query, setQuery] = useState('');
//     const [results, setResults] = useState<Restaurant[]>([]);

//     // Fetch search results when `query` changes
//     useEffect(() => {
//         if (query) {
//             searchRestaurants(query).then(setResults);
//         } else {
//             setResults([]);
//         }
//     }, [query]);

//     return (
//         <View style={styles.container}>
//             {/* Top bar with camera, search bar, and map icons */}
//             <View style={styles.topBar}>
//                 <TouchableOpacity style={styles.iconButton}>
//                     <Ionicons name="camera-outline" size={24} color="#333" />
//                 </TouchableOpacity>
//                 <TextInput
//                     style={styles.searchBar}
//                     placeholder="Search for restaurants..."
//                     value={query}
//                     onChangeText={setQuery}
//                 />
//                 <TouchableOpacity style={styles.iconButton}>
//                     <Ionicons name="map-outline" size={24} color="#333" />
//                 </TouchableOpacity>
//             </View>

//             {/* Search results */}
//             <FlatList
//                 data={results}
//                 keyExtractor={(item) => item.restaurant_id.toString()}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity style={styles.resultItem}>
//                         <Text style={styles.resultTitle}>{item.restaurant_name}</Text>
//                         <Text style={styles.resultDesc}>{item.restaurant_desc}</Text>
//                     </TouchableOpacity>
//                 )}
//                 contentContainerStyle={styles.resultsContainer}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F4D4A3',
//     },
//     topBar: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         backgroundColor: '#F4D4A3',
//     },
//     iconButton: {
//         padding: 10,
//     },
//     searchBar: {
//         flex: 1,
//         padding: 8,
//         marginHorizontal: 10,
//         borderRadius: 8,
//         backgroundColor: 'white',
//         fontSize: 16,
//     },
//     resultsContainer: {
//         padding: 16,
//     },
//     resultItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//     },
//     resultTitle: {
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     resultDesc: {
//         fontSize: 14,
//         color: '#666',
//     },
// });
