// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const OrderPage = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get("/api/orders");
//                 console.log(response)
//                 setOrders(response.data.orders);
//             } catch (error) {
//                 setError("Failed to load orders. Please try again.");
//                 console.error("Error fetching orders:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-lg">Loading...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto p-4">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
//             {orders.length === 0 ? (
//                 <p>No orders found.</p>
//             ) : (
//                 <div className="space-y-4">
//                     {orders.map((order) => (
//                         <div 
//                             key={order._id} 
//                             className="border p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
//                         >
//                             <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
//                             <p className="text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
//                             <p className="text-gray-600">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
//                             <div className="mt-3 space-y-2">
//                                 <h3 className="font-semibold">Items:</h3>
//                                 {(order.products || []).map((item, index) => (
//                                     <div key={index} className="flex justify-between">
//                                         <p>{item.product?.name || "Unknown Product"} x {item.quantity || 1}</p>
//                                         <p>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderPage;



// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useProductStore } from "../stores/useProductStore";
// // import { useProductStore } from "./path/to/store";

// const OrderPage = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { fetchProductById, product } = useProductStore();

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get("/api/orders");
//                 setOrders(response.data.orders);
//             } catch (error) {
//                 setError("Failed to load orders. Please try again.");
//                 console.error("Error fetching orders:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     const loadProductDetails = async (productId) => {
//         await fetchProductById(productId);
//         if (!product) {
//             toast.error("Failed to load product details.");
//         }
//         return product;
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-lg">Loading...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto p-4">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
//             {orders.length === 0 ? (
//                 <p>No orders found.</p>
//             ) : (
//                 <div className="space-y-4">
//                     {orders.map((order) => (
//                         <div
//                             key={order._id}
//                             className="border p-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105"
//                         >
//                             <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
//                             <p className="text-gray-600">
//                                 Order Date: {new Date(order.createdAt).toLocaleDateString()}
//                             </p>
//                             <p className="text-gray-600">
//                                 Total Amount: ₹{order.totalAmount.toFixed(2)}
//                             </p>
//                             <div className="mt-3 space-y-2">
//                                 <h3 className="font-semibold">Items:</h3>
//                                 {(order.products || []).map((item, index) => (
//                                     <div key={index} className="flex items-center space-x-4 p-2 border-b">
//                                         {/* Load product details */}
//                                         <img
//                                             src={item.product?.image || "/default-product.jpg"}
//                                             alt={item.product?.name || "Product Image"}
//                                             className="w-16 h-16 rounded-lg"
//                                         />
//                                         <div className="flex-1">
//                                             <p className="font-semibold">{item.product?.name || "Unknown Product"} x {item.quantity || 1}</p>
//                                             <p className="text-gray-500">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderPage;


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FaCalendarAlt, FaDollarSign, FaShoppingCart } from "react-icons/fa"; // Importing some icons
// import { useProductStore } from "../stores/useProductStore";

// const OrderPage = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { fetchProductById, product } = useProductStore();

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get("/api/orders");
//                 setOrders(response.data.orders);
//             } catch (error) {
//                 setError("Failed to load orders. Please try again.");
//                 console.error("Error fetching orders:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     const loadProductDetails = async (productId) => {
//         await fetchProductById(productId);
//         if (!product) {
//             toast.error("Failed to load product details.");
//         }
//         return product;
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-lg">Loading...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto p-4">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6 text-dark">Your Orders</h1>
//             {orders.length === 0 ? (
//                 <p className="text-lg text-dark">No orders found.</p>
//             ) : (
//                 <div className="space-y-6">
//                     {orders.map((order) => (
//                         <div
//                             key={order._id}
//                             className="border p-6 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 bg-white grid grid-cols-[35%_1fr] gap-4"
//                         >
//                             {/* Left side: Product Image */}
//                             <div className="w-full h-full overflow-hidden rounded-lg">
//                                 <img
//                                     src={order.products[0]?.product?.image || "/default-product.jpg"}
//                                     alt={order.products[0]?.product?.name || "Product Image"}
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>

//                             {/* Right side: Order Info */}
//                             <div className="flex flex-col justify-between">
//                                 <div className="mb-4">
//                                     <h2 className="text-xl font-semibold text-dark">Order ID: {order._id}</h2>
//                                     <p className="text-gray-600 text-sm flex items-center space-x-2">
//                                         <FaCalendarAlt />
//                                         <span>{new Date(order.createdAt).toLocaleDateString()}</span>
//                                     </p>
//                                 </div>

//                                 <p className="text-dark text-lg flex items-center space-x-2 mb-4">
//                                     <FaDollarSign />
//                                     <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
//                                 </p>

