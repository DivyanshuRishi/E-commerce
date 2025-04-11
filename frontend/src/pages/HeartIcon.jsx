

import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlistStore } from "../stores/useWishlistStore";
import { addFavoriteToLocalStorage, removeFavoriteFromLocalStorage } from "../Utils/localStorage";

const HeartIcon = React.memo(({ product }) => {
  const { wishlist, addToWishlist, removeFromWishlist, getWishlist } = useWishlistStore();
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // Fetch wishlist only once
  useEffect(() => {
    const fetchWishlist = async () => {
      await getWishlist(); // Get wishlist data
      setLoadingWishlist(false); // Set loading to false once data is fetched
    };

    if (!wishlist || wishlist.length === 0) {
      fetchWishlist();
    } else {
      setLoadingWishlist(false); // If already fetched, skip fetching
    }
  }, [wishlist, getWishlist]);

  // Ensure the wishlist is in a safe state (array)
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  const isFavorite = safeWishlist.some((item) => item.productId._id === product._id);

  const toggleFavorites = () => {
    if (isFavorite) {
      removeFromWishlist(product._id); // Remove product from wishlist
      removeFavoriteFromLocalStorage(product._id); // Sync with localStorage
    } else {
      addToWishlist(product); // Add product to wishlist
      addFavoriteToLocalStorage(product); // Sync with localStorage
    }
  };

  return (
    <div className="relative">
      {loadingWishlist ? (
        <div className="absolute top-2 right-5">
          <div className="spinner"></div> {/* Your spinner */}
        </div>
      ) : (
        <div className="absolute top-2 right-5 cursor-pointer" onClick={toggleFavorites}>
          {isFavorite ? <FaHeart className="text-pink-500" /> : <FaRegHeart className="text-white" />}
        </div>
      )}
    </div>
  );
});

export default HeartIcon;
