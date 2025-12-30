// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';

// @Injectable()
// export class PaymentService {
// 	private stripe: Stripe;

// 	constructor() {
// 		this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
// 			// @ts-ignore
// 			apiVersion: '2025-11-30',
// 		});
// 	}

// 	async processStripePayment(amount: number, currency = 'usd', paymentMethodId: string) {
// 		try {
// 			const paymentIntent = await this.stripe.paymentIntents.create({
// 				amount, // centlarda: $10 → 1000
// 				currency,
// 				payment_method: paymentMethodId,
// 				confirm: true,
// 			});

// 			return {
// 				success: paymentIntent.status === 'succeeded',
// 				paymentId: paymentIntent.id,
// 				status: paymentIntent.status,
// 			};
// 		} catch (error) {
// 			return { success: false, message: error.message };
// 		}
// 	}
// }
