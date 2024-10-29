// app/profile.tsx
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, Image, Platform, Button, TouchableOpacity, Switch } from 'react-native'; // Make sure StyleSheet is from 'react-native'
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'account' | 'filters'>('account');
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Yum.FM</Text>

      {/* Tabs */}
      <SafeAreaView style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('account')}>
          <Text style={[styles.tabText, activeTab === 'account' && styles.activeTab]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('filters')}>
          <Text style={[styles.tabText, activeTab === 'filters' && styles.activeTab]}>Filters</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Content based on active tab */}
      {activeTab === 'account' && (
        <View style={styles.accountSection}>
          <Image style={styles.profileImage} source={{ uri: 'https://via.placeholder.com/100' }} />
          <Text style={styles.nameText}>IO Mighty</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>📞 (123) 456 7890</Text>
            <Text style={styles.infoText}>📧 iothemighty@youtube.com</Text>
            <Text style={styles.infoText}>📍 Sylvan</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Details</Text>
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
            />
          </View>
          {/* Additional filters can be added here */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4D4A3',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    paddingBottom: 10,
  },
  activeTab: {
    color: '#e74c3c',
    borderBottomWidth: 2,
    borderBottomColor: '#e74c3c',
  },
  accountSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filtersSection: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  filtersText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
});