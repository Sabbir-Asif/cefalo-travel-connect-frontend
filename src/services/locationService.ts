import type { LocationSuggestion } from "../types/Location";

const baseURL = import.meta.env.VITE_API_BASE_URL
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${baseURL}/location/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search locations');
    return (await response.json()) as LocationSuggestion[];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationSuggestion | null> {
  try {
    const response = await fetch(`${baseURL}/location/reverse?lat=${lat}&lon=${lng}`);
    if (!response.ok) throw new Error('Failed to reverse geocode');
    return (await response.json()) as LocationSuggestion;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}