//                                 <div className="mt-4 space-y-4">
//                                     <h3 className="text-lg font-semibold text-dark flex items-center space-x-2">
//                                         <FaShoppingCart />
//                                         <span>Items:</span>
//                                     </h3>
//                                     {(order.products || []).map((item, index) => (
//                                         <div key={index} className="flex items-center space-x-6 border-b pb-4">
//                                             <div className="flex-1">
//                                                 <p className="font-semibold text-lg text-dark">{item.product?.name || "Unknown Product"}</p>
//                                                 <p className="text-gray-600 text-sm">
//                                                     Quantity: {item.quantity || 1}
//                                                 </p>
//                                             </div>
//                                             <p className="font-semibold text-lg text-right text-dark">
//                                                 ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderPage;


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FaCalendarAlt, FaShoppingCart } from "react-icons/fa"; // Importing icons
// import { useProductStore } from "../stores/useProductStore";

// const OrderPage = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { fetchProductById, product } = useProductStore();

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get("/api/orders");
//                 setOrders(response.data.orders);
//             } catch (error) {
//                 setError("Failed to load orders. Please try again.");
//                 console.error("Error fetching orders:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     const loadProductDetails = async (productId) => {
//         await fetchProductById(productId);
//         if (!product) {
//             toast.error("Failed to load product details.");
//         }
//         return product;
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p className="text-lg text-gray-700">Loading...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto p-4">
//                 <p className="text-red-500">{error}</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-4xl font-bold mb-8 text-dark">Your Orders</h1>
//             {orders.length === 0 ? (
//                 <p className="text-lg text-dark">No orders found.</p>
//             ) : (
//                 <div className="space-y-8">
//                     {orders.map((order) => (
//                         <div
//                             key={order._id}
//                             className="border border-gray-300 p-6 rounded-lg shadow-lg bg-white  gap-6 hover:shadow-2xl transition-transform transform hover:scale-105"
//                         >
//                             <div className="flex flex-col justify-between text-gray-800">

//                                 <div className="mt-6 space-y-4">
//                                     <h3 className="text-lg font-semibold text-dark flex items-center space-x-2">
//                                         <FaShoppingCart className="text-xl text-dark" />
//                                         <span>Items:</span>
//                                     </h3>
//                                     {(order.products || []).map((item, index) => (
//                                         <div key={index} className="flex items-center space-x-6 border-b pb-4">
//                                             <div className="flex-none w-20 h-20 overflow-hidden rounded-lg">
//                                                 <img
//                                                     src={item.product?.image || "/default-product.jpg"}
//                                                     alt={item.product?.name || "Product Image"}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                             </div>
//                                             <div className="flex-1">
//                                                 <p className="font-semibold text-lg text-dark">{item.product?.name || "Unknown Product"}</p>
//                                                 <p className="text-gray-600 text-sm">
//                                                     Quantity: {item.quantity || 1}
//                                                 </p>
//                                             </div>
//                                             <p className="font-semibold text-lg text-right text-dark">
//                                                 ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
//                                             </p>
//                                             <div className="mt-6 space-y-4">
//                                     <h3 className="text-lg font-semibold text-dark">Order ID: {order._id}</h3>
//                                     <p className="text-sm text-gray-600 flex items-center space-x-2">
//                                         <FaCalendarAlt className="text-xl text-dark" />
//                                         <span>{new Date(order.createdAt).toLocaleDateString()}</span>
//                                     </p>
//                                 </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderPage;




import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaShoppingCart } from "react-icons/fa"; // Importing icons
import { useProductStore } from "../stores/useProductStore";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { fetchProductById, product } = useProductStore();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/api/orders");
                setOrders(response.data.orders);
            } catch (error) {
                setError("Failed to load orders. Please try again.");
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const loadProductDetails = async (productId) => {
        await fetchProductById(productId);
        if (!product) {
            toast.error("Failed to load product details.");
        }
        return product;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader">Loading...</div> {/* You can replace with an actual spinner */}
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-4xl font-bold text-white mb-8">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-lg text-gray-600">No orders found.</p>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-300 p-6 rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col justify-between text-gray-800">
                                <div className="mt-4 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                                        <FaShoppingCart className="text-xl text-gray-700" />
                                        <span>Items:</span>
                                    </h3>
                                    {(order.products || []).map((item, index) => (
                                        <div key={index} className="flex items-center space-x-6 border-b pb-4">
                                            <div className="flex-none w-24 h-24 overflow-hidden rounded-lg">
                                                <img
                                                    src={item.product?.image || "/default-product.jpg"}
                                                    alt={item.product?.name || "Product Image"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg text-gray-800">{item.product?.name || "Unknown Product"}</p>
                                                <p className="text-gray-600 text-sm">
                                                    Quantity: {item.quantity || 1}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-lg text-right text-gray-800">
                                                ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {/* Horizontal layout for Order ID and Date */}
                                <div className="flex justify-between items-center mt-4">
                                    <div className="text-gray-800">
                                        <h3 className="text-lg font-semibold text-gray-700">Order ID: {order._id}</h3>
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                                        <FaCalendarAlt className="text-xl text-gray-700" />
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;
