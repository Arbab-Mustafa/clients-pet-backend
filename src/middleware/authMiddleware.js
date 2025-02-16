import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/responseHandler.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    console.log("Token Received:", token); // Log the received token

    if (!token) return errorResponse(res, "No token provided", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Log the decoded token

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return errorResponse(res, "User not found", 404);

    next();
  } catch (error) {
    console.log("Token Error:", error.message); // Log token errors
    errorResponse(res, "Invalid token", 401);
  }
};
