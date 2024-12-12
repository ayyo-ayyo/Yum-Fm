import { FlatList, StyleSheet, View } from "react-native";
import RestaurantCard from "./RestaurantCard";
import { Restaurant } from "@/app/(tabs)/explore";

interface SearchResultProps {
    results: Restaurant[]
};

export default function SearchResults(props: SearchResultProps) {
    return (<FlatList
        data={props.results}
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
      />);
}

const styles = StyleSheet.create({
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
});