import express from 'express';
import { getUserOrders } from '../controllers/order.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', protectRoute, getUserOrders);



export default router;
