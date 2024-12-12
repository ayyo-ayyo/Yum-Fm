import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput, Modal, Alert, Switch, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RestaurantCard from '../../components/RestaurantCard';
import { useRouter } from 'expo-router';
import * as SessionInfo from '../session_info';
import BouncyCheckbox from 'react-native-bouncy-checkbox'; // New import
import HelpButton from '@/components/HelpButton';
import { profileHelp } from '@/constants/Help';
import HelpModal from '@/components/HelpModal';

interface User {
  _id: string;
  user_name: string;
  phone_number: string;
  email: string;
  address: string;
  favorites_list: String[];
  restrictions: String[];
}

interface TestProp {
  test: String;
};

export default function ProfileScreen(prop: TestProp) {
  const [activeTab, setActiveTab] = useState<'account' | 'filters'>('account');
  const [filtersEnabled, setFiltersEnabled] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState<boolean>(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(false);
  const [favoriteRestaurantsID, setFavoriteRestaurants] = useState<any[]>([]);
  const [favRestaurantDetails, setFavoriteRestaurantsDetails] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<any[]>([]); // Store selected filters
  const [helpVisible, setHelpVisible] = useState(false);

  const dietaryRestrictions = [
    { name: 'Vegetarian', description: 'No meat, fish, or poultry.' },
    { name: 'Vegan', description: 'No animal products, including meat, dairy, eggs, or honey.' },
    { name: 'Gluten-Free', description: 'No wheat, barley, rye, or oats (unless certified gluten-free).' },
    { name: 'Lactose-Free', description: 'No dairy products containing lactose.' },
    { name: 'Nut-Free', description: 'No peanuts or tree nuts.' },
    { name: 'Soy-Free', description: 'No soy products.' },
    { name: 'Egg-Free', description: 'No eggs or egg-based products.' },
    { name: 'Keto/Low-Carb', description: 'High fat, very low carb diet.' },
    { name: 'Paleo', description: 'Focuses on whole foods, excluding grains, legumes, and processed foods.' },
    { name: 'Halal', description: 'Foods that meet Islamic dietary laws (no pork, alcohol, etc.).' },
    { name: 'Kosher', description: 'Foods prepared in compliance with Jewish dietary laws.' },
    { name: 'Low-Sodium', description: 'Minimal salt in foods.' },
    { name: 'Low-Fat', description: 'Reduced fat content.' },
    { name: 'Diabetic-Friendly', description: 'Foods that maintain stable blood sugar levels.' },
    { name: 'Allergen-Free', description: 'Avoidance of specific allergens (e.g., shellfish, sesame, etc.).' },
  ];

  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  // `http://localhost:3000/api/users/${userId}`
  // `https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`

  const token = SessionInfo.getAuthToken();
      if (token === undefined) {
        throw Error('Undefined token');
      }

  const userId = SessionInfo.getUserId();
  if (userId === undefined) {
    throw new Error('Undefined userId');
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter];
      
      // Update dietary restrictions in the database
      updateDietaryRestrictions(updatedFilters);
  
      return updatedFilters;
    });
  };
  

  const fetchUserData = async (): Promise<User> => {
    try {
      const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`, {
        headers: {
          'Authorization': token
        }
      }); // switch to heroku link after updating

      if (response.status == 401) {
        router.navigate('/login');
        Alert.alert('Session expired');
      }

      if (!response.ok) throw new Error(`Failed to fetch user data: ${await response.text()}`);
      const userData: User = await response.json();
      setName(userData.user_name || '');  // use empty string if data is missing
      setPhone(userData.phone_number || '');
      setEmail(userData.email || '');
      setAddress(userData.address || '');
      setFavoriteRestaurants(userData.favorites_list || []);
      setSelectedFilters(userData.restrictions || []);
      console.log(userData);
      console.log(userData.favorites_list);
      return userData;
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load user data.');
      throw error;
    }
  };

  const handleEditToggle = (): void => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (): Promise<void> => {
    try {
      console.log("Saving user data:", { name, phone, email, address });

      const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`, { // switch to heroku link after updating
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
        // Refresh user data and use the returned data
        const updatedUserData = await fetchUserData();
  
        const favRestaurantDetails = await Promise.all(
          updatedUserData.favorites_list.map((id) =>
            fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/restaurants/${id}`, {
              headers: {
                'Authorization': token
              }
            }).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch restaurant with ID: ${id}`);
              return res.json();
            })
          )
        );
  
        console.log(favRestaurantDetails);
        setFavoriteRestaurantsDetails(favRestaurantDetails); // Update with full details of restaurants
      } catch (error) {
        console.error('Error fetching favorite restaurants:', error);
        Alert.alert('Error', 'Failed to load favorite restaurants.');
      }
    }
    setIsFavoritesModalVisible(!isFavoritesModalVisible);
  };

  const updateDietaryRestrictions = async (updatedRestrictions: string[]): Promise<void> => {
    try {
      const response = await fetch(`https://yum-fm-90558e78d331.herokuapp.com/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restrictions: updatedRestrictions,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving dietary restrictions:", errorText);
        throw new Error('Failed to save dietary restrictions');
      }
      console.log("Success");
      console.log(updatedRestrictions);
      Alert.alert('Success', 'Dietary restrictions updated.');
    } catch (error) {
      console.error("Error updating dietary restrictions:", error);
      Alert.alert('Error', 'Failed to update dietary restrictions.');
    }
  };
  
  const toggleLogoutModal = (): void => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(!isLogoutModalVisible);
    // setIsLogoutModalVisible(false);
    // navigation.navigate('login');

    router.navigate('/login');
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
            <View style={styles.scrollableModalContent}>
            <ScrollView>
              {favRestaurantDetails.length > 0 ? (
                favRestaurantDetails.map((restaurant) => (
                  <View key={restaurant._id} style={styles.restaurantCardWrapper}>
                    <RestaurantCard
                      restaurant={restaurant}
                      size="large"
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.modalText}>No favorites found.</Text>
              )}
            </ScrollView>

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

      {/* Filters Tab */}
      {activeTab === 'filters' && (
        <ScrollView style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Disable Restriction Filters</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              Disabling dietary filters means we will not consider your filters when recommending restaurants to you.
            </Text>
            <Switch
              value={filtersEnabled}
              onValueChange={(value) => setFiltersEnabled(value)}
              trackColor={{ false: "#767577", true: "#D74938" }}
              thumbColor={filtersEnabled ? "#fff" : "#f4f3f4"}
              style={styles.switchButton}  // Apply the custom style here
            />
          </View>

          <View style={styles.container}>
          <Text style={styles.filtersText}>Food Restrictions</Text>

          {/* Added ScrollView to entire container instead of just here*/}
          <View style={{ flex: 1 }}>
            {dietaryRestrictions.map((restriction) => (
              <View key={restriction.name} style={styles.checkboxContainer}>
                <View style={styles.checkboxWrapper}>
                  <BouncyCheckbox
                    isChecked={selectedFilters.includes(restriction.name)}
                    onPress={() => handleFilterChange(restriction.name)}
                    fillColor="#D74938"  // Color of the checked box
                    // unfillColor="#FFFFFF" // Color of the unchecked box
                    // bounceEffect={true}  // Adds the bounce animation effect
                    disableText={false}  // Allows showing the label text
                    style={styles.bouncyCheckbox}  // Custom style for the checkbox
                  />
                </View>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxName}>{restriction.name}</Text>
                  <Text style={styles.checkboxDescription}>{restriction.description}</Text>
                </View>
              </View>
            ))}
          </View>


        </View>

        </ScrollView>
      )}

    <HelpModal showModal={setHelpVisible} visible={helpVisible} text={profileHelp}></HelpModal>
    <HelpButton showModal={setHelpVisible}></HelpButton>

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

  // account stuff
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
  filtersTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'left', // Aligning title to the left to match other sections
    marginLeft: 20,
  },
  filtersText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 20, // Adding some space before the Food Restrictions title
  },
  switchLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1, // Ensuring text takes available space and aligns well with switch
  },
  switchButton: {
    alignSelf: "flex-end",  // Adjust this value as needed to move the switch to the left
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 20,
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
    padding: 40,
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
  scrollableModalContent: {
    height: 300, // Fixed height for the scrollable area
    marginTop: 10,
    marginBottom: 20,
  },
  restaurantCardWrapper: {
    marginBottom: 15, // Adjust the value for the desired gap
  },
  
  // Filter checkbox list
  scrollView: {
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginLeft: 10,
  },
  checkboxTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  checkboxName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D74938',
    marginBottom: 5,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#555',
  },
  checkboxWrapper: {
    width: 30,            // Set the width of the checkbox container
    height: 30,           // Set the height of the checkbox container
    justifyContent: 'center', // Center the checkbox inside the container
    alignItems: 'center',      // Align the checkbox in the center horizontally and vertically
    marginRight: 10,           // Space between the checkbox and the label
  },
  bouncyCheckbox: {
    marginRight: -20,
  },
});