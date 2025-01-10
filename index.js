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
const port = process.env.PORT || 8002;

// Variable to track if MongoDB connection has been established
let isConnected = false;

// Database connection function with pooling and retry logic
const connect = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    // Ensure we are using the correct MongoDB URI
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;
    console.log("MongoDB database connected");
  } catch (err) {
    console.error("MongoDB database connection failed:", err);
    // Retry logic in case of failure
    setTimeout(connect, 5000); // Retry connection after 5 seconds
  }
};

// Define CORS options
const corsOptions = {
  origin: ["https://tours-client-kappa.vercel.app"], // Adjust the front-end URL if necessary
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoute);

// Start the server with a retry mechanism
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connect(); // Ensure the database connection is established before accepting requests
});
