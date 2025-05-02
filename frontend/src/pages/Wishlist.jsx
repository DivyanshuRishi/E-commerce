




import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Importing trash icon for delete button
import ProductCard from '../components/ProductCard';
import { useWishlistStore } from '../stores/useWishlistStore';

const Wishlist = () => {
    const { wishlist, getWishlist, removeFromWishlist, loading } = useWishlistStore();
    const productsDataRef = useRef([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    // Fetch products for wishlist items
    const fetchProducts = async () => {
        if (!Array.isArray(wishlist?.wishlist)) {
            // console.error("Expected wishlist to be an array inside an object, got:", wishlist);
            return;
        }

        if (wishlist.wishlist.length === 0) {
            // console.log("Wishlist is empty. Skipping fetch.");
            return;
        }

        if (hasFetched) {
            // console.log("Products already fetched. Skipping fetch.");
            return;
        }

        setLoadingProducts(true);
        // console.log("Fetching products for wishlist items:", wishlist.wishlist);

        const productPromises = wishlist.wishlist.map(item => {
            const productId = item.productId._id;
            return axios.get(`/api/products/${productId}`)
                .then(response => response.data)
                .catch(error => {
                    // console.error("Error fetching product:", error);
                    return null;
                });
        });

        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter(product => product !== null);
        // console.log("Fetched products:", validProducts);

        productsDataRef.current = validProducts;
        setHasFetched(true);
        setLoadingProducts(false);
    };

    useEffect(() => {
        console.log("useEffect - wishlist changed:", wishlist);

        if (!wishlist || !Array.isArray(wishlist.wishlist) || wishlist.wishlist.length === 0) {
            // console.log("No items in the wishlist or products already fetched.");
            return;
        }

        if (!hasFetched) {
            fetchProducts();
        }
    }, [wishlist, hasFetched]);

    const handleFetchWishlist = async () => {
        // console.log("Fetching wishlist...");
        await getWishlist();
    };

    const handleRemoveProduct = (productId) => {
        // console.log("Removing product from wishlist:", productId);
        removeFromWishlist(productId);
    };

    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Your Wishlist</h1>
                <button 
                    onClick={handleFetchWishlist} 
                    disabled={loading} 
                    className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {loading ? "Loading Wishlist..." : "Fetch Wishlist"}
                </button>
            </div>

            {loadingProducts && (
                <div className="space-y-4">
                    {/* Skeleton loader for products */}
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-300 h-40 rounded-lg"></div>
                    ))}
                </div>
            )}

            {productsDataRef.current.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {productsDataRef.current.map((product) => (
                        <div key={product._id} className="relative bg-white p-4 rounded-lg shadow-md overflow-hidden">
                            <ProductCard product={product} />

                            {/* Delete Button */}
                            <div 
                                className="absolute top-2 right-2 bg-red-500 text-white p-3 rounded-full cursor-pointer transform hover:scale-110 transition-transform duration-300"
                                onClick={() => handleRemoveProduct(product._id)}
                                title="Remove from Wishlist"
                            >
                                <FaTrashAlt size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !loadingProducts && <p className="text-center text-gray-500 mt-4">No products in the wishlist.</p>
            )}
        </div>
    );
};

export default Wishlist;











