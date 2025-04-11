import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
// import HeartIcon from "./HeartIcon";

const FeaturedProducts = ({ featuredProducts }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, featuredProducts.length - itemsPerPage));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
    } else {
      addToCart({ ...product, qty: 1 });
      toast.success("Item added successfully", { id: "cartAdd", duration: 2000 });
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">Featured Products</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {featuredProducts?.map((product) => (
                <div key={product._id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
                  <div className="flex flex-col w-full max-w-sm rounded-lg border border-gray-700 bg-[#1A1A1A] shadow-lg transition-transform transform hover:scale-105 cursor-pointer overflow-hidden">
                    <Link to={`/product/${product._id}`} className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                      <img className="object-cover w-full" src={product.image} alt={product.name} />
                      <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {product?.brand}
                      </span>
                      <div className="absolute inset-0 bg-black bg-opacity-20" />
                    </Link>

                    {/* <HeartIcon product={product} className="absolute top-3 right-3" /> */}

                    <div className="mt-4 px-5 pb-5">
                      <h5 className="text-xl font-semibold tracking-tight text-white">{product.name}</h5>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }, (_, index) => (
                          <svg
                            key={index}
                            className={`w-5 h-5 ${index < product.rating ? "text-yellow-500" : "text-gray-400"}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-300">({product.numReviews} reviews)</span>
                      </div>
                      <p className="mt-2 mb-5 text-[#CFCFCF]">{product?.description?.substring(0, 60)}...</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-emerald-400">
                          {product.price.toLocaleString("en-US", { style: "currency", currency: "INR" })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/product/${product._id}`}
                          className="flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
                        >
                          <span className="mr-1">Read More</span>
                          <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <button
                          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300 ml-4"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart size={22} className="mr-2" />
                          <span>Add to cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
              isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
              isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
