

import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: [true,"Image is required"] },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, min: 0 },
    numReviews: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, required: true, min: 0 },
    isFeatured: {
			type: Boolean,
			default: false,
		},
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
