import type { LocationSuggestion } from "../types/Location";

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search locations');
    }
    
    const data = await response.json();
    return data as LocationSuggestion[];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<LocationSuggestion | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    
    const data = await response.json();
    return data as LocationSuggestion;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}