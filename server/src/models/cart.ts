// src/models/Cart.ts
import { Schema, model } from "mongoose";

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: String,
  priceCents: Number,
  quantity: { type: Number, default: 1 },
  attributes: Object
});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false }, // optional guest cart
  sessionId: { type: String, index: true }, // for guest users
  items: [CartItemSchema]
}, { timestamps: true });

export default model("Cart", CartSchema);
