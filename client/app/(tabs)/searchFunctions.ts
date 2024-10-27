// client/app/(tabs)/searchFunctions.ts
import axios from 'axios';

// Define the type of restaurant data to improve TypeScript type checking
interface Restaurant {
    restaurant_id: number;
    restaurant_name: string;
    restaurant_desc: string;
}

// Function to fetch search results based on query
export const searchRestaurants = async (query: string): Promise<Restaurant[]> => {
    try {
        const response = await axios.get<Restaurant[]>(
            `http://localhost:8081/api/restaurants/search`, // Replace YOUR_PORT with actual port
            { params: { query } }
        );
        console.log('API response:', response.data); // Log the response to inspect it
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};
