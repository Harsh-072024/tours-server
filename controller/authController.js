import User from "../models/User.js";
import bcrypt from "bcryptjs"; // Using bcryptjs
import jwt from "jsonwebtoken";

// User registration
export const register = async (req, res) => {
  try {
    // Generate salt and hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      photo: req.body.photo,
    });

    // Save user to the database
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User successfully registered",
    });
  } catch (error) {
    console.error("Registration Error:", error); // Log errors for debugging
    res.status(500).json({
      success: false,
      message: "Failed to register user. Please try again.",
    });
  }
};

// User login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // Exclude sensitive fields from response
    const { password: _, role, ...userDetails } = user._doc;

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY || "defaultSecretKey", // Fallback to default secret for development
      { expiresIn: "15d" } // Token valid for 15 days
    );

    // Set the token in cookies
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "none", // Required for cross-origin cookies
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days expiration
      })
      .status(200)
      .json({
        success: true,
        message: "Successfully logged in",
        data: userDetails,
        role,
      });
  } catch (error) {
    console.error("Login Error:", error); // Log errors for debugging
    res.status(500).json({
      success: false,
      message: "Failed to login. Please try again.",
      error: error.message,
    });
  }
};
