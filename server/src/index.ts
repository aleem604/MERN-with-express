import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import corsOptions from "./utils/cors";

dotenv.config();

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

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
