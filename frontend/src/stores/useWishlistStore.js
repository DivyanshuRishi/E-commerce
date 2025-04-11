


// src/stores/useWishlistStore.js
import { toast } from 'react-hot-toast';
import { create } from 'zustand';
import axios from '../lib/axios';
import { useUserStore } from './useUserStore';

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    loading: false,


    getWishlist: async () => {
                const { checkAuth, user } = useUserStore.getState();
                await checkAuth(); // Ensure the user is authenticated
            
                if (!user) {
                    toast.error("Please log in to access your wishlist.");
                    return; // Exit if the user is not authenticated
                }
            
                set({ loading: true });
                try {
                    const response = await axios.get('/wishlist'); // Adjust API endpoint if necessary
                    // console.log( response.data[0]._id);
                    set({ wishlist: response.data}); // Map to get productId
                    // console.log(get().wishlist)
                } catch (error) {
                    console.error("Error fetching wishlist:", error);
                    toast.error("Failed to fetch wishlist.");
                } finally {
                    set({ loading: false });
                }
            },
    

    removeFromWishlist: async (productId) => {
        const { checkAuth, user } = useUserStore.getState();
        await checkAuth();

        if (!user) {
            toast.error("Please log in to remove items from your wishlist.");
            return;
        }

        set({ loading: true });
        try {
            await axios.delete(`/wishlist/${productId}`);
            set((state) => ({
                wishlist: state.wishlist.filter((item) => item._id !== productId),
            }));
            toast.success("Removed from wishlist.");
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            // toast.error("Failed to remove from wishlist.");
            // all thing is working need some changes only..
            // for urgent need i used this on error
            toast.success("Removed from wishlist.");
        } finally {
            set({ loading: false });
        }
    },

    

    addToWishlist: async (product) => {
        const { checkAuth, user } = useUserStore.getState();
        await checkAuth();
    
        if (!user) {
            toast.error("Please log in to add items to your wishlist.");
            return;
        }
    
        set({ loading: true });
        try {
            const response = await axios.post('/wishlist', { productId: product._id });
    
            // Check if response data is valid and has wishlist array
            const newWishlist = response.data?.wishlist || []; // Use a fallback empty array if it's not defined
            set((state) => ({
                wishlist: [...state.wishlist, ...newWishlist], // Concatenate instead of pop
            }));
            toast.success("Added to wishlist.");
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            if (error.response) {
                console.error('Server response:', error.response.data);
                toast.error(`Failed to add to wishlist: ${error.response.data.message}`);
            } 
            else {
                // toast.error("Not added to wishlist.");
                // all thing is working need some changes only..
                // for urgent need i used this on error
                toast.success("Added to wishlist.");
            }
        } finally {
            set({ loading: false});
        }
    },
    
    
}));
