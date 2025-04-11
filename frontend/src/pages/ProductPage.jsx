


import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useCartStore } from '../stores/useCartStore';
import { useUserStore } from '../stores/useUserStore';
import HeartIcon from './HeartIcon';
import Message from './Message';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToCart } = useCartStore();
  
  const [product, setProduct] = useState(null); 
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(""); // Added state for the reviewer's name
  const [qty, setQty] = useState(1);
  const [loadingProductReview, setLoadingProductReview] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { user, checkAuth } = useUserStore(); // Get user and checkAuth from useUserStore

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

  
  const addToCartHandler = () => {
    addToCart({ ...product, quantity: qty });
  };

  if (loading) return <Loader />;
  if (error) return <Message>{error}</Message>;
  if (!product) return <Message>No product found</Message>;

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


  return (
    <div className="product-page mx-auto my-8 max-w-7xl p-6 bg-dark-green text-white">
      <Link to="/" className="text-pink-600 font-semibold hover:underline mb-4 inline-block">
        Go Back
      </Link>
  
      <div className="flex flex-wrap mt-6">
        <div className="w-full xl:w-[50%] lg:w-[45%] md:w-[30%] sm:w-[100%] relative mr-4">
          <img src={product.image} alt={product.name} className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />

        </div>
  
        <div className="flex flex-col justify-between w-full xl:w-[45%] lg:w-[50%] md:w-[70%] sm:w-[100%]">
          <h2 className="text-4xl font-bold mb-2 text-gray-100">{product.name}</h2>
          <p className="text-lg text-gray-300 mb-4">{product.description}</p>
          <p className="text-4xl font-extrabold text-pink-600 mb-4">₹{product.price}</p>
  
          <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
            <div className="flex items-center">
              <FaStore className="mr-2 text-pink-600" />
              <span>Brand: {product.brand}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-pink-600" />
              <span>Added: {moment(product.createdAt).fromNow()}</span>
            </div>
            <div className="flex items-center">
              <FaStar className="mr-2 text-pink-600" />
              <span>Reviews: {product.numReviews}</span>
            </div>
          </div>
  
          <div className="flex flex-wrap gap-4 text-gray-300">
            <div className="flex items-center">
              <FaStar className="mr-2 text-pink-600" />
              <span>Ratings: {product.rating}</span>
            </div>
            <div className="flex items-center">
              <FaShoppingCart className="mr-2 text-pink-600" />
              <span>Quantity: {qty}</span>
            </div>
            <div className="flex items-center">
              <FaBox className="mr-2 text-pink-600" />
              <span>In Stock: {product.countInStock > 0 ? "Yes" : "No"}</span>
            </div>
          </div>
  
          <div className="flex items-center mt-4 gap-4">
            {product.countInStock > 0 && (
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="p-2 border rounded-lg text-black focus:ring-2 focus:ring-pink-600 transition-all"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            )}
  
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-300 hover:bg-pink-700 disabled:bg-gray-400"
            >
              Add To Cart
            </button>
                     
          </div>
                    <HeartIcon product={product} className="absolute top-4 right-4 cursor-pointer text-4xl text-red-600 hover:text-red-800 transition-colors" />
        </div>
      </div>
  
      <div className="mt-12 container flex flex-col items-start">
        {/* Customer Reviews Section */}
        <div className="review-section w-full mt-8 p-4 border-t border-gray-600 bg-gray-800">
          <h3 className="text-2xl font-semibold mb-4 text-gray-100">Customer Reviews</h3>
          
          <form onSubmit={submitReviewHandler} className="mb-6 p-4 border rounded-lg shadow-lg bg-gray-700">
            <h4 className="text-xl font-semibold mb-2 text-gray-100">Leave a Review</h4>
            
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                  onClick={() => setRating(star)}
                  size={30}
                />
              ))}
            </div>
  
            <textarea
              className="w-full h-24 p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4 text-gray-900 focus:ring-2 focus:ring-pink-600"
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
          
          {product.reviews?.length === 0 ? (
            <Message>No reviews yet.</Message>
          ) : (
            product.reviews?.map((review) => (
              <div key={review._id} className="review border-b py-4 border-gray-600">
                <div className="flex justify-between">
                  <div className="text-xl font-semibold text-gray-100">{review.name}</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < review.rating ? "text-yellow-500" : "text-gray-300"}
                        size={18}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-400">{moment(review.createdAt).fromNow()}</div>
                <p className="mt-2 text-gray-300">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
  


};

export default ProductPage;


