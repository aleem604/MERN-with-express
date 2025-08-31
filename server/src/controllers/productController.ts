import { Request, Response } from "express";
import Product from "../models/product";

export const getProducts = async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const newProduct = new Product({ title, description, price, imageUrl });
    const result = await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
