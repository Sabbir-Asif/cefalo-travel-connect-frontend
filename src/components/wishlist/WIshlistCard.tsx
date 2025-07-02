import React from 'react';
import type { WishlistWithUser } from '../../types/Wishlist';

interface WishlistCardProp {
    wishlist: WishlistWithUser;
}

const WIshlistCard: React.FC<WishlistCardProp> = ({ wishlist }) => {
    const travelDate = new Date(wishlist.travel_date).toLocaleDateString();
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
        </div>
    );
};

export default WIshlistCard;