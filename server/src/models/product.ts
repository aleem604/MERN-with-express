import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const productSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
