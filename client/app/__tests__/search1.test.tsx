import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExploreTab from '../(tabs)/explore'; // Adjust path as needed

describe('ExploreTab search bar behavior', () => {
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
