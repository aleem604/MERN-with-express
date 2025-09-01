import { Stripe } from "stripe";
import Product from "../models/product";
import Order from "../models/order";
import { NextFunction, Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: "2025-08-27.basil" });

export const createCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, shippingAddress, shippingMethod, discountCode, currency = "USD", customerEmail } = req.body;

    // 1. Fetch products & validate
    const productIds = items.map((i: { productId: any; }) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // compute subtotal
    let subtotalCents = 0;
    const lineItems = items.map((it: { productId: string; quantity: number; }) => {
      const p = products.find(x => String(x._id) === it.productId);
      if (!p) throw new Error("Invalid product");
      subtotalCents += Math.round(p.price * 100) * it.quantity;
      return {
        price_data: {
          currency,
          product_data: { name: p.title },
          unit_amount: Math.round(p.price * 100)
        },
        quantity: it.quantity
      };
    });

    // 2. shipping/tax/discount
    const shippingCents = 0; // call shipping calculator
    const taxCents = Math.round(subtotalCents * 0.1); // example 10%
    const discountCents = 0;

    const totalCents = subtotalCents + shippingCents + taxCents - discountCents;

    // 3. Create pending order in DB
    const order = await Order.create({
      customerEmail,
      items: items.map((it: { productId: any; title: any; price: number; quantity: any; }) => ({ product: it.productId, title: it.title, priceCents: Math.round(it.price*100), quantity: it.quantity })),
      subtotalCents, shippingCents, taxCents, discountCents, totalCents, currency,
      status: "pending"
    });

    // optional: create reservations here

    // 4. Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency,
      metadata: { orderId: order._id.toString() },
      receipt_email: customerEmail
    });

    // Save provider id on order
    order.payment = { provider: "stripe", providerPaymentId: paymentIntent.id, success: false, raw: {} };
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (err) { next(err); }
};
