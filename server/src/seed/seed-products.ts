import mongoose from "mongoose";
import axios from "axios";
import Product from "../models/product";
import connectDB from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const dbConn = connectDB;

const seedProducts = async () => {
  try {

    // Example external API: FakeStore API
    const { data } = await axios.get("https://fakestoreapi.com/products");

    // Transform API → match schema
    const products = data.map((item: any) => ({
      title: item.title,
      description: item.description,
      price: item.price,
      imageUrl: item.image
    }));

    // Insert new ones
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

export default seedProducts;

