import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import tourRoute from "./routes/tours.js";
import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import reviewRoute from "./routes/reviews.js";
import bookingRoute from "./routes/bookings.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// Define CORS options
const corsOptions = {
    origin: ["https://tours-client-kappa.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Database connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB database connected");
    } catch (err) {
        console.error("MongoDB database connection failed:", err);
    }
};

// Test Route
app.get("/", (req, res) => {
    res.send("API is working");
});

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

// debug
// Instead of module.exports = (req, res) => {...}
export default (req, res) => {
    console.log("Function started");
  
    // Your function logic here
  
    console.log("Function completed");
    res.status(200).send("Success");
  };
  
  

// Start Server
app.listen(port, () => {
    connect();
    console.log("Server listening on port", port);
});
