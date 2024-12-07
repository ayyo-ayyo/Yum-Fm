import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const MenuItem = (menuItem: { itemName: string, price: number, category: string, course: string, fulfilledFilters: string[] }) => {
  return (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.itemName}>{menuItem.itemName}</Text>
        <Text style={styles.itemPrice}>${menuItem.price}</Text>
      </View>
      <View style={styles.menuItemDetails}>
        <Text style={styles.itemCategory}>Category: {menuItem.category}</Text>
        <Text style={styles.itemCourse}>Course: {menuItem.course}</Text>
        <Text style={styles.itemFilters}>Fulfilled Filters: {menuItem.fulfilledFilters.join(', ')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
  },
  menuItemDetails: {
    marginTop: 8,
  },
  itemCategory: {
    fontSize: 16,
  },
  itemCourse: { 
    fontSize: 16,
  },
  itemFilters: {
    fontSize: 16, 
  }
});

export default MenuItem;