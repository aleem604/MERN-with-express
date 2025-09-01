// controllers/userController.ts
import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import { AuthRequest } from "../middlewares/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user: IUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // set role from request or default
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "User created successfully", token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


// ----------------- LOGOUT -----------------
export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // With stateless JWTs, logout is handled client-side (discard token).
    res.status(200).json({ message: "Logged out (client should discard token)" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- GET ALL USERS (ADMIN ONLY) -----------------
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requester = await User.findById(req.user.id);
    if (!requester) return res.status(404).json({ message: "Requester not found" });

    const isAdmin = (requester as any).role === "admin";
    if (!isAdmin) return res.status(403).json({ message: "Forbidden: admin only" });

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- GET USER BY ID (ADMIN OR SELF) -----------------
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requester = await User.findById(req.user.id);
    if (!requester) return res.status(404).json({ message: "Requester not found" });

    const isAdmin = (requester as any).role === "admin";
    if (!isAdmin && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- CREATE USER (ADMIN) -----------------
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    // Optional admin-only creation: safeguard if you plan to expose this route.
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requester = await User.findById(req.user.id);
    if (!requester) return res.status(404).json({ message: "Requester not found" });

    const isAdmin = (requester as any).role === "admin";
    if (!isAdmin) return res.status(403).json({ message: "Forbidden: admin only" });

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, ...(role ? { role } : {}) });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ----------------- GET CURRENT USER PROFILE -----------------
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- UPDATE USER (SELF) -----------------
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, password } = req.body;
    const updateData: Partial<IUser> = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- CHANGE PASSWORD (SELF) -----------------
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- RESET PASSWORD (Admin or forgot flow) -----------------
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    // Admin reset (requires admin) OR token-based forgot-password flow (not implemented here)
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requester = await User.findById(req.user.id);
    if (!requester) return res.status(404).json({ message: "Requester not found" });

    const isAdmin = (requester as any).role === "admin";
    if (!isAdmin) return res.status(403).json({ message: "Forbidden: admin only" });

    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- DELETE USER (ADMIN OR SELF) -----------------
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const requester = await User.findById(req.user.id);
    if (!requester) return res.status(404).json({ message: "Requester not found" });

    const isAdmin = (requester as any).role === "admin";
    const targetUserId = req.params.id;

    if (!isAdmin && req.user.id !== targetUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deletedUser = await User.findByIdAndDelete(targetUserId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
