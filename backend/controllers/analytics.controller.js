// import Order from "../models/order.model.js";
// import Product from "../models/product.model.js";
// import User from "../models/user.model.js";

// export const getAnalyticsData = async () => {
// 	const totalUsers = await User.countDocuments();
// 	const totalProducts = await Product.countDocuments();

// 	const salesData = await Order.aggregate([
// 		{
// 			$group: {
// 				_id: null, // it groups all documents together,
// 				totalSales: { $sum: 1 },
// 				totalRevenue: { $sum: "$totalAmount" },
// 			},
// 		},
// 	]);

// 	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

// 	return {
// 		users: totalUsers,
// 		products: totalProducts,
// 		totalSales,
// 		totalRevenue,
// 	};
// };

// export const getDailySalesData = async (startDate, endDate) => {
// 	try {
// 		const dailySalesData = await Order.aggregate([
// 			{
// 				$match: {
// 					createdAt: {
// 						$gte: startDate,
// 						$lte: endDate,
// 					},
// 				},
// 			},
// 			{
// 				$group: {
// 					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
// 					sales: { $sum: 1 },
// 					revenue: { $sum: "$totalAmount" },
// 				},
// 			},
// 			{ $sort: { _id: 1 } },
// 		]);

// 		// example of dailySalesData
// 		// [
// 		// 	{
// 		// 		_id: "2024-08-18",
// 		// 		sales: 12,
// 		// 		revenue: 1450.75
// 		// 	},
// 		// ]

// 		const dateArray = getDatesInRange(startDate, endDate);
// 		// console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

// 		return dateArray.map((date) => {
// 			const foundData = dailySalesData.find((item) => item._id === date);

// 			return {
// 				date,
// 				sales: foundData?.sales || 0,
// 				revenue: foundData?.revenue || 0,
// 			};
// 		});
// 	} catch (error) {
// 		throw error;
// 	}
// };

// function getDatesInRange(startDate, endDate) {
// 	const dates = [];
// 	let currentDate = new Date(startDate);

// 	while (currentDate <= endDate) {
// 		dates.push(currentDate.toISOString().split("T")[0]);
// 		currentDate.setDate(currentDate.getDate() + 1);
// 	}

// 	return dates;
// }













import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]);

        const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

        return {
            users: totalUsers,
            products: totalProducts,
            totalSales,
            totalRevenue,
        };
    } catch (error) {
        console.error("Error in getAnalyticsData:", error);
        throw error; // Re-throw the error to be caught by the route handler
    }
};

export const getDailySalesData = async (startDate, endDate) => {
    try {
        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const dateArray = getDatesInRange(startDate, endDate);

        return dateArray.map((date) => {
            const foundData = dailySalesData.find((item) => item._id === date);

            return {
                name: date,
                sales: foundData?.sales || 0,
                revenue: foundData?.revenue || 0,
            };
        });
    } catch (error) {
        console.error("Error in getDailySalesData:", error);
        throw error;
    }
};

export const getWeeklySalesData = async () => {
    try {
        // Calculate the start and end dates for the current week
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // End of the week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999);

        console.log("Start of Week:", startOfWeek);
        console.log("End of Week:", endOfWeek);

        const weeklySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfWeek,
                        $lte: endOfWeek,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-W%U", date: "$createdAt" } },
                    name: { $first: { $dateToString: { format: "%Y-W%U", date: "$createdAt" } } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        console.log("Weekly Sales Data:", weeklySalesData);
        return weeklySalesData;
    } catch (error) {
        console.error("Error in getWeeklySalesData:", error);
        throw error;
    }
};

export const getMonthlySalesData = async (startDate, endDate) => {
    try {
        const monthlySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    name: { $first: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return monthlySalesData;
    } catch (error) {
        console.error("Error in getMonthlySalesData:", error);
        throw error;
    }
};

export const getYearlySalesData = async () => {
    try {
        const yearlySalesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
                    name: { $first: { $dateToString: { format: "%Y", date: "$createdAt" } } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return yearlySalesData;
    } catch (error) {
        console.error("Error in getYearlySalesData:", error);
        throw error;
    }
};

function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
