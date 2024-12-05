import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput, Modal, Alert, Switch } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RestaurantCard from '../../components/RestaurantCard';

interface User {
  _id: string;
  user_name: string;
  phone_number: string;
  email: string;
  address: string;
  favorites_list: number[];
}

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'account' | 'filters'>('account');
  const [filtersEnabled, setFiltersEnabled] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState<boolean>(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(false);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<any[]>([]);

  const userId = '6734ee0c95789f1ef59cc007'; // hardcoded user ID for this example
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  // `http://localhost:3000/api/users/${userId}`
  // `https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`

  const fetchUserData = async (): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`); // switch to heroku link after updating
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData: User = await response.json();
      setName(userData.user_name || '');  // use empty string if data is missing
      setPhone(userData.phone_number || '');
      setEmail(userData.email || '');
      setAddress(userData.address || '');
      setFavoriteRestaurants(userData.favorites_list || []);
      console.log(userData.favorites_list)
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data.');
    }
  };

  const handleEditToggle = (): void => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (): Promise<void> => {
    try {
      console.log("Saving user data:", { name, phone, email, address });

      const response = await fetch(`http://localhost:3000/api/users/${userId}`, { // switch to heroku link after updating
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: name,
          phone_number: phone,
          email: email,
          address: address,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving user data:", errorText);
        throw new Error('Failed to save user data');
      }

      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert('Error', 'Failed to save changes.');
    }
  };

  const toggleFavoritesModal = async (): Promise<void> => {
    if (!isFavoritesModalVisible) {
      try {
        const restaurantDetails = await Promise.all(
          favoriteRestaurants.map((id) =>
            fetch(`http://localhost:3000/api/restaurants/${id}`).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch restaurant with ID: ${id}`);
              return res.json();
            })
          )
        );
        setFavoriteRestaurants(restaurantDetails);
      } catch (error) {
        console.error('Error fetching favorite restaurants:', error);
        Alert.alert('Error', 'Failed to load favorite restaurants.');
      }
    }
    setIsFavoritesModalVisible(!isFavoritesModalVisible);
  };
  

  const toggleLogoutModal = (): void => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
    // setIsLogoutModalVisible(false);
    // navigation.navigate('login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Yum.FM</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('account')}>
          <Text style={[styles.tabText, activeTab === 'account' && styles.activeTab]}>
            Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('filters')}>
          <Text style={[styles.tabText, activeTab === 'filters' && styles.activeTab]}>
            Filters
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'account' && (
        <View style={styles.accountSection}>
          {/* Profile Image */}
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://wallpapers.com/images/featured/luffy-smile-os5fogrcl2bylfkf.jpg' }}
          />

          {isEditing ? (
            <>
              {/* Editable fields in edit mode */}
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
              />
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.editButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleEditToggle}>
                  <Text style={styles.editButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Display fields in view mode */}
              <Text style={styles.nameText}>{name}</Text>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>📞 {phone}</Text>
                <Text style={styles.infoText}>📧 {email}</Text>
                <Text style={styles.infoText}>📍 {address}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleEditToggle}>
                <Text style={styles.editButtonText}>Edit Details</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Centered Options Section */}
          <View style={styles.centeredOptionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={toggleFavoritesModal}>
              <FontAwesome name="heart" size={24} color="#D74938" style={styles.icon} />
              <Text style={styles.optionText}>Your Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <FontAwesome name="users" size={24} color="#D74938" style={styles.icon} />
              <Text style={styles.optionText}>Tell A Friend</Text>
            </TouchableOpacity>
          </View>

          {/* Log Out Button - Visible Only on Account Tab */}
          <TouchableOpacity style={styles.logoutButton} onPress={toggleLogoutModal}>
            <FontAwesome name="sign-out" size={24} color="#D74938" style={styles.icon} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'filters' && (
        <View style={styles.filtersSection}>
          <Text style={styles.filtersText}>Filter Preferences</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Dietary Filters</Text>
            <Switch
              value={filtersEnabled}
              onValueChange={(value) => setFiltersEnabled(value)}
              trackColor={{ false: "#767577", true: "#D74938" }}
              thumbColor={filtersEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
      )}

    {/* Modal for Favorites */}
    <Modal
      visible={isFavoritesModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleFavoritesModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            <FontAwesome name="heart" size={24} color="#D74938" /> Your Favorites
          </Text>
          <View style={styles.modalContent}>
            {/* Check if favorites are loaded */}
            {favoriteRestaurants.length > 0 ? (
              favoriteRestaurants.map((restaurant, index) => (
                <View key={index} style={styles.favoriteItem}>
                  <Text style={styles.modalText}>{restaurant.name}</Text>
                  <Text style={styles.modalSubText}>{restaurant.location}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.modalText}>No favorites found.</Text>
            )}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={toggleFavoritesModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>


      {/* Modal for Logout Confirmation */}
      <Modal
        visible={isLogoutModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleLogoutModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContainer}>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
            <View style={styles.modalContent}>
            <View style={{ flexDirection:"row" }}>
              <TouchableOpacity style={styles.closeButton} onPress={handleLogout}>
                <Text style={styles.closeButtonText}>Yes</Text>
              </TouchableOpacity>
              <View style={styles.space} />
              <TouchableOpacity style={styles.closeButton} onPress={toggleLogoutModal}>
                <Text style={styles.closeButtonText}>No</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3E2CF',
  },
  space: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D74938',
    paddingBottom: 10,
  },
  tabText: {
    fontSize: 18,
    color: '#D74938',
    paddingBottom: 10,
  },
  activeTab: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  accountSection: {
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#D74938',
    resizeMode: 'cover', // Ensure the image is fully centered and covers the view
  },
  nameText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#D74938',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D74938',
    borderRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#D74938',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  centeredOptionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    width: '85%',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#D74938',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#D74938',
    fontWeight: '600',
    marginLeft: 10,
  },
  filtersSection: {
    padding: 20,
  },
  filtersText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#555',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  logoutModalContainer: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 6,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#D74938',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#D74938',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  favoriteItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F3E2CF',
    borderRadius: 8,
  },
  modalSubText: {
    fontSize: 14,
    color: '#777',
  },
  
});