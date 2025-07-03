import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { TravelPlan } from '../../types/TravelPlan';
import { useEffect, useState } from "react";

const PlanMap: React.FC<{ travelPlan: TravelPlan }> = ({ travelPlan }) => {
    const [loading, setLoading] = useState(true);
    const [endingPosition, setEndingPosition] = useState<[number, number]>([0, 0]);
    // const [startingPosition, setStartingPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (
            travelPlan?.destination_location?.lat &&
            travelPlan?.destination_location?.long &&
            travelPlan?.starting_point_location?.lat &&
            travelPlan?.starting_point_location?.long
        ) {
            setEndingPosition([
                travelPlan.destination_location.lat,
                travelPlan.destination_location.long,
            ]);

            // setStartingPosition([
            //     travelPlan.starting_point_location.lat,
            //     travelPlan.starting_point_location.long,
            // ]);

            setLoading(false);
        }
    }, [travelPlan]);

    const customIcon = new L.Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    if (loading) {
        return (
            <div className="text-center text-gray-500 font-nunito italic">
                Loading map...
            </div>
        );
    }

    return (
        <div className='font-nunito'>
            <MapContainer
                center={endingPosition}
                zoom={10}
                scrollWheelZoom={false}
                className='h-72 w-80 border-1 p-2 rounded-sm'
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    position={endingPosition}
                    icon={customIcon}
                >
                    <Popup>
                        <div className="text-sm">
                            <h3 className="">{travelPlan.destination_name}</h3>
                        </div>
                    </Popup>
                    <Tooltip>{travelPlan.destination_name}</Tooltip>
                </Marker>
            </MapContainer>
            <h2 className='font-bold'>View in map</h2>
        </div>
    );
};

export default PlanMap;