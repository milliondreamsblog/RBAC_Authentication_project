const { Router } = require("express");
const { z } = require("zod");
const usersRoutes = Router();
const jwt = require("jsonwebtoken");
const { userModel, purchaseModel } = require("../db");
const { JWT_SECRET } = require("../config");
const { userAuth } = require("../middleware/user"); // role-based middleware for "user"
const bcrypt = require("bcrypt");

// Zod validation schemas
const signupSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
});

const signinSchema = z.object({
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Signup Route
usersRoutes.post("/signup", async (req, res) => {
    try {
        // Validate request body using Zod
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.errors,
            });
        }

        const { email, password, firstname, lastname } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Attempt to create the user
        await userModel.create({
            email,
            password: hashedPassword, // Save hashed password
            firstname,
            lastname,
            role: "user", //Role
        });

        res.json({
            message: "User signup successful",
        });
    } catch (error) { // Handle duplicate key error
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email address.",
            });
        }// Handle other  errors
        console.error("Error during signup:", error);
        res.status(500).json({
            message: "An error occurred during signup",
            error: error.message,
        });
    }
});

// Signin Route
usersRoutes.post("/signin", async (req, res) => {
    try {
        // Validate request body using Zod
        const validationResult = signinSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.errors,
            });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email, role: "user" });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ token });
        } else {
            res.status(401).json({
                message: "Invalid credentials",
            });
        }
        // Handle other unexpected errors
    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({
            message: "An error occurred during signin",
            error: error.message,
        });
    }
});

// Get Purchases Route
usersRoutes.get("/purchases", userAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const purchases = await purchaseModel.find({ userId });

        res.json({
            purchases,
            message: "Your purchases",
        });
    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({
            message: "An error occurred while fetching your purchases",
            error: error.message,
        });
    }
});

module.exports = { usersRoutes };
