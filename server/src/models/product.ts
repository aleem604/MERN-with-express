import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description?: string;
  price: number; // store in cents
  currency: string;
  imageUrl?: string;
  sku?: string;
  stock: number;
  attributes: Record<string, any>; // flexible key-value
  metadata: Record<string, any>;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }, // cents or decimal? use cents integer for money
  currency: { type: String, default: "USD" },
  imageUrl: String,
  sku: { type: String, index: true },
  stock: { type: Number, default: 0 }, // available stock
  attributes: { type: Object, default: {} }, // size, color, etc
  metadata: { type: Object, default: {} },
createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model<IProduct>("Product", productSchema);
