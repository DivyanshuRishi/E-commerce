import Order from "../models/order.model.js";

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have user ID in req.user
        const orders = await Order.find({ user: userId }).populate("products.product");
        
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};


