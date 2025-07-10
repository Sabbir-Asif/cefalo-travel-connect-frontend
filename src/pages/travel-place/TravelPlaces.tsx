import type React from "react";
import { useEffect, useState } from "react";
import { type TravelPlaceType } from "../../types/TravelPlace";
import { getTravelPlaceByPagination } from "../../utils/api/travel-place";
import TravelPlaceCard from "../../components/travel-place/TravelPlaceCard";
import { useNavigate } from "react-router";

const TravelPlaces: React.FC = () => {
    const [travelPlaces, setTravelPlaces] = useState<TravelPlaceType[]>([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/create-travel-place');
    }

    useEffect(() => {
        const fetchTravelPlaces = async () => {
            const data = await getTravelPlaceByPagination(1, 6);
            setTravelPlaces(data);
        }
        fetchTravelPlaces();
    }, []);

    return (
        <div>
            <div className="">
                <div className="text-4xl font-nunito text-center font-black mb-10">
                    Explore Top Places
                </div>
                <button
                    className="btn btn-warning font-semibold text-lg mb-8"
                    onClick={handleClick}
                >
                    Create New
                </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {
                    travelPlaces.map(travelPlace => <TravelPlaceCard
                        key={travelPlace.id}
                        travelPlace={travelPlace}
                    >
                    </TravelPlaceCard>)
                }
            </div>
        </div>
    );
};

export default TravelPlaces;