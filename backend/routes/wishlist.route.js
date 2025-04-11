import express from 'express';
import { addToWishlist, getUserWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getUserWishlist);
router.post('/', protectRoute, addToWishlist);
router.delete('/:productId', protectRoute, removeFromWishlist);

export default router;
