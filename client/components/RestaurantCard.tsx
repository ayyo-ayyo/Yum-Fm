import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions, ScrollView, Image, Alert } from 'react-native';
import * as SessionInfo from '../app/session_info';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Restaurant {
  _id: string;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
  restaurant_img: string;
  rest_fulfilled_filters: String[];
}

interface MenuItem {
  _id: string;
  item_name: string;
  item_price: number;
}

interface User {
  _id: string;
  user_name: string;
  phone_number: string;
  email: string;
  address: string;
  favorites_list: String[];
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  size?: 'small' | 'large';
  setUserFavorites?: (favs: Restaurant[]) => void;
  favorites?: Restaurant[]
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, size = 'small', setUserFavorites, favorites }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'menu'>('info');
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const animation = useState(new Animated.Value(1))[0];
  
  const token = SessionInfo.getAuthToken();
  if (token === undefined) {
    throw Error('Undefined token');
  }

  const userId = SessionInfo.getUserId();
  if (userId === undefined) {
  throw new Error('Undefined userId');
  }
  // Fetch user's favorites when modal is opened
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (modalVisible) {
        try {
          const apiUrl = `https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`;
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) throw new Error('Failed to fetch user data');
  
          const userData: User = await response.json();
          
          // Check if the current restaurant is in the favorites list
          const isRestaurantFavorite = userData.favorites_list.some(
            (favId) => favId === restaurant._id
          );
          
          setIsFavorite(isRestaurantFavorite);
        } catch (error) {
          console.error('Error checking favorites:', error);
          Alert.alert('Error', 'Failed to check favorites. Please try again.');
        }
      }
    };

    fetchUserFavorites();
    }, [modalVisible, restaurant._id, userId, token]);

  useEffect(() => {
    if (activeTab === 'menu') {
      fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/by-restaurant/${restaurant.restaurant_id}`)
        .then((response) => response.json())
        .then((data) => setMenuItems(data))
        .catch((error) => console.error('Error fetching menu items:', error));
    }
  }, [activeTab, restaurant.restaurant_id]);

  // Function to format the fulfilled filters for display
  const renderFulfilledFilters = () => {
    if (restaurant.rest_fulfilled_filters && restaurant.rest_fulfilled_filters.length > 0) {
      return (
        <SafeAreaView style={styles.filtersContainer}>
          <Text style={styles.filtersText}>
            {restaurant.rest_fulfilled_filters.join(', ')}
          </Text>
        </SafeAreaView>
      );
    }
    return null;
  };

    // Render fulfilled filters inside Basic Info
    const renderFiltersInInfoTab = () => {
      if (restaurant.rest_fulfilled_filters && restaurant.rest_fulfilled_filters.length > 0) {
        return (
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Filters:</Text>
            <Text style={styles.filtersText}>
              {restaurant.rest_fulfilled_filters.join(', ')}
            </Text>
          </View>
        );
      }
      return null;
    };

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.95,
      friction: 3,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      tension: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleTabSwitch = (tab: 'info' | 'menu') => {
    setActiveTab(tab);
  };

  const toggleFavorite = async () => {
    try {
      // Toggle the favorite status locally for optimistic UI update
      const updatedFavoriteStatus = !isFavorite;
      setIsFavorite(updatedFavoriteStatus);

      if(setUserFavorites && favorites) {
        if (updatedFavoriteStatus) {
          setUserFavorites([...favorites, restaurant]);
        }
        else {
          setUserFavorites(favorites.filter(curRest => {
            return curRest.restaurant_name !== restaurant.restaurant_name;
          }));
        }
      }

        // http://localhost:3000/api/users/${userId}
        // https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}

      // Fetch the user's current favorites list
      const apiUrl = `https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) throw new Error('Failed to fetch user data');
  
      const userData: User = await response.json();
      console.log(userData);
      let updatedFavorites = userData.favorites_list || [];
      console.log(updatedFavorites);
  
      // Update the favorites list based on the toggle action
      if (updatedFavoriteStatus) {
        // Add the restaurant_id if toggled to "true"
        updatedFavorites = [...updatedFavorites, restaurant._id];
      } else {
        // Remove the restaurant_id if toggled to "false"
        updatedFavorites = updatedFavorites.filter(
          (id) => id !== restaurant._id
        );
      }
  
      // POST the updated favorites list to the server
      const updateResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorites_list: updatedFavorites }),
      });
  
      if (!updateResponse.ok) throw new Error('Failed to update favorites');
  
      // Optionally log success or perform further actions
      console.log('Favorites updated successfully');
    } catch (error) {
      console.error('Error updating favorites:', error);
  
      // Revert the local state if the operation fails
      setIsFavorite(!isFavorite);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };
  

  const onUploadMenu = () => {
    console.log('Upload menu functionality triggered.');
    // Add code to handle the upload, such as opening a file picker or navigating to an upload page.
  };

  return (
      <Animated.View style={[styles.restaurantBox, size === 'large' && styles.largeRestaurantBox, { transform: [{ scale: animation }] }]}>
      <TouchableOpacity style={{flex:1, flexDirection:'row'}} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
        <Image 
          style={{flex:1}}
          source={{uri: restaurant.restaurant_img}}
          width={50}
          borderTopLeftRadius={15}
          borderBottomLeftRadius={15}
        />
        <View style={{flex:2, marginLeft:5}}>
          <Text style={styles.restaurantName}>{restaurant.restaurant_name}</Text>
          <Text style={styles.restaurantDesc}>{restaurant.restaurant_desc}</Text>
          
          {/* Render fulfilled filters here */}
          {renderFulfilledFilters()}
        </View>
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseModal}>
            <View style={styles.modalContent} onTouchStart={(e) => e.stopPropagation()}>
              <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                <Text style={styles.favoriteButtonText}>
                  {isFavorite ? '★' : '☆'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.restaurantName}>{restaurant.restaurant_name}</Text>

              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                  onPress={() => handleTabSwitch('info')}
                >
                  <Text style={styles.tabText}>Basic Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
                  onPress={() => handleTabSwitch('menu')}
                >
                  <Text style={styles.tabText}>Menu</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.tabContent}>
                {activeTab === 'info' && (
                  <View style={styles.infoContent}>
                    <Text style={styles.restaurantName}>Restaurant Info:</Text>
                    <Text>{restaurant.restaurant_desc}</Text>
                    {/* Render the filters in the Basic Info tab */}
                    {renderFiltersInInfoTab()}
                  </View>
                )}
                {activeTab === 'menu' && (
                  <View style={styles.menuContent}>
                    {menuItems.length > 0 ? (
                      menuItems
                        .slice() // create a shallow copy to avoid modifying the original array
                        .sort((a, b) => a.item_price - b.item_price) // sort by item_price in ascending order
                        .map((item) => (
                          <View key={item._id} style={styles.menuItem}>
                            <Text style={styles.menuItemName}>{item.item_name}</Text>
                            <Text style={styles.menuItemPrice}>${item.item_price.toFixed(2)}</Text>
                          </View>
                        ))
                    ) : (
                      <View style={styles.emptyMenuContent}>
                        <Text style={styles.noMenuText}>There is no menu for this restaurant currently.</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={onUploadMenu}>
                          <Text style={styles.uploadButtonText}>Upload Menu</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </Animated.View>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  restaurantBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    //padding: 16,
    borderRadius: 15,
    width: 300,
    marginRight: 10,
  },
  largeRestaurantBox: {
    width: '90%',
    marginHorizontal: 10,
    height: 100,
  },
  restaurantName: {
    fontSize: 18,
    color: '#D74938',
    fontWeight: 'bold',
    paddingTop: 10,
  },
  restaurantDesc: {
    fontSize: 14,
    color: '#333',
  },

  // MODAL stuff
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    height: Dimensions.get('window').height * 0.7,
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
  },

  favoriteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  favoriteButtonText: {
    fontSize: 24,
    color: '#D74938',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#D74938',
  },
  tabText: {
    color: '#333',
    fontSize: 16,
  },
  tabContent: {
    marginTop: 20,
  },
  infoContent: {
    padding: 10,
  },
  menuContent: {
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  menuItemName: {
    fontSize: 16,
    color: '#333',
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#333',
  },
  emptyMenuContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  noMenuText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#D74938',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  // filters stuff
  filtersContainer: {
    marginTop: 10,
  },
  filtersTitle: {
    fontSize: 16,
    color: '#D74938',
    fontWeight: 'bold',
  },
  filtersText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});
