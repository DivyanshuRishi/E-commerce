import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { addFavoriteToLocalStorage } from "../Utils/localStorage";
import Message from './Message';



const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { addToCart } = useCartStore();
    const { addToWishlist } = useWishlistStore();

    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [name, setName] = useState(""); // Added state for the reviewer's name
    const [qty, setQty] = useState(1);
    const [loadingProductReview, setLoadingProductReview] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const { user, checkAuth } = useUserStore(); // Get user and checkAuth from useUserStore
    const [hoverRating, setHoverRating] = useState(0); // Track hovered rating
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');


    const handleStarHover = (star) => {
        setHoverRating(star);
    };

    const handleStarLeave = () => {
        setHoverRating(0);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(`/api/products/${id}`); // Fetch product by ID
                setProduct(response.data); // Set product state
            } catch (err) {
                setError(err.response?.data.message || "Error fetching product"); // Set error message
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchProduct();
    }, [id]);


    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setLoadingProductReview(true);

        // Validate inputs
        if (rating < 1 || rating > 5 || !comment.trim() || !name.trim()) {
            toast.error("Please provide a rating between 1 and 5, a comment, and your name.");
            setLoadingProductReview(false);
            return;
        }

        // console.log("Submitting review with:", { rating, comment, name });

        try {
            // Submit the review
            const response = await axios.post(`/api/products/${id}/reviews`, { rating, comment, name });

            toast.success("Review submitted successfully");

            // Reset form fields
            setRating(0);
            setComment("");
            setName("");

            // Refresh product data after review submission
            const productResponse = await axios.get(`/api/products/${id}`);
            setProduct(productResponse.data);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response?.data.message || "An error occurred while submitting the review");
        } finally {
            setLoadingProductReview(false);
        }
    };

    const handleAddToWishlist = useCallback(() => {
        if (product) {
            addToWishlist(product);
            addFavoriteToLocalStorage(product);
            toast.success(`${product.name} has been added to your wishlist`);
        }
    }, [addToWishlist, product]);

    const addToCartHandler = () => {
        addToCart({ ...product, quantity: qty, color: selectedColor, size: selectedSize });
    };

    if (loading) return <Loader />;
    if (error) return <Message>{error}</Message>;
    if (!product) return <Message>No product found</Message>;





    return (
        <>
            {/* Product Section */}
            <div className="flex flex-col lg:flex-row p-6 gap-10 mt-4 max-w-6xl mx-auto rounded-lg text-white">
                {/* Product Image */}
                <div className="lg:flex-shrink-0 relative w-full lg:w-auto">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto max-h-[300px] rounded-lg shadow-md hover:scale-105 transition-transform duration-300 object-contain"
                    />
                    {/* Removed HeartIcon from here */}
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-6 w-full">
                    <h2 className="text-3xl font-bold">{product.name}</h2>
                    <p className="text-gray-400">Men Typography Printed Round Neck Cotton Slim Fit T-shirt</p>

                    <p className="text-xl font-semibold">
                        ₹{product.price}
                    </p>

                    {/* Brand */}
                    <div className="text-sm text-gray-600">
                        Brand: <span className="font-medium text-white">{product.brand}</span>
                    </div>

                    {/* Color Options */}
                    <div>
                        <p className="text-sm font-medium mb-1 text-white">COLOR:</p>
                        <div className="flex gap-2">
                            {['blue', 'red', 'gray'].map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border-2  ${selectedColor === color ? 'border-black' : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                    aria-label={`Color ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size Options */}
                    <div>
                        <p className="text-sm font-medium mb-1 text-white">SELECT SIZE:</p>
                        <div className="flex gap-2">
                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                    key={size}
                                    className={`border px-3 py-1 rounded  text-sm font-medium ${selectedSize === size ? 'bg-gray-100 text-black' : 'hover:bg-gray-100 text-white'
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                    aria-label={`Size ${size}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <p className="text-sm font-medium mb-1 text-white">QUANTITY:</p>
                        <select
                            className="border p-2 rounded text-sm text-black"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((q) => (
                                <option key={q} value={q} className="text-black">
                                    {q}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Buttons */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={addToCartHandler}
                            className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition duration-300 flex items-center justify-center"
                        >
                            <FaShoppingCart className="mr-2" /> ADD TO BAG
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            className="flex-1 bg-white text-pink-600 py-2 rounded-lg font-semibold hover:bg-pink-500/10 transition duration-300 flex items-center justify-center border border-pink-600"
                        >
                            <FaHeart className="mr-2" size={20} /> Wishlist
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row p-6 gap-10 mt-4 max-w-6xl mx-auto rounded-lg text-white">
                <div className="w-full">


                    {/* Review Form */}

                    <form
                        onSubmit={submitReviewHandler}
                        className="mb-6 p-4 rounded-lg w-full"
                    >
                        <h4 className="text-xl font-semibold mb-4 text-white">
                            Leave a Review
                        </h4>

                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.div
                                    key={star}
                                    whileHover={{
                                        scale: 1.2,
                                        color: "#ffd700", // Make it gold on hover
                                        transition: {
                                            yoyo: Infinity,
                                            duration: 0.5,
                                        },
                                    }}
                                    style={{
                                        color: star <= (hoverRating || rating) ? "#ffd700" : "#808080",
                                    }}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={handleStarLeave}
                                    onClick={() => setRating(star)}
                                >
                                    <FaStar
                                        className={`cursor-pointer`}
                                        size={30}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <textarea
                            className="w-full h-24 p-2 border rounded-lg mb-4 text-white focus:ring-2 focus:ring-pink-600"
                            placeholder="Write your review here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg mb-4 text-white focus:ring-2 focus:ring-pink-600"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
                            disabled={loadingProductReview}
                        >
                            {loadingProductReview ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>


                    {/* Display Reviews */}
                    <div className="w-full">
                        {product.reviews?.length === 0 ? (
                            <Message>No reviews yet.</Message>
                        ) : (
                            product.reviews?.map((review) => (
                                <div
                                    key={review._id}
                                    className="border-b py-4 border-gray-200 w-full"
                                >
                                    <div className="flex justify-between w-full">
                                        <div className="text-lg font-semibold text-white">{review.name}</div>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar
                                                    key={index}
                                                    className={
                                                        index < review.rating
                                                            ? "text-yellow-500"
                                                            : "text-gray-400"
                                                    }
                                                    size={18}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-2 w-full text-white">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );



};

export default ProductPage;




















  // return (
  //   <div className="product-page mx-auto my-8 max-w-7xl p-6">
  //     <Link to="/" className="text-pink-600 font-semibold hover:underline mb-4 inline-block">
  //       Go Back
  //     </Link>

  //     <div className="flex flex-wrap mt-6">
  //       <div className="w-full xl:w-[50%] lg:w-[45%] md:w-[30%] sm:w-[100%] relative mr-4">
  //         <img src={product.image} alt={product.name} className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
  //         <HeartIcon product={product} className="absolute top-4 right-4 cursor-pointer text-4xl text-red-600 hover:text-red-800 transition-colors" />
  //       </div>

  //       <div className="flex flex-col justify-between w-full xl:w-[45%] lg:w-[50%] md:w-[70%] sm:w-[100%]">
  //         <h2 className="text-4xl font-bold mb-2 text-gray-900">{product.name}</h2>
  //         <p className="text-lg text-gray-600 mb-4">{product.description}</p>
  //         <p className="text-4xl font-extrabold text-pink-600 mb-4">${product.price}</p>

  //         <div className="flex flex-wrap gap-4 mb-6 text-gray-700">
  //           <div className="flex items-center">
  //             <FaStore className="mr-2 text-pink-600" />
  //             <span>Brand: {product.brand}</span>
  //           </div>
  //           <div className="flex items-center">
  //             <FaClock className="mr-2 text-pink-600" />
  //             <span>Added: {moment(product.createdAt).fromNow()}</span>
  //           </div>
  //           <div className="flex items-center">
  //             <FaStar className="mr-2 text-pink-600" />
  //             <span>Reviews: {product.numReviews}</span>
  //           </div>
  //         </div>

  //         <div className="flex flex-wrap gap-4 text-gray-700">
  //           <div className="flex items-center">
  //             <FaStar className="mr-2 text-pink-600" />
  //             <span>Ratings: {product.rating}</span>
  //           </div>
  //           <div className="flex items-center">
  //             <FaShoppingCart className="mr-2 text-pink-600" />
  //             <span>Quantity: {qty}</span>
  //           </div>
  //           <div className="flex items-center">
  //             <FaBox className="mr-2 text-pink-600" />
  //             <span>In Stock: {product.countInStock > 0 ? "Yes" : "No"}</span>
  //           </div>
  //         </div>

  //         <div className="flex items-center mt-4 gap-4">
  //           {product.countInStock > 0 && (
  //             <select
  //               value={qty}
  //               onChange={(e) => setQty(Number(e.target.value))}
  //               className="p-2 border rounded-lg text-black focus:ring-2 focus:ring-pink-600 transition-all"
  //             >
  //               {[...Array(product.countInStock).keys()].map((x) => (
  //                 <option key={x + 1} value={x + 1}>
  //                   {x + 1}
  //                 </option>
  //               ))}
  //             </select>
  //           )}

  //           <button
  //             onClick={addToCartHandler}
  //             disabled={product.countInStock === 0}
  //             className="bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300 hover:bg-pink-700 disabled:bg-gray-400"
  //           >
  //             Add To Cart
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="mt-12 container flex flex-col items-start">
  //       {/* Customer Reviews Section */}
  //       <div className="review-section w-full mt-8 p-4 border-t">
  //         <h3 className="text-2xl font-semibold mb-4 text-gray-900">Customer Reviews</h3>
          
  //         <form onSubmit={submitReviewHandler} className="mb-6 p-4 border rounded-lg shadow-lg bg-gray-50">
  //           <h4 className="text-xl font-semibold mb-2 text-gray-900">Leave a Review</h4>
            
  //           <div className="flex items-center mb-4">
  //             {[1, 2, 3, 4, 5].map((star) => (
  //               <FaStar
  //                 key={star}
  //                 className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
  //                 onClick={() => setRating(star)}
  //                 size={30}
  //               />
  //             ))}
  //           </div>

  //           <textarea
  //             className="w-full h-24 p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
  //             placeholder="Write your review here..."
  //             value={comment}
  //             onChange={(e) => setComment(e.target.value)}
  //             required
  //           />
            
  //           <input
  //             type="text"
  //             className="w-full p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
  //             placeholder="Your Name"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             required
  //           />

  //           <button
  //             type="submit"
  //             className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
  //             disabled={loadingProductReview}
  //           >
  //             {loadingProductReview ? "Submitting..." : "Submit Review"}
  //           </button>
  //         </form>
          
  //         {product.reviews?.length === 0 ? (
  //           <Message>No reviews yet.</Message>
  //         ) : (
  //           product.reviews?.map((review) => (
  //             <div key={review._id} className="review border-b py-4">
  //               <div className="flex justify-between">
  //                 <div className="text-xl font-semibold text-gray-900">{review.name}</div>
  //                 <div className="flex items-center">
  //                   {[...Array(5)].map((_, index) => (
  //                     <FaStar
  //                       key={index}
  //                       className={index < review.rating ? "text-yellow-500" : "text-gray-300"}
  //                       size={18}
  //                     />
  //                   ))}
  //                 </div>
  //               </div>
  //               <div className="text-sm text-gray-500">{moment(review.createdAt).fromNow()}</div>
  //               <p className="mt-2 text-gray-800">{review.comment}</p>
  //             </div>
  //           ))
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );



// old one correct one





//   return (
//     <div className="product-page mx-auto my-8 max-w-7xl p-6 bg-dark-green text-white">
//       <Link to="/" className="text-pink-600 font-semibold hover:underline mb-4 inline-block">
//       <button className="bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300 hover:bg-pink-700 disabled:bg-gray-400">
//   Go Back
// </button>

//       </Link>
  
//       <div className="flex flex-wrap mt-6">
//         <div className="w-full xl:w-[50%] lg:w-[45%] md:w-[30%] sm:w-[100%] relative mr-4">
//           <img src={product.image} alt={product.name} className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />

//         </div>
  
//         <div className="flex flex-col justify-between w-full xl:w-[45%] lg:w-[50%] md:w-[70%] sm:w-[100%]">
//           <h2 className="text-4xl font-bold mb-2 text-gray-100">{product.name}</h2>
//           <p className="text-lg text-gray-300 mb-4">{product.description}</p>
//           <p className="text-4xl font-extrabold text-pink-600 mb-4">₹{product.price}</p>
  
//           <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
//             <div className="flex items-center">
//               <FaStore className="mr-2 text-pink-600" />
//               <span>Brand: {product.brand}</span>
//             </div>
//             <div className="flex items-center">
//               <FaClock className="mr-2 text-pink-600" />
//               <span>Added: {moment(product.createdAt).fromNow()}</span>
//             </div>
//             <div className="flex items-center">
//               <FaStar className="mr-2 text-pink-600" />
//               <span>Reviews: {product.numReviews}</span>
//             </div>
//           </div>
  
//           <div className="flex flex-wrap gap-4 text-gray-300">
//             <div className="flex items-center">
//               <FaStar className="mr-2 text-pink-600" />
//               <span>Ratings: {product.rating}</span>
//             </div>
//             <div className="flex items-center">
//               <FaShoppingCart className="mr-2 text-pink-600" />
//               <span>Quantity: {qty}</span>
//             </div>
//             <div className="flex items-center">
//               <FaBox className="mr-2 text-pink-600" />
//               <span>In Stock: {product.countInStock > 0 ? "Yes" : "No"}</span>
//             </div>
//           </div>
  
//           <div className="flex items-center mt-4 gap-4">
//             {product.countInStock > 0 && (
//               <select
//                 value={qty}
//                 onChange={(e) => setQty(Number(e.target.value))}
//                 className="p-2 border rounded-lg text-black focus:ring-2 focus:ring-pink-600 transition-all"
//               >
//                 {[...Array(product.countInStock).keys()].map((x) => (
//                   <option key={x + 1} value={x + 1}>
//                     {x + 1}
//                   </option>
//                 ))}
//               </select>
//             )}
  
//             <button
//               onClick={addToCartHandler}
//               disabled={product.countInStock === 0}
//               className="bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300 hover:bg-pink-700 disabled:bg-gray-400"
//             >
//               Add To Cart
//             </button>
                     
//           </div>
//                     <HeartIcon product={product} className="absolute top-4 right-4 cursor-pointer text-4xl text-red-600 hover:text-red-800 transition-colors" />
//         </div>
//       </div>
  
//       <div className="mt-12 container flex flex-col items-start">
//         {/* Customer Reviews Section */}
//         <div className="review-section w-full mt-8 p-4 border-t border-gray-600 bg-gray-800">
//           <h3 className="text-2xl font-semibold mb-4 text-gray-100">Customer Reviews</h3>
          
//           <form onSubmit={submitReviewHandler} className="mb-6 p-4 border rounded-lg shadow-lg bg-gray-700">
//             <h4 className="text-xl font-semibold mb-2 text-gray-100">Leave a Review</h4>
            
//             <div className="flex items-center mb-4">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <FaStar
//                   key={star}
//                   className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
//                   onClick={() => setRating(star)}
//                   size={30}
//                 />
//               ))}
//             </div>
  
//             <textarea
//               className="w-full h-24 p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
//               placeholder="Write your review here..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               required
//             />
            
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
//               placeholder="Your Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
  
//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
//               disabled={loadingProductReview}
//             >
//               {loadingProductReview ? "Submitting..." : "Submit Review"}
//             </button>
//           </form>
          
//           {product.reviews?.length === 0 ? (
//             <Message>No reviews yet.</Message>
//           ) : (
//             product.reviews?.map((review) => (
//               <div key={review._id} className="review border-b py-4 border-gray-600">
//                 <div className="flex justify-between">
//                   <div className="text-xl font-semibold text-gray-100">{review.name}</div>
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, index) => (
//                       <FaStar
//                         key={index}
//                         className={index < review.rating ? "text-yellow-500" : "text-gray-300"}
//                         size={18}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-400">{moment(review.createdAt).fromNow()}</div>
//                 <p className="mt-2 text-gray-300">{review.comment}</p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
  


// newest css chatgpt
// newest css with photo
// return (
// <>


// {/* Product Section */}
// <div className="flex flex-col lg:flex-row p-6 gap-10 bg-white mt-4 max-w-6xl mx-auto shadow rounded">
//   {/* Product Image */}
//   <div className="flex-1 relative">
//     <img
//       src={product.image}
//       alt={product.name}
//       className="w-full h-auto rounded shadow hover:scale-105 transition-transform"
//     />
//     <HeartIcon product={product} className="absolute top-4 right-4 text-red-600 text-3xl" />
//   </div>

//   {/* Product Details */}
//   <div className="flex-1 space-y-4">
//     <h2 className="text-2xl font-semibold">{product.name}</h2>
//     <p className="text-lg font-bold">
//       ₹{product.price}{" "}
//       <span className="line-through text-gray-400 ml-2">₹{product.price * 2}</span>{" "}
//       <span className="text-green-600 ml-2">50% OFF</span>
//     </p>

//     {/* Rating */}
//     <div className="flex items-center gap-2">
//       <span className="bg-green-600 text-white px-2 py-1 text-sm rounded flex items-center">
//         {product.rating} <FaStar className="ml-1 text-yellow-300" />
//       </span>
//       <span className="text-sm text-gray-600">({product.numReviews} ratings)</span>
//     </div>

//     {/* Brand */}
//     <div className="text-sm text-gray-600">
//       Brand: <span className="font-medium">{product.brand}</span>
//     </div>

//     {/* Color Options */}
//     <div>
//       <p className="text-sm font-medium mb-1">COLOR:</p>
//       <div className="flex gap-2">
//         <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-black"></div>
//         <div className="w-6 h-6 bg-red-500 rounded-full"></div>
//         <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
//       </div>
//     </div>

//     {/* Size Options */}
//     <div>
//       <p className="text-sm font-medium mb-1">SELECT SIZE:</p>
//       <div className="flex gap-2">
//         {["S", "M", "L", "XL", "XXL"].map((size) => (
//           <button
//             key={size}
//             className="border px-3 py-1 rounded hover:bg-gray-100"
//           >
//             {size}
//           </button>
//         ))}
//       </div>
//     </div>

//     {/* Quantity */}
//     <div>
//       <p className="text-sm font-medium mb-1">QUANTITY:</p>
//       <select
//         className="border p-2 rounded"
//         value={qty}
//         onChange={(e) => setQty(Number(e.target.value))}
//       >
//         {[1, 2, 3, 4, 5].map((q) => (
//           <option key={q} value={q}>
//             {q}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Buttons */}
//     <div className="flex gap-4 mt-4">
//       <button
//         onClick={addToCartHandler}
//         className="flex-1 bg-pink-600 text-white py-2 rounded font-semibold hover:bg-pink-700"
//       >
//         ADD TO BAG
//       </button>
//       <button className="p-2 border rounded text-pink-600 border-pink-600 hover:bg-pink-50">
//         <FaHeart />
//       </button>
//     </div>
//     <form onSubmit={submitReviewHandler} className="mb-6 p-4 border rounded-lg shadow-lg bg-gray-700">
//               <h4 className="text-xl font-semibold mb-2 text-gray-100">Leave a Review</h4>
            
//                <div className="flex items-center mb-4">
//                  {[1, 2, 3, 4, 5].map((star) => (
//                 <FaStar
//                   key={star}
//                   className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
//                   onClick={() => setRating(star)}
//                   size={30}
//                 />
//               ))}
//             </div>
  
//             <textarea
//               className="w-full h-24 p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
//               placeholder="Write your review here..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               required
//             />
            
//             <input
//               type="text"
//               className="w-full p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
//               placeholder="Your Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
  
//             <button
//               type="submit"
//               className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
//               disabled={loadingProductReview}
//             >
//               {loadingProductReview ? "Submitting..." : "Submit Review"}
//             </button>
//           </form>

//           {product.reviews?.length === 0 ? (
//             <Message>No reviews yet.</Message>
//           ) : (
//             product.reviews?.map((review) => (
//               <div key={review._id} className="review border-b py-4 border-gray-600">
//                 <div className="flex justify-between">
//                   <div className="text-xl font-semibold text-gray-100">{review.name}</div>
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, index) => (
//                       <FaStar
//                         key={index}
//                         className={index < review.rating ? "text-yellow-500" : "text-gray-300"}
//                         size={18}
//                       />
//                     ))}
//                   </div>
//                 </div>
//                 {/* <div className="text-sm text-gray-400">{moment(review.createdAt).fromNow()}</div> */}
//                 <p className="mt-2 text-gray-300">{review.comment}</p>
//               </div>
//             ))
//           )}
//   </div>
// </div>
// </>
// );

