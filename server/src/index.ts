import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import corsOptions from "./utils/cors";
import { setupSwagger } from "./swagger";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();
const router = Router();

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Setup Swagger
setupSwagger(app);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "",)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));

// Sample route
app.get("/", (_req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
