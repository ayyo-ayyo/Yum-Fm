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