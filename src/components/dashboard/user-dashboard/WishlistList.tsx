import type React from "react";
import { useAuth } from "../../../context/useAuth";
import { useEffect, useState } from "react";
import { getWishlistByUserIdAPI } from "../../../utils/api/wishlist";
import type { Wishlist } from "../../../types/Wishlist";
import WIshlistWithoutUserCard from "../../wishlist/WishlistWithoutUserCard";

const WishlistList: React.FC = () => {
    const { user } = useAuth();
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            const wishlistData = await getWishlistByUserIdAPI(user.id);
            setWishlists(wishlistData);
        };

        fetchData();
    }, [user?.id]);

    if (wishlists.length === 0) {
        return <div>
            No Wishlist Found
        </div>
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlists.map((wishlist: Wishlist) => (
                    <WIshlistWithoutUserCard
                        key={wishlist.id}
                        wishlist={wishlist}
                    />
                ))}
            </div>
        </div>
    );
};

export default WishlistList;