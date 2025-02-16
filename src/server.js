dotenv.config();
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointments from "./routes/appointmentRoutes.js";
import cors from "cors";

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Use authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointments);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
