import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExploreTab from '../(tabs)/explore'; // Adjust path as needed

describe('ExploreTab search bar behavior, with Pasta E Basta', () => {
  it('searches for "Pasta E Basta" and checks if the result contains the restaurant', async () => {
    // Render the ExploreTab component
    const { getByPlaceholderText, getByText, queryByText } = render(<ExploreTab />);

    // Type in "Pasta E Basta" into the search bar
    const searchInput = getByPlaceholderText('Search for restaurants...');
    fireEvent.changeText(searchInput, 'Pasta E Basta');

    // Submit the search (simulates pressing "Enter")
    fireEvent(searchInput, 'submitEditing');

    // Wait for the API to return results and the component to render them
    await waitFor(() => {
      // Check if "Pasta E Basta" is displayed in the results
      expect(getByText('Pasta E Basta')).toBeTruthy();
    });
  });
  it('searches for "Pasta" and checks if the result contains the restaurant', async () => {
    // Render the ExploreTab component
    const { getByPlaceholderText, getByText, queryByText } = render(<ExploreTab />);

    // Type in "Pasta E Basta" into the search bar
    const searchInput = getByPlaceholderText('Search for restaurants...');
    fireEvent.changeText(searchInput, 'Pasta');

    // Submit the search (simulates pressing "Enter")
    fireEvent(searchInput, 'submitEditing');

    // Wait for the API to return results and the component to render them
    await waitFor(() => {
      // Check if "Pasta E Basta" is displayed in the results
      expect(getByText('Pasta E Basta')).toBeTruthy();
    });
  });
  it('searches for "Basta" and checks if the result contains the restaurant', async () => {
    // Render the ExploreTab component
    const { getByPlaceholderText, getByText, queryByText } = render(<ExploreTab />);

    // Type in "Pasta E Basta" into the search bar
    const searchInput = getByPlaceholderText('Search for restaurants...');
    fireEvent.changeText(searchInput, 'Basta');

    // Submit the search (simulates pressing "Enter")
    fireEvent(searchInput, 'submitEditing');

    // Wait for the API to return results and the component to render them
    await waitFor(() => {
      // Check if "Pasta E Basta" is displayed in the results
      expect(getByText('Pasta E Basta')).toBeTruthy();
    });
  });
});

describe('ExploreTab Integration Test for Menu Items', () => {
    it('searches for "Pasta E Basta", opens the restaurant card, and checks if "Arancini" is in the menu', async () => {
      // Render the ExploreTab component
      const { getByPlaceholderText, getByText, queryByText } = render(<ExploreTab />);
  
      // Type in "Pasta E Basta" into the search bar
      const searchInput = getByPlaceholderText('Search for restaurants...');
      fireEvent.changeText(searchInput, 'Pasta E Basta');
  
      // Submit the search (simulates pressing "Enter")
      fireEvent(searchInput, 'submitEditing');
  
      // Wait for the API to return results and the component to render them
      await waitFor(() => {
        // Check if "Pasta E Basta" is displayed in the results
        expect(getByText('Pasta E Basta')).toBeTruthy();
      });
  
      // Open the RestaurantCard for "Pasta E Basta" to view its menu
      fireEvent.press(getByText('Pasta E Basta'));
  
      // Switch to the "Menu" tab
      await waitFor(() => {
        const menuTab = getByText('Menu');
        fireEvent.press(menuTab);
      });
  
      // Verify if "Arancini" is listed in the menu items
      await waitFor(() => {
        expect(queryByText('Arancini')).toBeTruthy();
      });
    });
  });
