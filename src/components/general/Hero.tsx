import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const position: [number, number] = [23.8103, 90.4125];

const touristSpots = [
  {
    name: "Cox's Bazar",
    lat: 21.4272,
    long: 92.0058,
    description: "World's longest natural sea beach",
  },
  {
    name: "Sundarbans",
    lat: 22.0000,
    long: 89.1833,
    description: "Largest mangrove forest and home to the Royal Bengal Tiger",
  },
  {
    name: "Sylhet",
    lat: 24.8949,
    long: 91.8687,
    description: "Tea gardens and green hills",
  },
  {
    name: "Sajek Valley",
    lat: 23.3813,
    long: 92.2935,
    description: "Clouds and hills in the Chittagong Hill Tracts",
  },
  {
    name: "Saint Martin",
    lat: 20.6280,
    long: 92.3235,
    description: "A tropical coral island in the Bay of Bengal",
  },
];

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const Hero: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[400px] rounded-lg bg-green-100 overflow-hidden shadow-xl p-4 gap-6">
      <div className="h-full p-2 border-1 rounded-lg bg-white rounder-sm">
        <MapContainer
          center={position}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {touristSpots.map((spot, index) => (
            <Marker
              key={index}
              position={[spot.lat, spot.long]}
              icon={customIcon}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{spot.name}</h3>
                  <p>{spot.description}</p>
                </div>
              </Popup>
              <Tooltip>{spot.name}</Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-col justify-center items-center text-black p-8 border-l-4">
        <h1 className="text-7xl font-black text-left">
          Explore the Nature
        </h1>
        <p className="mt-4 text-left text-lg font-light max-w-md">
          Start your next adventure. Discover places, share experiences, and connect with travelers worldwide.
        </p>
      </div>
    </div>
  );
};

export default Hero;
