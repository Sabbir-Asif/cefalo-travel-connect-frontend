import React, { useEffect, useState } from 'react';
import type { WishlistWithUser } from '../../types/Wishlist';
import { getPublicWishlistAPI } from '../../utils/api/wishlist';
import WIshlistCard from '../../components/wishlist/WIshlistCard';

const Wishlists: React.FC = () => {
    const [wishlists, setwishlists] = useState<WishlistWithUser[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWishlists = async () => {
            setLoading(true);
            const data = await getPublicWishlistAPI();
            setwishlists(data);
            setLoading(false);
        }

        try {
            fetchWishlists();
        } catch (err) {
            console.log(err);
        }
    }, [])

    if (isLoading) {
        return <div>
            <span className="loading loading-infinity loading-md"></span>
            <span className="loading loading-infinity loading-lg"></span>
            <span className="loading loading-infinity loading-xl"></span>
        </div>
    }

    return (
        <div>
            <h2 className="text-4xl text-center font-nunito font-black mb-16">Public Wishlists</h2>
            <div className='grid grid-cols-3 gap-6'>
                {
                    wishlists.map(wishlist => (
                        <WIshlistCard key={wishlist.id} wishlist={wishlist} />
                    ))
                }
            </div>
        </div>
    );
};

export default Wishlists;