import axios from 'axios';
import haversine from 'haversine-distance';

// Geocode an address to get the latitude and longitude using Nominatim
export const geocodeAddress = async (address: string): Promise<{ latitude: number, longitude: number } | null> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching geolocation for ${address}: `, error);
    return null;
  }
};

// Function to convert meters to miles
export const convertMetersToMiles = (meters: number): number => {
  return meters * 0.000621371; // Convert meters to miles
};

// Function to calculate the distance between two sets of coordinates
export const calculateDistance = (userLocation: { latitude: number, longitude: number }, restaurantLocation: { latitude: number, longitude: number }): number => {
  const distanceMeters = haversine(userLocation, restaurantLocation);
  return convertMetersToMiles(distanceMeters);
};



// import axios from 'axios';

// // Free API for distance calculations without requiring API keys
// export async function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number | null> {
//   try {
//     const response = await axios.get(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat1}&lon=${lon1}`
//     );
//     const data = response.data;
//     if (data && data.address) {
//       const dist = calculateDistance(lat1, lon1, lat2, lon2);
//       return dist;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching distance:', error);
//     return null;
//   }
// }

// // Haversine formula to calculate distance between two points
// export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const R = 6371; // Radius of the earth in km
//   const dLat = deg2rad(lat2 - lat1); // deg2rad below
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in km
//   return distance;
// }

// function deg2rad(deg: number): number {
//   return deg * (Math.PI / 180);
// }
