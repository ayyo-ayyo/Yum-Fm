// app/profile.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'account' | 'filters'>('account');
  const [filtersEnabled, setFiltersEnabled] = useState(false);

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
          <Image style={styles.profileImage} source={{ uri: 'https://via.placeholder.com/100' }} />
          <Text style={styles.nameText}>John Brito</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>📞 +1 435 783 1730</Text>
            <Text style={styles.infoText}>📧 yummy@email.com</Text>
            <Text style={styles.infoText}>📍 221B, Baker Street</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Details</Text>
          </TouchableOpacity>

          {/* Centered Options Section */}
          <View style={styles.centeredOptionsContainer}>
            <TouchableOpacity style={styles.optionButton}>
              <FontAwesome name="heart" size={24} color="#D74938" style={styles.icon} />
              <Text style={styles.optionText}>Your Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <FontAwesome name="users" size={24} color="#D74938" style={styles.icon} />
              <Text style={styles.optionText}>Tell A Friend</Text>
            </TouchableOpacity>
          </View>

          {/* Log Out Button - Visible Only on Account Tab */}
          <TouchableOpacity style={styles.logoutButton}>
            <FontAwesome name="power-off" size={24} color="#D74938" style={styles.icon} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3E2CF',
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
    fontWeight: 'bold', // Bold text for active tab
    fontSize: 20, // Slightly larger font size for active tab
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
});