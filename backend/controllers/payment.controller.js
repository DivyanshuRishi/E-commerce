



import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		// Check if the products array is valid
		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;
		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Stripe requires amounts in cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "inr",
					product_data: { 
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			// Verify and apply coupon if it exists
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// Create checkout session with Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.FRONTEND_URL}/purchase-cancel`,
			discounts: coupon ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }] : [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		// Optionally create a gift coupon if totalAmount meets criteria
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		// Respond with session details
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		// console.log(sessionId)

		// Ensure sessionId is valid
		const existingOrder = await Order.findOne({ stripeSession: sessionId });
		if (!sessionId || !session) {
			return res.status(400).json({ message: "Invalid session or sessionId" });
		}
		if (existingOrder) {
			return res.status(400).json({ message: "Order with this session ID already exists." });
		}



		if (session.payment_status === "paid") {
			// Deactivate the coupon if it was used
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{ code: session.metadata.couponCode, userId: session.metadata.userId },
					{ isActive: false }
				);
			}

			// console.log(session.metadata)
			// Create a new order
			const products = JSON.parse(session.metadata.products);
			if (products.length === 0) {
				return res.status(400).json({ message: "No products in the session" });
			}
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // Convert from cents to actual currency
				stripeSession: sessionId,
			});

			await newOrder.save();

			// Send success response with order ID
			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		} else {
			res.status(400).json({ message: "Payment not completed." });
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

// Helper function to create a Stripe coupon
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});
	return coupon.id;
}

// Helper function to create a new coupon for future use
async function createNewCoupon(userId) {
	// Delete any existing coupon for the user to avoid duplicates
	await Coupon.findOneAndDelete({ userId });

	// Create a new gift coupon
	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
		userId: userId,
	});

	await newCoupon.save();
	return newCoupon;
}

// import { stripe } from "../lib/stripe.js";
// import Coupon from "../models/coupon.model.js";
// import Order from "../models/order.model.js";

// // Create checkout session for the user
// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { products, couponCode } = req.body;

//     // Check if the products array is valid
//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ error: "Invalid or empty products array" });
//     }

//     let totalAmount = 0;
//     const lineItems = products.map((product) => {
//       const amount = Math.round(product.price * 100); // Stripe requires amounts in cents
//       totalAmount += amount * product.quantity;

//       return {
//         price_data: {
//           currency: "inr",
//           product_data: { 
//             name: product.name,
//             images: [product.image],
//           },
//           unit_amount: amount,
//         },
//         quantity: product.quantity || 1,
//       };
//     });

//     let coupon = null;
//     if (couponCode) {
//       // Verify and apply coupon if it exists
//       coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
//       if (coupon) {
//         totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
//       }
//     }

//     // Create checkout session with Stripe
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/purchase-cancel`,
//       discounts: coupon ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }] : [],
//       metadata: {
//         userId: req.user._id.toString(),
//         couponCode: couponCode || "",
//         products: JSON.stringify(
//           products.map((p) => ({
//             id: p._id,
//             quantity: p.quantity,
//             price: p.price,
//           }))
//         ),
//       },
//     });

//     // Optionally create a gift coupon if totalAmount meets criteria
//     if (totalAmount >= 20000) {
//       await createNewCoupon(req.user._id);
//     }

//     // Respond with session details
//     res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
//   } catch (error) {
//     console.error("Error processing checkout:", error);
//     res.status(500).json({ message: "Error processing checkout", error: error.message });
//   }
// };

// // Handle checkout success
// // export const checkoutSuccess = async (req, res) => {
// //   try {
// //     const { sessionId } = req.body;
// //     const session = await stripe.checkout.sessions.retrieve(sessionId);
// //     console.log(session, sessionId)

// //     // Ensure sessionId is valid
// //     if (!sessionId || !session) {
// //       return res.status(400).json({ message: "Invalid session or sessionId" });
// //     }

// //     if (session.payment_status === "paid") {
// //       // Deactivate the coupon if it was used
// //       if (session.metadata.couponCode) {
// //         await Coupon.findOneAndUpdate(
// //           { code: session.metadata.couponCode, userId: session.metadata.userId },
// //           { isActive: false }
// //         );
// //       }

// //       // Create a new order
// //       const products = JSON.parse(session.metadata.products);
// //       if (products.length === 0) {
// //         return res.status(400).json({ message: "No products in the session" });
// //       }

// //       const newOrder = new Order({
// //         user: session.metadata.userId,
// //         products: products.map((product) => ({
// //           product: product.id,
// //           quantity: product.quantity,
// //           price: product.price,
// //         })),
// //         totalAmount: session.amount_total / 100, // Convert from cents to actual currency
// //         stripeSessionId: sessionId,
// //       });

// //       await newOrder.save();

// //       // Send success response with order ID
// //       res.status(200).json({
// //         success: true,
// //         message: "Payment successful, order created, and coupon deactivated if used.",
// //         orderId: newOrder._id,
// //       });
// //     } else {
// //       res.status(400).json({ message: "Payment not completed." });
// //     }
// //   } catch (error) {
// //     console.error("Error sprocessing successful checkout:", error);
// //     res.status(500).json({ message: "Error processing successful checkout", error: error.message });
// //   }
// // };

// export const checkoutSuccess = async (req, res) => {
//     try {
//         const { sessionId } = req.body;
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         if (!sessionId || !session || !session.id) {
//             return res.status(400).json({ message: "Invalid or missing session information" });
//         }

//         if (session.payment_status === "paid") {
//             // Deactivate the coupon if used
//             if (session.metadata.couponCode) {
//                 await Coupon.findOneAndUpdate(
//                     { code: session.metadata.couponCode, userId: session.metadata.userId },
//                     { isActive: false }
//                 );
//             }

//             const products = JSON.parse(session.metadata.products);
//             if (products.length === 0) {
//                 return res.status(400).json({ message: "No products in the session" });
//             }

//             const stripeSessionId = session.id;

//             const newOrder = new Order({
//                 user: session.metadata.userId,
//                 products: products.map((product) => ({
//                     product: product.id,
//                     quantity: product.quantity,
//                     price: product.price,
//                 })),
//                 totalAmount: session.amount_total / 100,
//                 stripeSessionId,
//             });

//             await newOrder.save();

//             res.status(200).json({
//                 success: true,
//                 message: "Payment successful, order created, and coupon deactivated if used.",
//                 orderId: newOrder._id,
//             });
//         } else {
//             res.status(400).json({ message: "Payment not completed." });
//         }
//     } catch (error) {
//         console.error("Error processing successful checkout:", error);
//         res.status(500).json({
//             message: "Error processing successful checkout",
//             error: error.message,
//         });
//     }
// };


  



// // Helper function to create a Stripe coupon
// async function createStripeCoupon(discountPercentage) {
//   const coupon = await stripe.coupons.create({
//     percent_off: discountPercentage,
//     duration: "once",
//   });
//   return coupon.id;
// }

// // Helper function to create a new coupon for future use
// async function createNewCoupon(userId) {
//   // Delete any existing coupon for the user to avoid duplicates
//   await Coupon.findOneAndDelete({ userId });

//   // Create a new gift coupon
//   const newCoupon = new Coupon({
//     code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
//     discountPercentage: 10,
//     expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
//     userId: userId,
//   });

//   await newCoupon.save();
//   return newCoupon;
// }
