// import express from "express";
// import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";
// import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.get("/", protectRoute, adminRoute, async (req, res) => {
// 	try {
// 		const analyticsData = await getAnalyticsData();

// 		const endDate = new Date();
// 		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

// 		const dailySalesData = await getDailySalesData(startDate, endDate);

// 		res.json({
// 			analyticsData,
// 			dailySalesData,
// 		});
// 	} catch (error) {
// 		console.log("Error in analytics route", error.message);
// 		res.status(500).json({ message: "Server error", error: error.message });
// 	}
// });

// export default router;




import express from "express";
import { getAnalyticsData, getDailySalesData, getMonthlySalesData, getWeeklySalesData, getYearlySalesData } from "../controllers/analytics.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesData,
        });
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/weekly", protectRoute, adminRoute, async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklySalesData = await getWeeklySalesData(startDate, endDate);
    res.json({ weeklySalesData });
  } catch (error) {
    console.log("Error in weekly analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/monthly", protectRoute, adminRoute, async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Approximate a month
    const monthlySalesData = await getMonthlySalesData(startDate, endDate);
    res.json({ monthlySalesData });
  } catch (error) {
    console.log("Error in monthly analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/yearly", protectRoute, adminRoute, async (req, res) => {
  try {
    const yearlySalesData = await getYearlySalesData();
    res.json({ yearlySalesData });
  } catch (error) {
    console.log("Error in yearly analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
