import React from 'react';
import type { WishlistWithUser } from '../../types/Wishlist';
import { useNavigate } from 'react-router';

interface WishlistCardProp {
    wishlist: WishlistWithUser;
}

const WIshlistCard: React.FC<WishlistCardProp> = ({ wishlist }) => {
    const travelDate = new Date(wishlist.travel_date).toLocaleDateString();
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/wishlists/${wishlist.id}`)
    }
    return (
        <div className="card bg-gray-50 max-w-96 max-h-96 shadow-sm">
            <figure>
                <img
                    src={wishlist.cover_image}
                    alt="Shoes" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {
                        wishlist.title
                    }
                </h2>
                <p>{wishlist.location_name}</p>
                <div className='flex items-center justify-between'>
                    <div className='text-sm font-nunito'>
                        By: <span
                            className='text-orange-600'
                        >{wishlist.user.name}</span>
                    </div>
                    <div className="">
                        Travelling at: <span className='text-orange-600'>{travelDate}</span>
                    </div>
                </div>
            </div>
            <button
                className='btn bg-black font-nunito font-bold text-white'
                onClick={handleNavigate}
            >
                View Details
            </button>
        </div>
    );
};

export default WIshlistCard;