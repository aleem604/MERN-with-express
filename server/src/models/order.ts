// src/models/Order.ts
import { Schema, model } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  title: String,
  priceCents: Number,
  quantity: Number,
  attributes: Object
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  customerEmail: String,
  items: [OrderItemSchema],
  subtotalCents: Number,
  shippingCents: Number,
  taxCents: Number,
  discountCents: { type: Number, default: 0 },
  totalCents: Number,
  currency: { type: String, default: "USD" },
  status: { type: String, enum: ["pending","paid","processing","shipped","delivered","cancelled","refunded"], default: "pending" },
  payment: {
    provider: String,
    providerPaymentId: String,
    success: Boolean,
    raw: Object
  },
  shippingAddress: Object,
  billingAddress: Object,
  metadata: Object
}, { timestamps: true });

export default model("Order", OrderSchema);
