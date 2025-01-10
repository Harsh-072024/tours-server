import User from "../models/User.js";
import bcrypt from "bcryptjs"; // Using bcryptjs
import jwt from "jsonwebtoken";

// User registration
export const register = async (req, res) => {
  try {
    // Hashing password
    const salt = bcrypt.genSaltSync(10); // Generate salt
    const hash = bcrypt.hashSync(req.body.password, salt); // Hash the password

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      photo: req.body.photo,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "Successfully created" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create, try again" });
  }
};

// User login
export const login = async (req, res) => {
  const email = req.body.email;
  try {
    console.log("Email:", email); // Check if email is passed correctly

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // Log if user is not found
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare password
    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log("Password Match:", checkCorrectPassword); // Log if the password matches

    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const { password, role, ...rest } = user._doc;

    console.log("JWT Secret:", process.env.JWT_SECRET_KEY); // Log if JWT secret is available
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY || "defaultSecretKey",
      { expiresIn: "15d" }
    );

    // Set token in browser cookies and send response to the client
    res
      .cookie("accessToken", token, {
        // httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days expiration
      })
      .status(200)
      .json({
        token,
        success: true,
        message: "Successfully logged in",
        data: { ...rest },
        role,
      });
  } catch (error) {
    console.error("Login Error:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Failed to login", error: error.message });
  }
};
