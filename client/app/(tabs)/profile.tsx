// app/profile.tsx
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet, Image, Platform, Button } from 'react-native'; // Make sure StyleSheet is from 'react-native'
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chinese New Year</Text>
      <Button 
        title="It's time" 
        onPress={() => {
          console.log("Button pressed!");
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                // Takes the full height of the screen
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',     // Centers horizontally
  },
  text: {
    fontSize: 20, // Optional: Change text size if needed
    marginBottom: 20, // Add some space between the text and the button
  },
});