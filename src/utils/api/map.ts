import axios from "axios";

export interface ORSRouteSummary {
  distance: number;
  duration: number;
}

export async function getRouteFromORS(
  start: { lat: number, long: number },
  end: { lat: number, long: number }
): Promise<{ coords: [number, number][], summary: ORSRouteSummary }> {
  const res = await axios.post(
    "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
    {
      coordinates: [
        [start.long, start.lat],
        [end.long, end.lat]
      ]
    },
    {
      headers: {
        Authorization: import.meta.env.VITE_ORS_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  const feature = res.data.features[0];
  const coords = feature.geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  );
  const summary = feature.properties.summary;

  return { coords, summary };
}
