import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMapEvent,
  useMap,
} from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import { getRouteFromORS, type ORSRouteSummary } from '../../utils/api/map';
import L from 'leaflet';
import { getAllMarkers, addMarker, deleteMarker, type Marker as StoredMarker } from '../../utils/indesedDB';
import { v4 as uuidv4 } from 'uuid';

type LatLng = { lat: number; long: number };

const userIcon = new L.Icon({
  iconUrl: 'https://cdn4.iconfinder.com/data/icons/car-service-1/512/park-512.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1865/1865269.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -24],
});

const MAX_MARKERS = 5;
const MAX_NOTIFY_DISTANCE_METERS = 10000;
const NOTIFY_COOLDOWN_MS = 5 * 60 * 1000;

const RecenterButton = ({ position }: { position: LatLng | null }) => {
  const map = useMap();
  return (
    <button
      onClick={() => {
        if (position) map.setView([position.lat, position.long], map.getZoom());
      }}
      className="absolute bottom-4 right-4 bg-secondary text-white px-3 py-1 rounded-md shadow-lg text-sm font-medium z-[1000]"
    >
      Recenter
    </button>
  );
};

const MapClickHandler: React.FC<{ onClick: (latlng: LatLng) => void }> = ({ onClick }) => {
  useMapEvent('click', (e) => {
    onClick({ lat: e.latlng.lat, long: e.latlng.lng });
  });
  return null;
};

interface LiveJourneyMapProps {
  destination: LatLng;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const LiveJourneyMap: React.FC<LiveJourneyMapProps> = ({
  destination,
  soundEnabled,
  vibrationEnabled,
}) => {
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [summary, setSummary] = useState<ORSRouteSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [markers, setMarkers] = useState<StoredMarker[]>([]);
  const [pendingMarker, setPendingMarker] = useState<LatLng | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const notifiedRef = useRef<Record<string, number>>({});
  const watchIdRef = useRef<number | null>(null);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (async () => {
      const storedMarkers = await getAllMarkers();
      setMarkers(storedMarkers);
    })();

    alertAudioRef.current = new Audio('/public/sounds/alert.mp3');
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const newPos = { lat: pos.coords.latitude, long: pos.coords.longitude };
        setCurrentPos(newPos);

        markers.forEach((marker) => {
          const dist = getDistanceMeters(newPos.lat, newPos.long, marker.lat, marker.long);
          const lastNotified = notifiedRef.current[marker.id] || 0;
          const now = Date.now();

          if (dist <= MAX_NOTIFY_DISTANCE_METERS && now - lastNotified > NOTIFY_COOLDOWN_MS) {
            notifyUser(marker.label, alertAudioRef.current, soundEnabled, vibrationEnabled);
            notifiedRef.current[marker.id] = now;
          }
        });

        try {
          const { coords, summary } = await getRouteFromORS(newPos, destination);
          setRouteCoords(coords);
          setSummary(summary);
          setError(null);
        } catch (err) {
          console.error('Route error', err);
          setError('Failed to fetch route.');
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to retrieve your location.');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [markers, destination, soundEnabled, vibrationEnabled]);

  const saveNewMarker = async () => {
    if (!pendingMarker) return;
    if (!newLabel.trim()) {
      alert('Please enter a label for the marker');
      return;
    }
    if (markers.length >= MAX_MARKERS) {
      alert(`You can only add up to ${MAX_MARKERS} markers`);
      return;
    }

    const markerToSave: StoredMarker = {
      id: uuidv4(),
      label: newLabel.trim(),
      lat: pendingMarker.lat,
      long: pendingMarker.long,
    };

    await addMarker(markerToSave);
    setMarkers((prev) => [...prev, markerToSave]);
    setPendingMarker(null);
    setNewLabel('');
  };


  const onDeleteMarker = async (id: string) => {
    await deleteMarker(id);
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="relative w-full h-[650px] border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {currentPos ? (
        <MapContainer
          center={[currentPos.lat, currentPos.long]}
          zoom={14}
          scrollWheelZoom
          className="h-full w-full z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

          <Marker position={[currentPos.lat, currentPos.long]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          <Marker position={[destination.lat, destination.long]} icon={destIcon}>
            <Popup>Destination</Popup>
          </Marker>

          {markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.long]} icon={markerIcon}>
              <Popup>
                <div className="flex flex-col items-start space-y-2">
                  <span>{marker.label}</span>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => onDeleteMarker(marker.id)}
                  >
                    Delete
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {routeCoords.length > 0 && <Polyline positions={routeCoords} color="#2563eb" weight={5} />}

          <MapClickHandler onClick={(pos) => setPendingMarker(pos)} />

          <RecenterButton position={currentPos} />
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Fetching your location...
        </div>
      )}

      {pendingMarker && (
        <div
          className="absolute z-[1100] bg-white border rounded-md p-3 shadow-lg max-w-xs w-full left-1/2 transform -translate-x-1/2 bottom-16"
          style={{ maxWidth: 300 }}
        >
          <h4 className="font-semibold mb-2">Add marker label</h4>
          <input
            type="text"
            className="input input-bordered w-full mb-2"
            placeholder="Label (e.g. Pickup Point)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setPendingMarker(null);
                setNewLabel('');
              }}
            >
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={saveNewMarker}>
              Save
            </button>
          </div>
        </div>
      )}

      {summary && (
        <div className="absolute top-4 left-4 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-md text-sm z-[1000] space-y-1">
          <div className="font-medium text-gray-700">
            Distance: <span className="text-gray-900">{(summary.distance / 1000).toFixed(2)} km</span>
          </div>
          <div className="font-medium text-gray-700">
            Duration: <span className="text-gray-900">{(summary.duration / 60).toFixed(0)} min</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 text-sm bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded shadow z-[1000]">
          {error}
        </div>
      )}
    </div>
  );
};


function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function notifyUser(
  label: string,
  audio: HTMLAudioElement | null,
  soundEnabled: boolean,
  vibrationEnabled: boolean
) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }

  if (Notification.permission === 'granted') {
    new Notification('Nearby location alert', {
      body: `You are near: ${label}`,
      icon: '/icons/location-pin.png',
    });
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([300, 100, 300]);
    }
    if (soundEnabled && audio) {
      audio.play().catch(() => {});
    }
  } else {
    alert(`You are near: ${label}`);
  }
}

export default LiveJourneyMap;
