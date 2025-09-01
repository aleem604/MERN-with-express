import { Response } from "express";
import Product, { IProduct } from "../models/product";
import { AuthRequest } from "../middlewares/auth.middleware";

// Create new product
export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const product: IProduct = new Product({
      ...req.body,
      createdBy: req.user.id,  // 👈 assign logged-in user
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(400).json({ message: "Error creating product", error: error.message });
  }
};

// Get all products (optionally populate user)
export const getProducts = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate("createdBy", "name email"); // 👈 populate user info
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email");
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update product (only if user is creator)
export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.createdBy.toString() !== req.user.id) {
      res.status(403).json({ message: "Forbidden: Not product owner" });
      return;
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: "Error updating product", error: error.message });
  }
};

// Delete product (only if user is creator)
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.createdBy.toString() !== req.user.id) {
      res.status(403).json({ message: "Forbidden: Not product owner" });
      return;
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
