import { model, Schema } from "mongoose";

// src/models/Reservation.ts
const ReservationSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  expiresAt: Date
});

export default model("Reservation", ReservationSchema);