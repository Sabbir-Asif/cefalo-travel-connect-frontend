import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode } from '../../services/locationService';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapLocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: { name: string; lat: number; long: number }) => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
    isOpen,
    onClose,
    onLocationSelect
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        name: string;
        lat: number;
        long: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && mapRef.current && !mapInstanceRef.current) {

            const map = L.map(mapRef.current).setView([23.6850, 90.3563], 7);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            mapInstanceRef.current = map;

            map.on('click', async (e) => {
                const { lat, lng } = e.latlng;
                setIsLoading(true);

                if (markerRef.current) {
                    map.removeLayer(markerRef.current);
                }

                const marker = L.marker([lat, lng]).addTo(map);
                markerRef.current = marker;

                try {
                    const locationData = await reverseGeocode(lat, lng);
                    const locationName = locationData?.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

                    setSelectedLocation({
                        name: locationName,
                        lat,
                        long: lng
                    });

                    marker.bindPopup(locationName).openPopup();
                } catch (error) {
                    console.error('Error getting location name:', error);
                    setSelectedLocation({
                        name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                        lat,
                        long: lng
                    });
                } finally {
                    setIsLoading(false);
                }
            });
        }

        return () => {
            if (!isOpen && mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedLocation(null);
        if (markerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
            markerRef.current = null;
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl h-5/6 max-h-screen p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Select Location on Map</h3>
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="text-sm text-base-content/70 mb-4">
                    Click on the map to select a location. The map is centered on Bangladesh.
                </div>

                <div
                    ref={mapRef}
                    className="w-full h-80 rounded-lg border border-base-300 mb-4"
                />

                {isLoading && (
                    <div className="flex items-center justify-center py-2">
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        <span>Getting location information...</span>
                    </div>
                )}

                {selectedLocation && (
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                        <h4 className="font-medium mb-2">Selected Location:</h4>
                        <p className="text-sm mb-1">{selectedLocation.name}</p>
                        <p className="text-xs text-base-content/70">
                            Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.long.toFixed(6)}
                        </p>
                    </div>
                )}

                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirm}
                        disabled={!selectedLocation || isLoading}
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </dialog>
    );
};