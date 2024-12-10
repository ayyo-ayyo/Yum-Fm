import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, SafeAreaView, FlatList, Alert, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RestaurantCard from '../../components/RestaurantCard';
import * as SessionInfo from '../session_info';
import HelpButton from '@/components/HelpButton';
import { searchHelp } from '@/constants/Help';
import HelpModal from '@/components/HelpModal';


// Define type of Restaurant for TypeScript
interface Restaurant {
  _id: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
  restaurant_img: string;
  rest_fulfilled_filters: String[];
}

interface User {
  _id: string;
  user_name: string;
  phone_number: string;
  email: string;
  address: string;
  favorites_list: String[];
  restrictions: String[];
}

export default function ExploreTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<any[]>([]);
  const [helpVisible, setHelpVisible] = useState(false);


  const router = useRouter();

  const token = SessionInfo.getAuthToken();
  if (token === undefined) {
    throw Error('Undefined token');
  }

  const userId = SessionInfo.getUserId();
  if (userId === undefined) {
    throw new Error('Undefined userId');
  }

  // Open filters modal
  const openFiltersModal = () => {
    setFilterModalVisible(true);
    fetchUserData();
  };

  // Close filters modal
  const closeFiltersModal = () => setFilterModalVisible(false);

  // Handle fetching of search results when pressing "Enter"
  const handleSearch = async () => {
    if (query) {
      try {
        //const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/search?type=restaurant&q=${query}`);
        
        const userData = await fetchUserData(); // This returns the user object
        const mfilters = userData.restrictions.join(','); // Convert filters array to a comma-separated string

        const token = SessionInfo.getAuthToken();
        const baseUrl = process.env.EXPO_PUBLIC_baseUrl;
        if (token === undefined) {
          throw Error('Undefined token');
        }
        console.log(mfilters);
        let uri;
        if (userData.restrictions.length == 0){
          uri = `https://yum-fm-90558e78d331.herokuapp.com/api/search?type=restaurant&q=${query}`
        } else {
          uri = `https://yum-fm-90558e78d331.herokuapp.com/api/search?type=restaurant&q=${query}&mfilters=${encodeURIComponent(mfilters)}`
        }
        const response = await fetch(uri ,
        {
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

  const fetchUserData = async (): Promise<User> => {
    try {
      const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`, {
        headers: {
          'Authorization': token
        }
      }); 

      if (response.status == 401) {
        router.navigate('/login');
        Alert.alert('Session expired');
      }

      if (!response.ok) throw new Error(`Failed to fetch user data: ${await response.text()}`);
      const userData: User = await response.json();
      setCurrentFilters(userData.restrictions || []);
      console.log(userData);
      console.log(userData.favorites_list);
      return userData;
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load user data.');
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.navigate('/camera')}>
          <Ionicons name="camera-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for restaurants..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.iconButton} onPress={openFiltersModal}>
          <Ionicons name="filter-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal for Current Filters */}
      <Modal
        transparent={true}
        visible={filterModalVisible}
        animationType="slide"
        onRequestClose={closeFiltersModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Current Filters</Text>
            <FlatList
              data={currentFilters}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.filterItem}>{item}</Text>}
              contentContainerStyle={styles.filterList}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                closeFiltersModal();
                router.navigate('/profile?activeTab=filters');
              }}
            >
              <Text style={styles.editButtonText}>Edit Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeFiltersModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={results}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <RestaurantCard
              restaurant={item}
              size="large"
            />
          </View>
        )}
        contentContainerStyle={styles.resultsContainer}
        horizontal={false} // Use vertical scrolling for list
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />} // Add separator between items
      />

      <HelpModal showModal={setHelpVisible} visible={helpVisible} text={searchHelp}></HelpModal>
      <HelpButton showModal={setHelpVisible}></HelpButton>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterList: {
    marginVertical: 10,
  },
  filterItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#D74938',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#D74938',
    fontSize: 16,
  },
});
