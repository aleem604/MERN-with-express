// src/controllers/webhookController.ts
import Stripe from "stripe";
import Order from "../models/order";
import { Request, Response } from "express";
const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: "2025-08-27.basil" });

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  const payload = req.body; // ensure express.raw is used for this route
  try {
    const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata.orderId;
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).send();
      order.status = "paid";
      if (order.payment) {
        order.payment.success = true;
        order.payment.raw = pi;
      }
      await order.save();

      // finalize reservations -> decrement stock permanently
      // trigger fulfillment email/job
    }

    if (event.type === "payment_intent.payment_failed") {
      // mark order failed, release reservations
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error", err);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
