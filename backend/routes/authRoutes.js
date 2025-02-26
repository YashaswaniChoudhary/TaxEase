const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
 

  // Login Route
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Received Email:", email);
      console.log("Received Password:", password);
  
      // Check if user exists
      const user = await User.findOne({email});
      console.log("User Found:", user);

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Compare password
      console.log("Stored Hashed Password:", user.password);
      console.log("Length of Received Password:", password.length);
      console.log("Length of Stored Hashed Password:", user.password.length)
      
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password Match:", isMatch);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

// Get user profile (Protected Route)
router.get("/profile", authMiddleware, async (req, res) => {
    // res.status(200).json(req.user);
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;