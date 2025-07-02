import React from 'react';
import { type TravelPlaceType } from "../../types/TravelPlace";
import { useNavigate } from 'react-router';

interface TravelPlaceCardProps {
    travelPlace: TravelPlaceType
}
const TravelPlaceCard: React.FC<TravelPlaceCardProps> = ({travelPlace }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/travel-places/${travelPlace.id}`);
    }
    return (
        <div className="card bg-gray-50 shadow-sm">
            <figure>
                <img
                    src={travelPlace?.cover_image}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {travelPlace?.name}
                </h2>
                <p>{travelPlace?.location_name}</p>
                <div className="flex justify-between items-center">
                    <button
                        className="px-2 py-1 bg-g-primary text-md font-semibold rounded-md"
                        onClick={handleClick}
                    >
                        Details
                    </button>
                    <div className="card-actions">
                        {
                            travelPlace.tags && travelPlace.tags.slice(0, 3).map(tag =>
                                <div className="badge badge-outline">{tag}</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelPlaceCard;