import express from "express";
import { getCopoun, validateCopoun } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()


router.get("/",protectRoute,getCopoun)
router.get("/validate",protectRoute,validateCopoun)


export default router;