import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";


const stripePromise = loadStripe(
	"pk_test_51QEuKAIrJpUVN2g9mtkmhRZc7TbNAzwVUuSRSxuqnqjzDc30hGaUb0Wk2KVuhXXz9LdF1RV49xEC8p3xUQbemGu400Jz39ImCp"
);

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);


	const handlePayment = async () => {

		const stripe = await stripePromise;
		const res = await axiosInstance.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});

		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};


// const handlePayment = async () => {
// 	try {
// 		// Get the Stripe instance
// 		const stripe = await stripePromise;

// 		// Send a request to your backend to create a checkout session
// 		const res = await axiosInstance.post("/payments/create-checkout-session", {
// 			products: cart, // Assuming `cart` is your list of products
// 			couponCode: coupon ? coupon.code : null, // Apply coupon if available
// 		});

// 		// Extract session data
// 		const session = res.data;

// 		// Redirect to Stripe's Checkout page
// 		const result = await stripe.redirectToCheckout({
// 			sessionId: session.id, // Pass the session ID from backend response
// 		});

// 		// Error handling for redirection issues
// 		if (result.error) {
// 			console.error("Redirection Error:", result.error.message);
// 			// Optionally, show an error message to the user here
// 		}
// 	} catch (error) {
// 		// Handle any errors during the payment initiation process
// 		console.error("Payment initiation failed:", error);
// 		// Display an error message to the user or take additional actions
// 	}
// };


	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<p className='text-xl font-semibold text-emerald-400'>Order summary</p>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<dl className='flex items-center justify-between gap-4'>
						<dt className='text-base font-normal text-gray-300'>Original price</dt>
						<dd className='text-base font-medium text-white'>₹{formattedSubtotal}</dd>
					</dl>

					{savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-emerald-400'>-₹{formattedSavings}</dd>
						</dl>
					)}

					{coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-emerald-400'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}
					<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-emerald-400'>₹{formattedTotal}</dd>
					</dl>
				</div>

				<motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>

				<div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
};
export default OrderSummary;