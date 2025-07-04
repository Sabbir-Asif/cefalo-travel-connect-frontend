import React from 'react';
import type { Lodge } from '../../../types/Lodge';

interface AccomodationCardProps {
    accomodation: Lodge;
}

const AccomodationCard: React.FC<AccomodationCardProps> = ({ accomodation }) => {
    return (
        <div className="card w-96 bg-gray-50 font-nunito shadow-md">
            {accomodation.cover_image ? (
                <figure>
                    <img
                        src={accomodation.cover_image}
                        alt={accomodation.name}
                        className="w-full h-48 object-cover"
                    />
                </figure>
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                </div>
            )}
            <div className="card-body">
                <div className='flex  justify-between'>
                    <div>
                        <h2 className="text-xl font-semibold">{accomodation.name}</h2>
                        <p className="text-sm text-gray-600">{accomodation.location_name}</p>
                    </div>
                    <div>
                        <p className="font-bold mt-2">{accomodation.price}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{accomodation.description}</p>
            </div>
        </div>
    );
};

export default AccomodationCard;
