import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// if not in redis, fetch from mongodb
		// .lean() is gonna return a plain javascript object instead of a mongodb document
		// which is good for performance
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// store in redis for future quick access

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category, quantity, brand } = req.body;

		// Ensure `quantity` and `brand` are provided, or return a 400 error
		if (!quantity || !brand) {
			return res.status(400).json({ message: "Quantity and brand are required fields." });
		}

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url || "",
			category,
			quantity,  // Include the quantity field
			brand      // Include the brand field
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};



export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};




// export const getProductsByCategory = async (req, res) => {
//     const { category } = req.params; // Get the category from request params

//     try {
//         // Find the category to get the ObjectId
//         const categoryDoc = await Category.findOne({ name: category }); // Adjust as necessary

//         if (!categoryDoc) {
//             return res.status(404).json({ message: "Category not found." });
//         }

//         // Now, find products that belong to this category
//         const products = await Product.find({ category: categoryDoc._id });
//         res.json(products);
//     } catch (error) {
//         console.error("Error in getProductsByCategory controller", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };


export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		// The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}




export const addProductReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment, name } = req.body; // Ensure name is extracted from req.body

        // Check if all required fields are provided
        if (!rating || !comment || !name) {
            return res.status(400).json({ message: "Rating, comment, and name are required." });
        }

        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user has already reviewed this product
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        // Create a new review
        const review = {
            name, // Now taken from req.body
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        // Add the review to the product's reviews array
        product.reviews.push(review);

        // Update the number of reviews and calculate the new average rating
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.numReviews;

        // Save the updated product
        await product.save();

        // Send success response
        res.status(201).json({ message: "Review added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
});



// export const addProductReview = asyncHandler(async (req, res) => {
//     try {
//         const { rating, comment } = req.body; // Note: name is not extracted from req.body, as it's taken from req.user

//         // Validate that required fields are present
//         if (!rating || !comment) {
//             return res.status(400).json({ message: "Rating and comment are required." });
//         }

//         // Find the product by ID
//         const product = await Product.findById(req.params.id);

//         if (product) {
//             // Check if the user has already reviewed this product
//             const alreadyReviewed = product.reviews.find(
//                 (r) => r.user.toString() === req.user._id.toString()
//             );

//             if (alreadyReviewed) {
//                 res.status(400);
//                 throw new Error("Product already reviewed");
//             }

//             // Create a new review
//             const review = {
//                 name: req.user.username, // Assuming req.user.username is provided by your authentication middleware
//                 rating: Number(rating), // Convert rating to a number
//                 comment,
//                 user: req.user._id, // User ID from the request
//             };

//             // Push the review to the product's reviews array
//             product.reviews.push(review);

//             // Update the product's number of reviews and rating
//             product.numReviews = product.reviews.length;

//             // Calculate the new average rating
//             product.rating =
//                 product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//                 product.reviews.length;

//             // Save the updated product
//             await product.save();

//             // Respond with success
//             res.status(201).json({ message: "Review added" });
//         } else {
//             res.status(404);
//             throw new Error("Product not found");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: error.message }); // Send a consistent error message
//     }
// });


export const getProductById = async (req, res) => {
    const { id } = req.params;

	// Check if the id is a valid ObjectId
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: 'Invalid product ID' });
	  }
    try {
        const product = await Product.findById(id); // Find product by ID

        // Check if the product was found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Return the found product
        res.status(200).json(product); // Sending the product details with a 200 status
    } catch (error) {
        // Log the error for debugging
        console.error("Error in getProductById controller:", error);

        // Check if the error is due to an invalid ID format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // Return a generic server error message
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


