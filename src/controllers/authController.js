import User from "../models/User.js";
import { generateToken } from "../utils/jwtUtils.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return errorResponse(res, "All fields are required");

  const userExists = await User.findOne({ email });
  if (userExists) return errorResponse(res, "User already exists");

  const user = await User.create({ name, email, password });
  successResponse(res, "User registered successfully", {
    token: generateToken(user),
  });
};

export const login = async (req, res) => {
  try {
    console.log("🔍 Login Request:", req.body); // Log request data

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return errorResponse(res, "Invalid email or password", 401);
    }

    console.log("✅ Login Successful:", user.email);
    successResponse(res, "Login successful", {
      token: generateToken(user),
      user,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    errorResponse(res, "Something went wrong", 500);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return errorResponse(res, "User not found", 404);

    successResponse(res, "User retrieved successfully", user);
  } catch (error) {
    errorResponse(res, "Failed to fetch user", 500);
  }
};
