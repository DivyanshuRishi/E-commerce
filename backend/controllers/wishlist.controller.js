// // src/controllers/wishlist.controller.js
// import User from '../models/user.model.js'; // Adjust the path based on your structure

// // Get user's wishlist
// export const getUserWishlist = async (req, res) => {
//     try {
//         const userId = req.user.id; // Assuming req.user is populated by your auth middleware
//         const user = await User.findById(userId).populate('wishlist.productId'); // Populate to get product details

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user.wishlist);
//     } catch (error) {
//         console.error("Error fetching wishlist:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };



// // Example addToWishlist function in wishlist.controller.js
// // export const addToWishlist = async (req, res) => {
// //     try {
// //         const userId = req.user._id; // Ensure req.user is populated correctly
// //         const productId = req.body.productId; // Assuming productId is sent in the body

// //         // Check if productId is defined
// //         if (!productId) {
// //             return res.status(400).json({ message: "Product ID is required." });
// //         }

// //         // Retrieve the user's wishlist from the database
// //         const userWishlist = await Wishlist.findOne({ userId });
        
// //         // Check if the wishlist exists
// //         if (!userWishlist) {
// //             return res.status(404).json({ message: "Wishlist not found." });
// //         }

// //         // Check if the product is already in the wishlist
// //         const productExists = userWishlist.products.some((item) => item.toString() === productId.toString());
        
// //         if (productExists) {
// //             return res.status(400).json({ message: "Product is already in the wishlist." });
// //         }

// //         // Add the product to the wishlist
// //         userWishlist.products.push(productId);
// //         await userWishlist.save();

// //         return res.status(200).json({ message: "Product added to wishlist successfully." });
// //     } catch (error) {
// //         console.error("Error adding to wishlist:", error);
// //         return res.status(500).json({ message: "Error adding to wishlist." });
// //     }
// // };

// // controllers/cart.controller.js

// export const addToCart = async (req, res) => {
//     const { productId } = req.body; // Extract productId from the request body
//     const userId = req.user.id; // Get the userId from the authenticated user

//     try {
//         // Find the user
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the product already exists in the cart
//         const existingCartItem = user.cartItems.find(item => item.product.toString() === productId);

//         if (existingCartItem) {
//             // If it exists, increment the quantity
//             existingCartItem.quantity += 1;
//         } else {
//             // If it does not exist, add a new cart item
//             user.cartItems.push({ product: productId, quantity: 1 });
//         }

//         // Save the updated user
//         await user.save();

//         res.status(200).json({ message: 'Product added to cart', cartItems: user.cartItems });
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };



// export const removeFromWishlist = async (req, res) => {
//     const { productId } = req.params; // Get productId from route parameters
//     const userId = req.user.id;

//     try {
//         console.log(`Removing productId: ${productId} for userId: ${userId}`);

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         console.log('User wishlist:', user.wishlist);

//         // Check if product exists in wishlist by comparing _id
//         const productExists = user.wishlist.some(item => item._id.toString() === productId);

//         if (!productExists) {
//             return res.status(404).json({ message: 'Product not found in wishlist' });
//         }

//         // Remove product from wishlist
//         user.wishlist = user.wishlist.filter(item => item._id.toString() !== productId);
//         await user.save();

//         res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
//     } catch (error) {
//         console.error("Error removing from wishlist:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// controllers/wishlist.controller.js

import User from '../models/user.model.js'; // Adjust the path as necessary

// Add to Wishlist function
export const addToWishlist = async (req, res) => {
    const { productId } = req.body; // Get productId from request body
    const userId = req.user.id; // Get user ID from authenticated user

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product already exists in wishlist
        const productExists = user.wishlist.some(item => item.productId.toString() === productId);
        if (productExists) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add product to wishlist
        user.wishlist.push({ productId });
        await user.save();

        res.status(201).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get User Wishlist function
export const getUserWishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('wishlist.productId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove from Wishlist function
export const removeFromWishlist = async (req, res) => {
    const { productId } = req.params; // Get productId from route parameters
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product exists in wishlist
        const productExists = user.wishlist.some(item => item.productId.toString() === productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        // Remove product from wishlist
        user.wishlist = user.wishlist.filter(item => item.productId.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
