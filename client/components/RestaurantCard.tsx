import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, Dimensions, ScrollView, Image } from 'react-native';

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  restaurant_desc: string;
}

interface MenuItem {
  _id: string;
  item_name: string;
  item_price: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onAddToFavorites: (id: number) => void;
  size?: 'small' | 'large';
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onAddToFavorites, size = 'small' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'menu'>('info');
  const [isFavorite, setIsFavorite] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const animation = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (activeTab === 'menu') {
      fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/by-restaurant/${restaurant.restaurant_id}`)
        .then((response) => response.json())
        .then((data) => setMenuItems(data))
        .catch((error) => console.error('Error fetching menu items:', error));
    }
  }, [activeTab, restaurant.restaurant_id]);

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onAddToFavorites(restaurant.restaurant_id);
  };

  const onUploadMenu = () => {
    console.log('Upload menu functionality triggered.');
    // Add code to handle the upload, such as opening a file picker or navigating to an upload page.
  };

  return (
    <Animated.View style={[styles.restaurantBox, size === 'large' && styles.largeRestaurantBox, { transform: [{ scale: animation }] }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Image 
          source={{uri: 'https://img.cdn4dd.com/p/fit=contain,width=200,height=200,format=auto,quality=95/media/restaurant/cover_square/The_Hangar_Pub_and_Grill_logo.jpg'}}
          width={50}
          height={50}
          borderRadius={25}
        />
        <Text style={styles.restaurantName}>{restaurant.restaurant_name}</Text>
        <Text style={styles.restaurantDesc}>{restaurant.restaurant_desc}</Text>
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
                    <Text style={styles.restaurantName}>Restaurant Info</Text>
                    <Text>{restaurant.restaurant_desc}</Text>
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
    padding: 16,
    borderRadius: 15,
    width: 200,
    marginRight: 10,
  },
  largeRestaurantBox: {
    width: '90%',
    marginHorizontal: 10,
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
});
