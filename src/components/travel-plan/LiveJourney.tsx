import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { getRouteFromORS, type ORSRouteSummary } from "../../utils/api/map";
import L from "leaflet";

type LatLng = { lat: number; long: number };

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

const userIcon = new L.Icon({
    iconUrl: "https://cdn4.iconfinder.com/data/icons/car-service-1/512/park-512.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
});

const destIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1865/1865269.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
});

const LiveJourneyMap: React.FC<{ destination: LatLng }> = ({ destination }) => {
    const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [summary, setSummary] = useState<ORSRouteSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            async (pos) => {
                const newPos = {
                    lat: pos.coords.latitude,
                    long: pos.coords.longitude,
                };
                setCurrentPos(newPos);

                try {
                    const { coords, summary } = await getRouteFromORS(newPos, destination);
                    setRouteCoords(coords);
                    setSummary(summary);
                    setError(null);
                } catch (err) {
                    console.error("Route error", err);
                    setError("Failed to fetch route.");
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError("Unable to retrieve your location.");
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [destination]);

    return (
        <div className="relative w-full h-[650px] border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            {currentPos ? (
                <MapContainer center={[currentPos.lat, currentPos.long]} zoom={14} scrollWheelZoom className="h-full w-full z-0">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    <Marker position={[currentPos.lat, currentPos.long]} icon={userIcon}>
                        <Popup>You are here</Popup>
                    </Marker>

                    <Marker position={[destination.lat, destination.long]} icon={destIcon}>
                        <Popup>Destination</Popup>
                    </Marker>

                    {routeCoords.length > 0 && (
                        <Polyline positions={routeCoords} color="#2563eb" weight={5} />
                    )}

                    <RecenterButton position={currentPos} />
                </MapContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">Fetching your location...</div>
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

export default LiveJourneyMap;
