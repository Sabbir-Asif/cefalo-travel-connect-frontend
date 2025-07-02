import type React from "react";
import { useEffect, useState } from "react";
import { type TravelPlaceType } from "../../types/TravelPlace";
import { getTravelPlaceByPagination } from "../../utils/api/travel-place";
import TravelPlaceCard from "../../components/travel-place/TravelPlaceCard";

const TravelPlaces: React.FC = () => {
    const [travelPlaces, setTravelPlaces] = useState<TravelPlaceType[]>([]);
    // const [pageNum, setPageNum] = useState<number>(1);
    // const [limit, setLimit] = useState<number>(4);

    useEffect(() => {
        const fetchTravelPlaces = async () => {
            const data = await getTravelPlaceByPagination(1, 6);
            setTravelPlaces(data);
        }
        fetchTravelPlaces();
    }, []);

    return (
        <div>
            <div className="text-4xl font-nunito text-center font-black mb-16">
                Explore Top Places
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