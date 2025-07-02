import React, { useState } from 'react';
import { type TravelPlaceType } from "../../types/TravelPlace";
import { useNavigate } from 'react-router';
import CreateWishlistModal from '../wishlist/CreateWishlistModal';
import { FaRegBookmark } from "react-icons/fa6";

interface TravelPlaceCardProps {
    travelPlace: TravelPlaceType
}

const TravelPlaceCard: React.FC<TravelPlaceCardProps> = ({ travelPlace }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDetailsClick = () => {
        navigate(`/travel-places/${travelPlace.id}`);
    };

    const handleWishlistClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="card bg-gray-50 shadow-sm">
                <figure>
                    <img
                        src={travelPlace?.cover_image}
                        alt={travelPlace?.name}
                    />
                </figure>
                <div className="card-body">
                    <div className='flex justify-between'>
                        <h2 className="card-title">
                            {travelPlace?.name}
                        </h2>
                        <button 
                        className='hover:bg-g-primary text-lg'
                        onClick={handleWishlistClick}
                        >
                            <FaRegBookmark />
                        </button>
                    </div>
                    <p>{travelPlace?.location_name}</p>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                className="px-2 py-1 bg-g-primary text-md font-semibold rounded-md"
                                onClick={handleDetailsClick}
                            >
                                Details
                            </button>
                        </div>
                        <div className="card-actions">
                            {
                                travelPlace.tags && travelPlace.tags.slice(0, 3).map((tag, index) =>
                                    <div key={index} className="badge badge-outline">{tag}</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <CreateWishlistModal
                travelPlace={travelPlace}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default TravelPlaceCard;