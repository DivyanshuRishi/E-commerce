import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
// import Ratings from "./Ratings";
import Ratings from "../components/Ratings";
import SmallProduct from "./SmallProduct";


const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Tab Navigation */}
      <nav className="flex flex-col md:flex-row md:mr-[5rem] border-b mb-4">
        {['Write Your Review', 'All Reviews', 'Related Products'].map((tab, index) => (
          <div
            key={index}
            className={`flex-1 p-4 cursor-pointer text-lg text-center transition duration-300 
              ${activeTab === index + 1 ? "font-bold border-b-2 border-pink-600" : "text-gray-600 hover:text-pink-600"}`}
            onClick={() => handleTabClick(index + 1)}
          >
            {tab}
          </div>
        ))}
      </nav>

      {/* Tab Content */}
      <section className="flex-1">
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler} className="bg-gray-100 p-4 rounded-lg shadow-lg">
                <div className="my-2">
                  <label htmlFor="rating" className="block text-xl mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div className="my-2">
                  <label htmlFor="comment" className="block text-xl mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg transition duration-300 hover:bg-pink-700"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login" className="text-pink-600 hover:underline">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {product.reviews.length === 0 ? (
              <p>No Reviews</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1A1A1A] p-4 rounded-lg mb-5 shadow-md"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#B0B0B0]">{review.name}</strong>
                    <p className="text-[#B0B0B0]">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>
                  <p className="my-4">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 3 && (
          <section className="flex flex-wrap justify-start">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id} className="p-2">
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
